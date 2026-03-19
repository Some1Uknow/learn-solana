import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export const SIGN_MESSAGE_PREFIX = 'learn.sol:register:';
export const WALLET_AUTH_MESSAGE_PREFIX = 'learn.sol:wallet-login:';

export function isValidSolanaAddress(address: string): boolean {
  try { new PublicKey(address); return true; } catch { return false; }
}

export function verifyWalletSignature(walletAddress: string, signatureB58: string) {
  try {
    const message = new TextEncoder().encode(SIGN_MESSAGE_PREFIX + walletAddress);
    const sig = bs58.decode(signatureB58);
    const pubKey = new PublicKey(walletAddress);
    return nacl.sign.detached.verify(message, sig, pubKey.toBytes());
  } catch {
    return false;
  }
}

export function buildWalletAuthMessage(walletAddress: string, nonce: string) {
  return `${WALLET_AUTH_MESSAGE_PREFIX}${walletAddress}:${nonce}`;
}

export function verifyArbitraryWalletSignature(
  walletAddress: string,
  signatureB58: string,
  message: string
) {
  try {
    const encoded = new TextEncoder().encode(message);
    const sig = bs58.decode(signatureB58);
    const pubKey = new PublicKey(walletAddress);
    return nacl.sign.detached.verify(encoded, sig, pubKey.toBytes());
  } catch {
    return false;
  }
}
