import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import {
  getPrivyDisplayName,
  getPrivyEmail,
  getPrivyProfileImage,
  getPrivyWalletAddress,
  type PrivyUserLike,
} from "@/lib/auth/privy-user";
import { getPrivyUserById } from "@/lib/auth/privy-server";
import { upsertUserByPrivyId, type UpsertUserResult } from "@/lib/auth/upsertUser";

export interface SyncAppUserInput {
  privyUserId: string;
  profile?: {
    email?: string | null;
    name?: string | null;
    profileImage?: string | null;
    walletAddress?: string | null;
  };
}

export async function syncAppUser(input: SyncAppUserInput): Promise<UpsertUserResult> {
  const { privyUserId, profile } = input;

  const existing = await db.query.users.findFirst({
    where: eq(users.privyUserId, privyUserId),
  });

  const resolvedProfile = {
    email: profile?.email ?? existing?.email ?? null,
    name: profile?.name ?? existing?.name ?? null,
    profileImage: profile?.profileImage ?? existing?.profileImage ?? null,
    walletAddress: profile?.walletAddress ?? existing?.walletAddress ?? null,
  };

  let privyUser: PrivyUserLike | null = null;
  const needsPrivyProfile =
    !resolvedProfile.email ||
    !resolvedProfile.name ||
    !resolvedProfile.profileImage ||
    !resolvedProfile.walletAddress;

  if (needsPrivyProfile) {
    privyUser = await getPrivyUserById(privyUserId);
  }

  return upsertUserByPrivyId({
    privyUserId,
    email: resolvedProfile.email ?? getPrivyEmail(privyUser),
    name: resolvedProfile.name ?? getPrivyDisplayName(privyUser),
    profileImage: resolvedProfile.profileImage ?? getPrivyProfileImage(privyUser),
    walletAddress: resolvedProfile.walletAddress ?? getPrivyWalletAddress(privyUser),
  });
}
