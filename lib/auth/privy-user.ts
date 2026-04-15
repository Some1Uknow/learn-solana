export type PrivyLinkedAccount = {
  type?: string;
  address?: string | null;
  chain_type?: string | null;
  chainType?: string | null;
  connector_type?: string | null;
  wallet_client_type?: string | null;
  email?: string | null;
  name?: string | null;
  username?: string | null;
  subject?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  profile_picture?: string | null;
  profile_picture_url?: string | null;
  photo_url?: string | null;
  verified_at?: string | number | null;
  first_verified_at?: string | number | null;
  latest_verified_at?: string | number | null;
  verifiedAt?: string | null;
  profilePictureUrl?: string | null;
  profileImageUrl?: string | null;
  profileImage?: string | null;
};

export type PrivyUserLike = {
  id?: string;
  linkedAccounts?: PrivyLinkedAccount[] | null;
  linked_accounts?: PrivyLinkedAccount[] | null;
};

function getLinkedAccounts(user: PrivyUserLike | null | undefined) {
  if (Array.isArray(user?.linkedAccounts)) return user.linkedAccounts;
  if (Array.isArray(user?.linked_accounts)) return user.linked_accounts;
  return [];
}

function findAccount(
  user: PrivyUserLike | null | undefined,
  predicate: (account: PrivyLinkedAccount) => boolean
) {
  return getLinkedAccounts(user).find(predicate) ?? null;
}

export function getPrivyWalletAddress(user: PrivyUserLike | null | undefined) {
  const walletAccount =
    findAccount(user, (account) => {
      const type = account.type?.toLowerCase() ?? "";
      const chainType = account.chain_type ?? account.chainType ?? "";
      return (
        type.includes("wallet") &&
        typeof account.address === "string" &&
        (chainType === "" || chainType === "solana")
      );
    }) ??
    findAccount(user, (account) => typeof account.address === "string");

  return walletAccount?.address ?? null;
}

export function getPrivyEmail(user: PrivyUserLike | null | undefined) {
  const emailAccount =
    findAccount(
      user,
      (account) =>
        account.type === "email" &&
        (typeof account.email === "string" || typeof account.address === "string")
    ) ??
    findAccount(
      user,
      (account) => typeof account.email === "string" || typeof account.address === "string"
    );

  return emailAccount?.email ?? emailAccount?.address ?? null;
}

export function getPrivyDisplayName(user: PrivyUserLike | null | undefined) {
  const namedAccount = findAccount(
    user,
    (account) =>
      typeof account.name === "string" ||
      typeof account.username === "string" ||
      typeof account.display_name === "string" ||
      typeof account.first_name === "string"
  );

  if (namedAccount?.name) return namedAccount.name;
  if (namedAccount?.username) return namedAccount.username;
  if (namedAccount?.display_name) return namedAccount.display_name;
  if (namedAccount?.first_name || namedAccount?.last_name) {
    return [namedAccount.first_name, namedAccount.last_name].filter(Boolean).join(" ");
  }

  const email = getPrivyEmail(user);
  if (email) {
    const localPart = email.split("@")[0];
    if (localPart) return localPart;
  }

  return null;
}

export function getPrivyProfileImage(user: PrivyUserLike | null | undefined) {
  const imageAccount = findAccount(
    user,
    (account) =>
      typeof account.profilePictureUrl === "string" ||
      typeof account.profileImageUrl === "string" ||
      typeof account.profile_picture_url === "string" ||
      typeof account.profile_picture === "string" ||
      typeof account.photo_url === "string" ||
      typeof account.profileImage === "string"
  );

  return (
    imageAccount?.profilePictureUrl ??
    imageAccount?.profileImageUrl ??
    imageAccount?.profile_picture_url ??
    imageAccount?.profile_picture ??
    imageAccount?.photo_url ??
    imageAccount?.profileImage ??
    null
  );
}
