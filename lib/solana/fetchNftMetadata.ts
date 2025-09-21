import { Connection, PublicKey } from '@solana/web3.js';

// Metaplex Token Metadata Program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

interface RawMetadataResult {
  mint: string;
  uri?: string;
  name?: string;
  symbol?: string;
  updateAuthority?: string;
}

interface FullMetadata extends RawMetadataResult {
  json?: any;
  image?: string;
  error?: string;
}

function deriveMetadataPda(mint: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([
    Buffer.from('metadata'),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    mint.toBuffer(),
  ], TOKEN_METADATA_PROGRAM_ID);
  return pda;
}

// A very lightweight (and partial) decoder for Metaplex Metadata account.
// We only extract name, symbol, and URI. The layout: key(1) updateAuth(32) mint(32) name(string) symbol(string) uri(string) ...
// Each string = 4-byte little-endian length + utf8 bytes, padded with nulls to fixed size in full spec.
export async function fetchOnChainMetadataFields(connection: Connection, mintAddress: string): Promise<RawMetadataResult> {
  const mintPk = new PublicKey(mintAddress);
  const pda = deriveMetadataPda(mintPk);
  const acct = await connection.getAccountInfo(pda);
  if (!acct) return { mint: mintAddress };
  const data = acct.data;
  // Offsets: skip key(1) + updateAuth(32) + mint(32)
  let offset = 1;
  // Capture update authority
  let updateAuthority: string | undefined = undefined;
  try {
    const ua = new PublicKey(data.subarray(offset, offset + 32));
    updateAuthority = ua.toBase58();
  } catch {}
  offset += 32 + 32; // skip updateAuth(32) + mint(32)
  function readString(): string | undefined {
    if (offset + 4 > data.length) return undefined;
    const len = data.readUInt32LE(offset); offset += 4;
    if (len > 1000 || offset + len > data.length) return undefined;
    const slice = data.subarray(offset, offset + len);
    offset += len;
    return Buffer.from(slice).toString('utf8').replace(/\u0000+$/g,'').trim();
  }
  const name = readString();
  const symbol = readString();
  const uri = readString();
  return { mint: mintAddress, name, symbol, uri, updateAuthority };
}

// Simple on-chain only URI verifier for UI/debug
export async function getOnChainMetadataUri(connection: Connection, mintAddress: string): Promise<string | undefined> {
  const r = await fetchOnChainMetadataFields(connection, mintAddress);
  return r.uri;
}

export async function fetchFullNftMetadata(connection: Connection, mintAddress: string, opts?: { forceRefresh?: boolean }): Promise<FullMetadata> {
  try {
    const base = await fetchOnChainMetadataFields(connection, mintAddress);
    if (!base.uri) return base;
    let uri = base.uri.trim();
    if (!uri.startsWith('http')) return { ...base, error: 'Non-HTTP URI' };
    // Optional cache buster to avoid stale caches immediately after updates
    if (opts?.forceRefresh) {
      const u = new URL(uri);
      u.searchParams.set('_', Date.now().toString());
      uri = u.toString();
    }
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 8000);
    try {
      const host = (() => { try { return new URL(uri).hostname; } catch { return ''; } })();
      const preferProxy = host === 'learnsol.site' || host.endsWith('.learnsol.site');
      const res = preferProxy ? null as any : await fetch(uri, { signal: controller.signal, cache: opts?.forceRefresh ? 'no-store' : 'default' }).catch(()=>null as any);
        let okRes = res;
        if (!okRes || !okRes.ok) {
          // Try proxy fallback
          try {
            const proxied = `/api/metadata-proxy?u=${encodeURIComponent(uri)}${opts?.forceRefresh ? `&_=${Date.now()}` : ''}`;
            okRes = await fetch(proxied, { signal: controller.signal, cache: opts?.forceRefresh ? 'no-store' : 'default' });
          } catch {}
        }
        clearTimeout(timeout);
        if (!okRes || !okRes.ok) return { ...base, error: 'Metadata HTTP '+(okRes?.status || 'ERR') };
        const json = await okRes.json().catch(()=>({ error: 'Invalid JSON'}));
      let image = typeof json?.image === 'string' ? json.image : undefined;
      if (image && opts?.forceRefresh) {
        try {
          const iu = new URL(image);
          iu.searchParams.set('_', Date.now().toString());
          image = iu.toString();
        } catch {}
      }
      return { ...base, json, image };
    } catch (e: any) {
      return { ...base, error: e.message || 'Fetch failed' };
    }
  } catch (e: any) {
    return { mint: mintAddress, error: e.message || 'Unknown error' };
  }
}

export async function fetchManyNftMetadata(connection: Connection, mints: string[], opts?: { forceRefresh?: boolean }): Promise<FullMetadata[]> {
  const out: FullMetadata[] = [];
  for (const m of mints) {
    try { out.push(await fetchFullNftMetadata(connection, m, opts)); } catch { out.push({ mint: m, error: 'Failed'}); }
  }
  return out;
}
