import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/users';
import { eq } from 'drizzle-orm';

export interface UpsertUserInput {
  walletAddress?: string | null;
  privyUserId?: string | null;
  email?: string | null;
  name?: string | null;
  profileImage?: string | null;
}

export interface UpsertUserResult {
  user: {
    id: string;
    walletAddress: string | null;
    privyUserId: string | null;
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
  if (!walletAddress) {
    throw new Error("walletAddress is required");
  }
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
      .values({ walletAddress, email, name, profileImage, privyUserId: input.privyUserId ?? null })
      .returning();
    saved = inserted[0];
    created = true;
  }

  return {
    user: {
      id: saved.id,
      walletAddress: saved.walletAddress ?? null,
      privyUserId: saved.privyUserId ?? null,
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

export async function upsertUserByPrivyId(input: UpsertUserInput): Promise<UpsertUserResult> {
  const privyUserId = input.privyUserId;
  if (!privyUserId) {
    throw new Error("privyUserId is required");
  }

  const email = input.email ? input.email.toLowerCase() : undefined;
  const { name, profileImage, walletAddress } = input;

  let saved;
  let created = false;
  const enrichedFields: string[] = [];

  const inserted = await db
    .insert(users)
    .values({
      privyUserId,
      walletAddress: walletAddress ?? null,
      email,
      name,
      profileImage,
    })
    .onConflictDoNothing({
      target: users.privyUserId,
    })
    .returning();

  if (inserted[0]) {
    saved = inserted[0];
    created = true;
  } else {
    const existing = await db.query.users.findFirst({
      where: eq(users.privyUserId, privyUserId),
    });

    if (!existing) {
      throw new Error("Failed to resolve user after Privy upsert");
    }

    const updates: Record<string, unknown> = {};

    if (email && existing.email !== email) {
      updates.email = email;
      enrichedFields.push("email");
    }
    if (name && existing.name !== name) {
      updates.name = name;
      enrichedFields.push("name");
    }
    if (profileImage && existing.profileImage !== profileImage) {
      updates.profileImage = profileImage;
      enrichedFields.push("profileImage");
    }
    if (walletAddress && existing.walletAddress !== walletAddress) {
      updates.walletAddress = walletAddress;
      enrichedFields.push("walletAddress");
    }

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = new Date();
      await db.update(users).set(updates).where(eq(users.id, existing.id));
      saved = { ...existing, ...updates };
    } else {
      saved = existing;
    }
  }

  return {
    user: {
      id: saved.id,
      walletAddress: saved.walletAddress ?? null,
      privyUserId: saved.privyUserId ?? null,
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
