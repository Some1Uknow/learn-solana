'use client';

import bs58 from 'bs58';

export interface BrowserWalletOption {
  id: string;
  name: string;
  icon?: string;
  kind: 'standard' | 'legacy';
}

export interface BrowserWalletSession {
  walletId: string;
  walletName: string;
  walletAddress: string;
  provider: any;
}

const NATIVE_WALLET_STORAGE_KEY = 'learnsol_native_wallet';

interface BrowserWalletConnector extends BrowserWalletOption {
  connect: () => Promise<{ walletAddress: string; provider: any }>;
  signMessage: (message: Uint8Array) => Promise<string>;
  disconnect?: () => Promise<void>;
}

function getGlobalScope(): any {
  return typeof window !== 'undefined' ? window : undefined;
}

function normalizeSignature(result: any): string {
  const bytes = result?.signature ?? result;
  if (bytes instanceof Uint8Array) {
    return bs58.encode(bytes);
  }
  if (bytes?.data && Array.isArray(bytes.data)) {
    return bs58.encode(Uint8Array.from(bytes.data));
  }
  throw new Error('Wallet did not return a valid signature');
}

function detectStandardWallets(): BrowserWalletConnector[] {
  const globalScope = getGlobalScope();
  const registry = globalScope?.navigator?.wallets;
  const wallets = Array.isArray(registry)
    ? registry
    : typeof registry?.get === 'function'
      ? registry.get()
      : [];
  if (!wallets || !Array.isArray(wallets)) return [];

  return wallets
    .filter((wallet: any) => {
      const features = wallet?.features || {};
      return Boolean(features['standard:connect'] && features['solana:signMessage']);
    })
    .map((wallet: any) => ({
      id: `standard:${wallet.name}`,
      name: wallet.name,
      icon: wallet.icon,
      kind: 'standard' as const,
      connect: async () => {
        const connectOutput = await wallet.features['standard:connect'].connect();
        const account = connectOutput?.accounts?.[0] ?? wallet.accounts?.[0];
        const walletAddress = account?.address;
        if (!walletAddress) {
          throw new Error(`Could not read account from ${wallet.name}`);
        }
        return { walletAddress, provider: wallet };
      },
      signMessage: async (message: Uint8Array) => {
        const account = wallet.accounts?.[0];
        if (!account) {
          throw new Error(`${wallet.name} is not connected`);
        }
        const outputs = await wallet.features['solana:signMessage'].signMessage({
          account,
          message,
        });
        return normalizeSignature(outputs?.[0]);
      },
      disconnect: wallet.features['standard:disconnect']
        ? async () => {
            await wallet.features['standard:disconnect'].disconnect();
          }
        : undefined,
    }));
}

function detectLegacyWallets(): BrowserWalletConnector[] {
  const globalScope = getGlobalScope();
  if (!globalScope) return [];

  const providers: Array<{ id: string; name: string; provider: any }> = [];
  const braveProvider = globalScope.braveSolana;
  const phantomProvider = globalScope.phantom?.solana;
  const solflareProvider = globalScope.solflare;
  const backpackProvider = globalScope.backpack?.solana || globalScope.xnft?.solana;

  if (braveProvider?.isBraveWallet) {
    providers.push({ id: 'legacy:brave', name: 'Brave Wallet', provider: braveProvider });
  }
  if (phantomProvider?.isPhantom && !phantomProvider?.isBraveWallet) {
    providers.push({ id: 'legacy:phantom', name: 'Phantom', provider: phantomProvider });
  }
  if (solflareProvider?.isSolflare) {
    providers.push({ id: 'legacy:solflare', name: 'Solflare', provider: solflareProvider });
  }
  if (backpackProvider?.isBackpack || backpackProvider) {
    providers.push({ id: 'legacy:backpack', name: 'Backpack', provider: backpackProvider });
  }

  return providers.map(({ id, name, provider }) => ({
    id,
    name,
    kind: 'legacy' as const,
    connect: async () => {
      const result = await provider.connect();
      const walletAddress =
        provider.publicKey?.toString?.() || result?.publicKey?.toString?.() || result?.address;
      if (!walletAddress) {
        throw new Error(`Could not read account from ${name}`);
      }
      return { walletAddress, provider };
    },
    signMessage: async (message: Uint8Array) => {
      let result;
      try {
        result = await provider.signMessage(message, 'utf8');
      } catch {
        result = await provider.signMessage(message);
      }
      return normalizeSignature(result);
    },
    disconnect:
      typeof provider.disconnect === 'function'
        ? async () => {
            await provider.disconnect();
          }
        : undefined,
  }));
}

function dedupeWallets(wallets: BrowserWalletConnector[]) {
  const seen = new Set<string>();
  return wallets.filter((wallet) => {
    const key = wallet.id.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function listBrowserWallets(): BrowserWalletOption[] {
  return dedupeWallets([...detectStandardWallets(), ...detectLegacyWallets()]).map(
    ({ id, name, icon, kind }) => ({ id, name, icon, kind })
  );
}

function getWalletConnector(walletId: string): BrowserWalletConnector | null {
  return (
    dedupeWallets([...detectStandardWallets(), ...detectLegacyWallets()]).find(
      (wallet) => wallet.id === walletId
    ) || null
  );
}

export async function connectBrowserWallet(walletId: string) {
  const connector = getWalletConnector(walletId);
  if (!connector) {
    throw new Error('Selected wallet is no longer available in this browser');
  }

  const { walletAddress, provider } = await connector.connect();

  return {
    walletId: connector.id,
    walletName: connector.name,
    walletAddress,
    provider,
  };
}

export async function signBrowserWalletMessage(walletId: string, message: string) {
  const connector = getWalletConnector(walletId);
  if (!connector) {
    throw new Error("Selected wallet is no longer available in this browser");
  }

  return await connector.signMessage(new TextEncoder().encode(message));
}

export function persistNativeWalletSession(session: BrowserWalletSession | null) {
  const globalScope = getGlobalScope();
  if (!globalScope) return;
  (globalScope as any).__LEARNSOL_NATIVE_WALLET = session;
  (globalScope as any).solanaWallet = session?.provider ?? null;
  try {
    if (session) {
      globalScope.localStorage?.setItem(
        NATIVE_WALLET_STORAGE_KEY,
        JSON.stringify({
          walletId: session.walletId,
          walletName: session.walletName,
          walletAddress: session.walletAddress,
        })
      );
    } else {
      globalScope.localStorage?.removeItem(NATIVE_WALLET_STORAGE_KEY);
    }
  } catch {}
}

export function getNativeWalletSession(): BrowserWalletSession | null {
  const globalScope = getGlobalScope();
  return ((globalScope as any)?.__LEARNSOL_NATIVE_WALLET as BrowserWalletSession | null) || null;
}

export function getStoredNativeWalletSelection(): Omit<
  BrowserWalletSession,
  "provider"
> | null {
  const globalScope = getGlobalScope();
  if (!globalScope) return null;
  try {
    const raw = globalScope.localStorage?.getItem(NATIVE_WALLET_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.walletId === "string" &&
      typeof parsed?.walletName === "string" &&
      typeof parsed?.walletAddress === "string"
    ) {
      return parsed;
    }
  } catch {}
  return null;
}

export async function restoreNativeWalletProvider(
  walletId: string | null | undefined,
  walletAddress: string | null | undefined
): Promise<BrowserWalletSession | null> {
  if (!walletId || !walletAddress) return null;
  const connector = getWalletConnector(walletId);
  if (!connector) return null;

  try {
    const connected = await connector.connect();
    if (connected.walletAddress !== walletAddress) {
      return null;
    }
    const restored = {
      walletId: connector.id,
      walletName: connector.name,
      walletAddress,
      provider: connected.provider,
    };
    persistNativeWalletSession(restored);
    return restored;
  } catch {
    return null;
  }
}
