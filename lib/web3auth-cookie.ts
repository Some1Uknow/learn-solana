import type { IWeb3AuthState } from "@web3auth/modal";

const WEB3AUTH_COOKIE_KEY = "Web3Auth-state";

type SerializableRecord = Record<string, unknown>;

type SerializedHelper = SerializableRecord & {
  __type?: string;
  value?: unknown;
};

function reviveValue(value: unknown): unknown {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  const record = value as SerializedHelper;

  if (record.__type === "bigint") {
    return BigInt(String(record.value ?? "0"));
  }

  if (record.__type === "Map" && Array.isArray(record.value)) {
    return new Map(record.value as Array<[unknown, unknown]>);
  }

  return value;
}

function safeDeserialize(value: string): IWeb3AuthState | undefined {
  try {
    return JSON.parse(value, (_, inner) => reviveValue(inner)) as IWeb3AuthState;
  } catch {
    return undefined;
  }
}

export function parseWeb3AuthStateFromCookie(cookieHeader?: string | null): IWeb3AuthState | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  const segments = cookieHeader.split(/;\s*/);
  const entry = segments.find((segment) => segment.startsWith(`${WEB3AUTH_COOKIE_KEY}=`));

  if (!entry) {
    return undefined;
  }

  const raw = entry.slice(WEB3AUTH_COOKIE_KEY.length + 1);
  return safeDeserialize(raw);
}
