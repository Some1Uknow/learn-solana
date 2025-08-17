import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

const solanaRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
if (!solanaRpcUrl) {
  throw new Error(
    "NEXT_PUBLIC_SOLANA_RPC_URL is not defined. Please add it to your .env.local file."
  );
}

// Solana connection using the RPC URL from environment variables
export const connection = new Connection(solanaRpcUrl, "confirmed");

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

// Create a SOL transfer transaction (without signing)
export async function createTransferTransaction(
  fromAddress: string,
  toAddress: string,
  amountSOL: number
): Promise<Transaction> {
  try {
    const fromPubkey = new PublicKey(fromAddress);
    const toPubkey = new PublicKey(toAddress);
    const amountLamports = Math.floor(amountSOL * 1e9); // Convert SOL to lamports

    const instruction: TransactionInstruction = SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: amountLamports,
    });

    const transaction = new Transaction().add(instruction);

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
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
