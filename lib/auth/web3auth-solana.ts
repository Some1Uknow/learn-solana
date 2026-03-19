import type { IProvider } from "@web3auth/modal";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";
import bs58 from "bs58";

const SOLANA_METHODS = {
  GET_ACCOUNTS: "getAccounts",
  REQUEST_ACCOUNTS: "solana_requestAccounts",
  SIGN_MESSAGE: "signMessage",
  SIGN_TRANSACTION: "signTransaction",
  SIGN_AND_SEND_TRANSACTION: "signAndSendTransaction",
  SIGN_ALL_TRANSACTIONS: "signAllTransactions",
};

type SignatureLike =
  | string
  | Uint8Array
  | number[]
  | { signature?: SignatureLike; result?: SignatureLike; txid?: SignatureLike }
  | null
  | undefined;

function serializeSignature(value: SignatureLike): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof Uint8Array) return bs58.encode(value);
  if (Array.isArray(value)) return bs58.encode(Uint8Array.from(value));
  if (typeof value === "object") {
    return (
      serializeSignature(value.signature) ??
      serializeSignature(value.result) ??
      serializeSignature(value.txid)
    );
  }
  return null;
}

function serializeTransaction(
  transaction: Transaction | VersionedTransaction
): string {
  if (transaction instanceof VersionedTransaction) {
    return Buffer.from(transaction.serialize()).toString("base64");
  }

  return Buffer.from(
    transaction.serialize({ requireAllSignatures: false })
  ).toString("base64");
}

function normalizeAccounts(result: unknown): string[] {
  if (Array.isArray(result)) {
    return result.filter((account): account is string => typeof account === "string");
  }
  if (typeof result === "string" && result.length > 0) {
    return [result];
  }
  return [];
}

export async function getSolanaAccounts(provider: IProvider): Promise<string[]> {
  const wallet = new SolanaWallet(provider as any);

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const requested = normalizeAccounts(await wallet.requestAccounts());
      if (requested.length > 0) return requested;
    } catch {
      // Fall through to getAccounts on the same attempt.
    }

    try {
      const existing = normalizeAccounts(await wallet.request({
        method: SOLANA_METHODS.GET_ACCOUNTS,
      }));
      if (existing.length > 0) return existing;
    } catch {
      // Retry after a short delay.
    }

    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }

  return [];
}

export async function getPrimarySolanaAccount(
  provider: IProvider
): Promise<string | null> {
  const accounts = await getSolanaAccounts(provider);
  return accounts[0] ?? null;
}

export async function signSolanaMessage(
  provider: IProvider,
  message: string,
  _walletAddress?: string | null
): Promise<string | null> {
  const wallet = new SolanaWallet(provider as any);
  const result = await wallet.signMessage(new TextEncoder().encode(message));

  return serializeSignature(result as SignatureLike);
}

export function createWeb3AuthSolanaWallet(provider: IProvider) {
  return {
    async requestAccounts() {
      return getSolanaAccounts(provider);
    },
    async getAccounts() {
      return getSolanaAccounts(provider);
    },
    async signMessage(message: Uint8Array | string, from?: string | null) {
      const text =
        typeof message === "string" ? message : new TextDecoder().decode(message);
      const signature = await signSolanaMessage(provider, text, from);
      if (!signature) {
        throw new Error("Wallet did not return a Solana message signature.");
      }
      return signature;
    },
    async signTransaction(transaction: Transaction | VersionedTransaction) {
      return provider.request({
        method: SOLANA_METHODS.SIGN_TRANSACTION,
        params: {
          message: serializeTransaction(transaction),
        },
      });
    },
    async signAndSendTransaction(transaction: Transaction | VersionedTransaction) {
      return provider.request({
        method: SOLANA_METHODS.SIGN_AND_SEND_TRANSACTION,
        params: {
          message: serializeTransaction(transaction),
        },
      });
    },
    async signAllTransactions(
      transactions: Array<Transaction | VersionedTransaction>
    ) {
      return provider.request({
        method: SOLANA_METHODS.SIGN_ALL_TRANSACTIONS,
        params: {
          message: transactions.map(serializeTransaction),
        },
      });
    },
    async request(args: Parameters<IProvider["request"]>[0]) {
      return provider.request(args);
    },
  };
}
