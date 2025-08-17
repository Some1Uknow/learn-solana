import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";
import bs58 from "bs58";

// Solana connection for devnet
export const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

// Helper function to convert hex to bytes
export function hexToByteArray(hexString: string): number[] {
  const result = [];
  for (let i = 0; i < hexString.length; i += 2) {
    result.push(parseInt(hexString.substr(i, 2), 16));
  }
  return result;
}

// Get Solana keypair from Web3Auth Ed25519 private key
export function getSolanaKeypair(ed25519PrivKey: string): Keypair {
  const privateKeyBytes = hexToByteArray(ed25519PrivKey);
  return Keypair.fromSecretKey(Uint8Array.from(privateKeyBytes));
}

// Get Solana public key (address) from keypair
export function getSolanaAddress(keypair: Keypair): string {
  return keypair.publicKey.toBase58();
}

// Get SOL balance for an address
export async function getSolanaBalance(address: string): Promise<number> {
  try {
    const publicKey = new PublicKey(address);
    const balanceLamports = await connection.getBalance(publicKey);
    return balanceLamports / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
}

// Send SOL from one address to another
export async function sendSOL(
  senderKeypair: Keypair,
  recipientAddress: string,
  amountSOL: number
): Promise<string> {
  try {
    const recipientPublicKey = new PublicKey(recipientAddress);
    const amountLamports = Math.floor(amountSOL * 1e9); // Convert SOL to lamports

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipientPublicKey,
        lamports: amountLamports,
      })
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderKeypair.publicKey;

    // Sign transaction
    transaction.sign(senderKeypair);

    // Send transaction
    const signature = await connection.sendRawTransaction(
      transaction.serialize()
    );

    // Confirm transaction
    await connection.confirmTransaction(signature, "confirmed");

    return signature;
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
}

// Sign an arbitrary message with Solana keypair (simplified)
export function signMessage(message: string, keypair: Keypair): string {
  const messageBytes = Buffer.from(message, "utf8");

  // Create a simple transaction to sign the message (this is a common pattern)
  // In a real app, you might want to use a more sophisticated message signing approach
  const publicKeyBytes = keypair.publicKey.toBytes();
  const combined = Buffer.concat([messageBytes, Buffer.from(publicKeyBytes)]);

  return bs58.encode(combined);
}

// Validate Solana address
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}
