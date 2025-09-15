import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, keypairIdentity, percentAmount, createSignerFromKeypair, publicKey } from '@metaplex-foundation/umi';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';

/**
 * Simple devnet NFT mint for a completed game.
 * Inputs:
 *  - gameId: string identifier of game
 *  - destination: player wallet (base58)
 *  - signerSecret: base58 or JSON array secret key of the mint authority (stored in METAPLEX_SECRET_KEY)
 * Returns: { mintAddress }
 */
export async function mintGameNft(opts: { gameId: string; destination: string; signerSecret: string; name?: string; symbol?: string; description?: string; imageUri?: string; }): Promise<{ mintAddress: string }> {
  const { gameId, destination, signerSecret } = opts;
  const name = opts.name || `Learn.sol ${gameId} Completion`; // 32 char limit enforced internally
  const symbol = opts.symbol || 'LEARN';
  const description = opts.description || 'Game completion reward on learn.sol devnet';
  const imageUri = opts.imageUri || 'https://learnsol.site/game-nfts/solana-clicker.png';

  // Build Umi for devnet
  const umi = createUmi('https://api.devnet.solana.com');

  // Decode signer secret
  let secret: Uint8Array;
  if (signerSecret.trim().startsWith('[')) {
    secret = new Uint8Array(JSON.parse(signerSecret));
  } else {
    secret = bs58.decode(signerSecret.trim());
  }
  const keypair = umi.eddsa.createKeypairFromSecretKey(secret);
  const signer = createSignerFromKeypair(umi, keypair);
  umi.use(keypairIdentity(signer));

  const mint = generateSigner(umi);

  await createNft(umi, {
    mint,
    name: name.slice(0, 32),
    symbol: symbol.slice(0, 10),
    uri: imageUri,
    sellerFeeBasisPoints: percentAmount(0),
    creators: [ { address: signer.publicKey, verified: true, share: 100 } ],
    // Directly set the token owner so minted token goes to player
    tokenOwner: publicKey(destination),
  }).sendAndConfirm(umi);

  // Transfer authority: Not needed for simple static NFT (we keep mint authority to avoid complexity)

  // Associate token with destination (implicit via createNft which mints to authority). If you need to send:
  // TODO: Optionally send to destination if required; createNft currently mints to mint authority's associated token account.
  // For simplicity here we mint directly and rely on reading mint metadata. Could extend later to send to player.

  return { mintAddress: mint.publicKey.toString() };
}
