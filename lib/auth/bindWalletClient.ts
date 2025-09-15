import bs58 from 'bs58';
import { authFetch } from './authFetch';

export async function requestWalletNonce(walletAddress: string): Promise<string> {
  const res = await authFetch('/api/auth/nonce', { method: 'POST', body: JSON.stringify({ walletAddress }) });
  if (!res.ok) throw new Error('Failed to get nonce');
  const data = await res.json();
  return data.nonce;
}

export async function bindWalletWithSignature(walletAddress: string): Promise<boolean> {
  // Requires window.web3authSolanaWallet with signMessage implementation
  const wallet: any = (window as any).web3authSolanaWallet;
  if (!wallet || typeof wallet.signMessage !== 'function') {
    throw new Error('Wallet signMessage unavailable');
  }
  const nonce = await requestWalletNonce(walletAddress);
  const messageBytes = new TextEncoder().encode(nonce);
  const sig = await wallet.signMessage(messageBytes);
  const signature = bs58.encode(sig);
  const res = await authFetch('/api/auth/bind-wallet', { method: 'POST', body: JSON.stringify({ walletAddress, signature }) });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error('Bind failed: ' + txt);
  }
  return true;
}
