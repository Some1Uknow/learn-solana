import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { config } from "dotenv";

config({ path: ".env" });

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

// Create the connection
const client = postgres(connectionString, {
  max: 1,
  ssl: require,
});

export const db = drizzle(client, { schema });
