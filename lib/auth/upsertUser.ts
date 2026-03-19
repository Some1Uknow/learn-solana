import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/users';
import { eq } from 'drizzle-orm';

export interface UpsertUserInput {
  walletAddress: string;
  email?: string | null;
  name?: string | null;
  profileImage?: string | null;
}

export interface UpsertUserResult {
  user: {
    id: string;
    walletAddress: string;
    email: string | null;
    name: string | null;
    profileImage: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  created: boolean;
  enrichedFields: string[];
}

export async function upsertUserByWallet(input: UpsertUserInput): Promise<UpsertUserResult> {
  const walletAddress = input.walletAddress;
  const email = input.email ? input.email.toLowerCase() : undefined;
  const { name, profileImage } = input;

  const existing = await db.query.users.findFirst({
    where: eq(users.walletAddress, walletAddress),
  });

  let saved;
  let created = false;
  const enrichedFields: string[] = [];

  if (existing) {
    const updates: Record<string, unknown> = {};
    if (existing.email == null && email) {
      updates.email = email;
      enrichedFields.push('email');
    }
    if (existing.name == null && name) {
      updates.name = name;
      enrichedFields.push('name');
    }
    if (existing.profileImage == null && profileImage) {
      updates.profileImage = profileImage;
      enrichedFields.push('profileImage');
    }

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = new Date();
      await db.update(users).set(updates).where(eq(users.id, existing.id));
      saved = { ...existing, ...updates };
    } else {
      saved = existing;
    }
  } else {
    const inserted = await db
      .insert(users)
      .values({ walletAddress, email, name, profileImage })
      .returning();
    saved = inserted[0];
    created = true;
  }

  return {
    user: {
      id: saved.id,
      walletAddress: saved.walletAddress,
      email: saved.email ?? null,
      name: saved.name ?? null,
      profileImage: saved.profileImage ?? null,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    },
    created,
    enrichedFields,
  };
}
