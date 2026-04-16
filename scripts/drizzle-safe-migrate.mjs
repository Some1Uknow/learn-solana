import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: ".env", quiet: true });

const migrationsDir = path.join(process.cwd(), "drizzle");
const journalPath = path.join(migrationsDir, "meta", "_journal.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readMigration(entry) {
  const filePath = path.join(migrationsDir, `${entry.tag}.sql`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing migration SQL file for journal entry: ${entry.tag}`);
  }

  const sqlText = fs.readFileSync(filePath, "utf8");
  const hash = crypto.createHash("sha256").update(sqlText).digest("hex");
  const statements = sqlText
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter(Boolean);

  return {
    tag: entry.tag,
    when: Number(entry.when),
    hash,
    statements,
  };
}

function findStraySqlFiles(migrations) {
  const journalTags = new Set(migrations.map((migration) => migration.tag));

  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .map((file) => file.replace(/\.sql$/, ""))
    .filter((tag) => !journalTags.has(tag));
}

function assertRemoteHistory({ migrations, remoteRows }) {
  const localHashes = new Map(migrations.map((migration) => [migration.hash, migration]));
  const remoteHashes = new Map(remoteRows.map((row) => [row.hash, row]));
  const latestRemoteMillis = remoteRows.reduce(
    (latest, row) => Math.max(latest, Number(row.created_at)),
    0
  );

  const unknownRemoteRows = remoteRows.filter((row) => !localHashes.has(row.hash));
  if (unknownRemoteRows.length) {
    const hashes = unknownRemoteRows.map((row) => row.hash).join(", ");
    throw new Error(`Remote Drizzle journal contains hashes missing locally: ${hashes}`);
  }

  const missingHistoricalRows = migrations.filter(
    (migration) => migration.when <= latestRemoteMillis && !remoteHashes.has(migration.hash)
  );
  if (missingHistoricalRows.length) {
    const tags = missingHistoricalRows.map((migration) => migration.tag).join(", ");
    throw new Error(`Remote Drizzle journal is missing already-past local migrations: ${tags}`);
  }

  const pending = migrations.filter((migration) => migration.when > latestRemoteMillis);
  return { pending, latestRemoteMillis };
}

async function main() {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not set. Add it to .env or the shell environment.");
  }

  if (!fs.existsSync(journalPath)) {
    throw new Error("Missing drizzle/meta/_journal.json");
  }

  const journal = readJson(journalPath);
  const migrations = journal.entries.map(readMigration);
  const straySqlFiles = findStraySqlFiles(migrations);
  const sql = postgres(process.env.POSTGRES_URL, {
    ssl: process.env.POSTGRES_URL.includes("localhost") ? false : "require",
    onnotice: () => {},
  });

  try {
    await sql.unsafe("create schema if not exists drizzle");
    await sql.unsafe(
      "create table if not exists drizzle.__drizzle_migrations (id serial primary key, hash text not null, created_at bigint)"
    );

    const remoteRows = await sql.unsafe(
      "select id, hash, created_at from drizzle.__drizzle_migrations order by created_at asc, id asc"
    );
    const { pending } = assertRemoteHistory({ migrations, remoteRows });

    if (!pending.length) {
      console.log("No pending migrations.");
      if (straySqlFiles.length) {
        console.log(`Ignored SQL files not referenced by journal: ${straySqlFiles.join(", ")}`);
      }
      return;
    }

    await sql.begin(async (tx) => {
      for (const migration of pending) {
        for (const statement of migration.statements) {
          await tx.unsafe(statement);
        }
        await tx.unsafe(
          "insert into drizzle.__drizzle_migrations (hash, created_at) values ($1, $2)",
          [migration.hash, migration.when]
        );
        console.log(`Applied ${migration.tag}`);
      }
    });

    if (straySqlFiles.length) {
      console.log(`Ignored SQL files not referenced by journal: ${straySqlFiles.join(", ")}`);
    }
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
