import { Connection, PublicKey, Transaction, SystemProgram, Keypair, TransactionInstruction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createInitializeMintInstruction, MINT_SIZE, TOKEN_PROGRAM_ID, getMinimumBalanceForRentExemptMint, createMintToInstruction } from '@solana/spl-token';

// Metaplex Token Metadata program id (constant)
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// Lazy imports cache (to avoid repeated dynamic imports)
let metadataSerializersLoaded: any | null = null;

async function loadMetadataSerializers() {
  if (metadataSerializersLoaded) return metadataSerializersLoaded;
  const mod = await import('@metaplex-foundation/mpl-token-metadata/dist/src/generated/instructions/createMetadataAccountV3.js');
  const modME = await import('@metaplex-foundation/mpl-token-metadata/dist/src/generated/instructions/createMasterEditionV3.js');
  const types = await import('@metaplex-foundation/mpl-token-metadata/dist/src/generated/types/index.js');
  const serializers = await import('@metaplex-foundation/umi/serializers');
  metadataSerializersLoaded = { ...mod, ...modME, types, serializers };
  return metadataSerializersLoaded;
}

function deriveMetadataPda(mint: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([
    Buffer.from('metadata'),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    mint.toBuffer(),
  ], TOKEN_METADATA_PROGRAM_ID);
  return pda;
}

function deriveMasterEditionPda(mint: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([
    Buffer.from('metadata'),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    mint.toBuffer(),
    Buffer.from('edition'),
  ], TOKEN_METADATA_PROGRAM_ID);
  return pda;
}

/**
 * Client-side mint helper (user pays):
 *  - Creates a new mint (decimals=0)
 *  - Creates user's ATA
 *  - Mints exactly 1 token to user
 *  - Attempts to create Metadata + Master Edition (v3) pointing to hosted JSON file.
 * If metadata/edition creation fails, proceeds with bare token (graceful fallback).
 */

// Dynamically import heavy MPL code only when needed
export async function clientMintGameNft(params: { connection: Connection; walletPublicKey: string; sendAndConfirm: (tx: Transaction) => Promise<string>; gameId: string; }): Promise<{ mintAddress: string; signature: string; metadataOk: boolean; }> {
  const { connection, walletPublicKey, sendAndConfirm, gameId } = params;
  const payer = new PublicKey(walletPublicKey);

  // 1. Create new mint account
  const mintKeypair = Keypair.generate();
  const mintPubkey = mintKeypair.publicKey;

  const lamportsForMint = await getMinimumBalanceForRentExemptMint(connection);

  // 2. Derive ATA for payer
  const ata = await getAssociatedTokenAddress(mintPubkey, payer);

  // 3. Build base mint instructions
  const blockhashInfo = await connection.getLatestBlockhash();
  const tx = new Transaction({ feePayer: payer, recentBlockhash: blockhashInfo.blockhash });

  // Create mint account
  tx.add(SystemProgram.createAccount({
    fromPubkey: payer,
    newAccountPubkey: mintPubkey,
    lamports: lamportsForMint,
    space: MINT_SIZE,
    programId: TOKEN_PROGRAM_ID,
  }));

  // Initialize mint (decimals 0, mint & freeze authority = payer)
  tx.add(createInitializeMintInstruction(mintPubkey, 0, payer, payer));

  // Create ATA for payer
  tx.add(createAssociatedTokenAccountInstruction(payer, ata, payer, mintPubkey));

  // Mint 1 token to ATA
  tx.add(createMintToInstruction(mintPubkey, ata, payer, 1));

  // Attempt to append metadata + master edition instructions BEFORE signing so all happen atomically
  // 4. Append Metadata + Master Edition instructions
  let metadataOk = false;
  try {
    const { getCreateMetadataAccountV3InstructionDataSerializer, getCreateMasterEditionV3InstructionDataSerializer, serializers, types } = await loadMetadataSerializers();
    const { struct, u8, bool, option, u64 } = serializers;
    // We'll use provided serializers directly (already mapped in helper functions)

    const metadataPda = deriveMetadataPda(mintPubkey);
    const masterEditionPda = deriveMasterEditionPda(mintPubkey);

    // DataV2 structure fields with defaults
    const name = `Learn.sol ${gameId} Completion`.slice(0, 32);
    const symbol = 'LEARN';
  // Updated to Pinata-hosted IPFS gateway JSON metadata per user decision
  const uri = 'https://copper-gigantic-kite-657.mypinata.cloud/ipfs/bafkreicmeavqcbhkusk5viagwdjiiuyruthemxk2f5o3uohevf4oco26pa';

    const metaSerializer = getCreateMetadataAccountV3InstructionDataSerializer();
    const metaData = metaSerializer.serialize({
      data: {
        name,
        symbol,
        uri,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      },
      isMutable: true,
      collectionDetails: null,
    });

    const metaIx = new TransactionInstruction({
      programId: TOKEN_METADATA_PROGRAM_ID,
      keys: [
        { pubkey: metadataPda, isSigner: false, isWritable: true },
        { pubkey: mintPubkey, isSigner: false, isWritable: false },
        { pubkey: payer, isSigner: true, isWritable: false }, // mintAuthority
        { pubkey: payer, isSigner: true, isWritable: true },  // payer
        { pubkey: payer, isSigner: true, isWritable: false }, // updateAuthority
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        // rent omitted (treated as sysvar) -> not strictly needed on modern runtime
      ],
      data: metaData,
    });
    tx.add(metaIx);

    // Master Edition (maxSupply = Some(0))
    const meSerializer = getCreateMasterEditionV3InstructionDataSerializer();
    // Format expects option(u64); using 0n for one-of-one semantics.
    const meData = meSerializer.serialize({ maxSupply: { __option: 'Some', value: BigInt(0) } });
    const meIx = new TransactionInstruction({
      programId: TOKEN_METADATA_PROGRAM_ID,
      keys: [
        { pubkey: masterEditionPda, isSigner: false, isWritable: true },
        { pubkey: mintPubkey, isSigner: false, isWritable: true },
        { pubkey: payer, isSigner: true, isWritable: false }, // updateAuthority
        { pubkey: payer, isSigner: true, isWritable: false }, // mintAuthority
        { pubkey: payer, isSigner: true, isWritable: true },  // payer
        { pubkey: metadataPda, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        // rent omitted
      ],
      data: meData,
    });
    tx.add(meIx);
    metadataOk = true;
  } catch (e) {
    console.warn('[clientMintGameNft] metadata build failed – proceeding without metadata', e);
  }

  // 5. Sign & send
  tx.partialSign(mintKeypair);
  const signature = await sendAndConfirm(tx);
  return { mintAddress: mintPubkey.toBase58(), signature, metadataOk };
}
