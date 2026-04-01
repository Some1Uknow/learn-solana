export type RuntimeCheckStatus = "pass" | "warn" | "fail";

export interface RuntimeLabOption {
  id: string;
  label: string;
  rationale: string;
}

export interface RuntimeLabCheck {
  label: string;
  status: RuntimeCheckStatus;
  detail: string;
}

export interface RuntimeLabLog {
  label: string;
  detail: string;
  tone: RuntimeCheckStatus;
}

export interface RuntimeLabFieldChange {
  label: string;
  before: string;
  after: string;
}

export interface RuntimeLabAccountState {
  id: string;
  name: string;
  role: string;
  address: string;
  owner: string;
  summary: string;
  chips: string[];
  changes: RuntimeLabFieldChange[];
}

export interface RuntimeLabFailureMode {
  id: string;
  title: string;
  error: string;
  why: string;
  fix: string;
}

export interface RuntimeLabStep {
  id: string;
  eyebrow: string;
  title: string;
  concept: string;
  objective: string;
  coachNote: string;
  prompt: string;
  options: RuntimeLabOption[];
  correctOptionId: string;
  checks: RuntimeLabCheck[];
  logs: RuntimeLabLog[];
  accounts: RuntimeLabAccountState[];
  failures: RuntimeLabFailureMode[];
}

export interface RuntimeLabFlow {
  id: string;
  title: string;
  tagline: string;
  difficulty: string;
  duration: string;
  memoryHook: string;
  outcomes: string[];
  steps: RuntimeLabStep[];
}

export interface RuntimeLabProgram {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  focus: string;
  flows: RuntimeLabFlow[];
}

export const vaultBootcampFlow: RuntimeLabFlow = {
  id: "vault-bootcamp",
  title: "Vault Bootcamp",
  tagline: "Initialize a PDA vault, mutate state, mint a reward, then break it on purpose.",
  difficulty: "Beginner",
  duration: "12 min",
  memoryHook: "Prediction first. Runtime second. State diff always.",
  outcomes: [
    "Understand what Solana validates before your instruction logic runs.",
    "See how PDAs, writable accounts, and token accounts fit together.",
    "Build the instinct to debug wrong signer, owner, and seed errors.",
  ],
  steps: [
      {
        id: "initialize-vault",
        eyebrow: "Stage 01",
        title: "Initialize the vault PDA",
        concept: "Account creation + rent + signer expectations",
        objective: "Create a program-owned state account that will store vault data.",
        coachNote:
          "A new Solana dev usually thinks 'my instruction ran.' The runtime actually asks: who signed, who pays, who owns this account, and is it rent-safe?",
        prompt:
          "Which account must be both mutable and funded to create the vault PDA successfully?",
        options: [
          {
            id: "payer-wallet",
            label: "The payer wallet, because it signs and funds the new account allocation.",
            rationale:
              "Correct. The payer must sign and spend lamports so the PDA can be created rent-exempt.",
          },
          {
            id: "system-program",
            label: "The System Program, because it creates every new account.",
            rationale:
              "The System Program performs the instruction, but it does not provide lamports or mutability.",
          },
          {
            id: "vault-pda",
            label: "Only the vault PDA, because that is the account being initialized.",
            rationale:
              "The PDA is definitely mutable, but someone still has to fund it. That role belongs to the payer.",
          },
        ],
        correctOptionId: "payer-wallet",
        checks: [
          {
            label: "Signer check",
            status: "pass",
            detail: "Payer signed the transaction, so the runtime allows lamports to be debited.",
          },
          {
            label: "PDA derivation",
            status: "pass",
            detail:
              "Seeds `[b\"vault\", user.key()]` plus bump derive a program-owned address with no private key.",
          },
          {
            label: "Rent exemption",
            status: "pass",
            detail: "Enough lamports are moved into the new PDA to keep the account alive on-chain.",
          },
        ],
        logs: [
          {
            label: "Program log",
            detail: "Creating vault PDA with 8-byte discriminator + 40 bytes of state.",
            tone: "pass",
          },
          {
            label: "System Program",
            detail: "Transferred lamports from payer to vault PDA and allocated data space.",
            tone: "pass",
          },
          {
            label: "Anchor",
            detail: "Account marked initialized and owned by your program.",
            tone: "pass",
          },
        ],
        accounts: [
          {
            id: "payer",
            name: "Payer Wallet",
            role: "Funds the instruction",
            address: "7Yx...payer",
            owner: "System Program",
            summary: "The human wallet covering rent and fees.",
            chips: ["Signer", "Writable", "Fee payer"],
            changes: [
              { label: "Lamports", before: "3.002 SOL", after: "2.999 SOL" },
              { label: "Data", before: "0 bytes", after: "0 bytes" },
            ],
          },
          {
            id: "vault-pda",
            name: "Vault PDA",
            role: "Program state account",
            address: "9aP...vault",
            owner: "Vault Program",
            summary: "Fresh PDA that will store vault metadata and counters.",
            chips: ["PDA", "Initialized", "Program-owned"],
            changes: [
              { label: "Lamports", before: "0 SOL", after: "0.0021 SOL" },
              { label: "Owner", before: "Unassigned", after: "Vault Program" },
              { label: "Counter", before: "N/A", after: "0" },
            ],
          },
        ],
        failures: [
          {
            id: "init-wrong-signer",
            title: "Wrong signer",
            error: "Signature verification failed",
            why:
              "The payer account was present but did not sign, so the runtime refused to debit lamports.",
            fix: "Mark the payer as a signer in the client transaction and Anchor accounts struct.",
          },
          {
            id: "init-low-lamports",
            title: "Not enough rent",
            error: "insufficient funds for rent exemption",
            why:
              "The PDA creation asked for more space than the payer could fund rent-exempt.",
            fix: "Lower account size for the demo or airdrop more devnet SOL before retrying.",
          },
        ],
      },
      {
        id: "derive-pda",
        eyebrow: "Stage 02",
        title: "Derive the PDA again on read",
        concept: "Seeds, bump, and deterministic addressing",
        objective: "Prove you can find the same vault account without storing a private key.",
        coachNote:
          "Beginners often memorize 'PDAs are deterministic' without internalizing what is deterministic: the exact seed bytes, their order, the bump, and the program id.",
        prompt:
          "Why does Anchor care about the bump when validating an existing PDA account?",
        options: [
          {
            id: "avoid-private-key",
            label: "Because the bump proves the PDA sits off the ed25519 curve and matches the derived address.",
            rationale:
              "Correct. The bump is part of the deterministic search for a valid PDA address.",
          },
          {
            id: "extra-security",
            label: "Because every Solana account needs a bump for extra security, even wallet accounts.",
            rationale:
              "Only PDAs use bumps. Normal keypairs do not carry this concept.",
          },
          {
            id: "save-compute",
            label: "Because the runtime charges less compute when the bump is present.",
            rationale:
              "The bump helps derive the right PDA, but it is not a fee discount mechanic.",
          },
        ],
        correctOptionId: "avoid-private-key",
        checks: [
          {
            label: "Seed order",
            status: "pass",
            detail: "The program derives `[b\"vault\", user.key()]` in the same order as initialization.",
          },
          {
            label: "Program id match",
            status: "pass",
            detail: "Changing the program id would produce a different PDA, even with identical seeds.",
          },
          {
            label: "Bump validation",
            status: "pass",
            detail: "Anchor recomputes the bump and confirms the passed-in account is the expected PDA.",
          },
        ],
        logs: [
          {
            label: "Program log",
            detail: "Re-deriving vault PDA from canonical seeds before mutation.",
            tone: "pass",
          },
          {
            label: "Anchor",
            detail: "ConstraintSeeds passed for account `vault_state`.",
            tone: "pass",
          },
          {
            label: "Coach",
            detail: "If a client swaps seed order, you get a different address and the whole instruction stops here.",
            tone: "warn",
          },
        ],
        accounts: [
          {
            id: "user",
            name: "User Wallet",
            role: "Seed input",
            address: "4wT...user",
            owner: "System Program",
            summary: "The wallet pubkey becomes part of the PDA seed recipe.",
            chips: ["Readable", "Seed source"],
            changes: [
              { label: "Pubkey", before: "4wT...user", after: "4wT...user" },
              { label: "Lamports", before: "1.244 SOL", after: "1.244 SOL" },
            ],
          },
          {
            id: "vault-pda-derive",
            name: "Vault PDA",
            role: "Derived target",
            address: "9aP...vault",
            owner: "Vault Program",
            summary: "No private key exists. The program finds it from seeds and bump.",
            chips: ["PDA", "Deterministic"],
            changes: [
              { label: "Seeds", before: "[vault, user]", after: "[vault, user]" },
              { label: "Bump", before: "254", after: "254" },
            ],
          },
        ],
        failures: [
          {
            id: "pda-wrong-order",
            title: "Wrong seed order",
            error: "ConstraintSeeds",
            why:
              "The client derived `[user, vault]` while the program expected `[vault, user]`, so the addresses did not match.",
            fix: "Centralize PDA helpers and never duplicate seed logic ad hoc in the frontend.",
          },
          {
            id: "pda-wrong-program",
            title: "Wrong program id",
            error: "ConstraintSeeds",
            why:
              "The PDA was derived against an old or different program id after a redeploy.",
            fix: "Regenerate client constants after redeploys and verify the deployed program id everywhere.",
          },
        ],
      },
      {
        id: "write-state",
        eyebrow: "Stage 03",
        title: "Write state into the vault",
        concept: "Mutability, ownership, discriminator, and serialized data",
        objective: "Increment a counter and record that the vault has been initialized.",
        coachNote:
          "This is where a lot of beginners collapse everything into 'the account exists.' Solana is stricter: it cares whether the right program owns the account and whether the transaction is allowed to write to it.",
        prompt:
          "Which pair of requirements is most important before your program updates vault state?",
        options: [
          {
            id: "owner-and-mut",
            label: "The vault must be owned by your program and passed as writable.",
            rationale:
              "Correct. Ownership decides authority over the data, and mutability allows the bytes to change.",
          },
          {
            id: "signer-and-rent",
            label: "The vault must sign and remain rent-exempt.",
            rationale:
              "A PDA cannot sign like a wallet unless invoked with seeds, and rent alone does not grant write permission.",
          },
          {
            id: "mint-and-decimals",
            label: "The token mint decimals must match the vault counter format.",
            rationale:
              "Token decimals matter later for token flows, not for writing plain program state.",
          },
        ],
        correctOptionId: "owner-and-mut",
        checks: [
          {
            label: "Writable flag",
            status: "pass",
            detail: "The transaction marks `vault_state` mutable, so the runtime allows data bytes to change.",
          },
          {
            label: "Program ownership",
            status: "pass",
            detail: "The vault account owner matches your program id, so your program may mutate it.",
          },
          {
            label: "Discriminator decode",
            status: "pass",
            detail: "Anchor decodes the expected account type before applying the update.",
          },
        ],
        logs: [
          {
            label: "Program log",
            detail: "Loaded vault state with counter = 0 and initialized = true.",
            tone: "pass",
          },
          {
            label: "Program log",
            detail: "Incremented counter to 1 and stored `last_actor = user`.",
            tone: "pass",
          },
          {
            label: "Anchor",
            detail: "Serialized updated account bytes back into `vault_state`.",
            tone: "pass",
          },
        ],
        accounts: [
          {
            id: "vault-state-write",
            name: "Vault PDA",
            role: "Mutated account",
            address: "9aP...vault",
            owner: "Vault Program",
            summary: "Program-owned state is now changing for the first time.",
            chips: ["Writable", "Program-owned", "Decoded"],
            changes: [
              { label: "Counter", before: "0", after: "1" },
              { label: "Initialized", before: "true", after: "true" },
              { label: "Last actor", before: "None", after: "4wT...user" },
            ],
          },
          {
            id: "user-write",
            name: "User Wallet",
            role: "Authority context",
            address: "4wT...user",
            owner: "System Program",
            summary: "No state bytes changed here, but this signer authorized the update.",
            chips: ["Signer"],
            changes: [
              { label: "Lamports", before: "1.244 SOL", after: "1.24399 SOL" },
            ],
          },
        ],
        failures: [
          {
            id: "write-owner",
            title: "Wrong owner",
            error: "AccountOwnedByWrongProgram",
            why:
              "The passed account looked like state, but it was not actually owned by your program.",
            fix: "Verify account ownership before mutation and use strongly typed Anchor accounts wherever possible.",
          },
          {
            id: "write-mut",
            title: "Missing mut",
            error: "instruction changed the balance of a read-only account",
            why:
              "The transaction included the account as read-only, so any attempted write was rejected.",
            fix: "Mark the account `mut` in both the client instruction and the Anchor accounts struct.",
          },
        ],
      },
      {
        id: "mint-reward",
        eyebrow: "Stage 04",
        title: "Mint a reward to the user ATA",
        concept: "SPL mint, token account ownership, CPI authority",
        objective: "Reward the learner with demo tokens after the vault update succeeds.",
        coachNote:
          "Newcomers mix up the mint and the token account constantly. The mint defines the token. The token account holds somebody's balance.",
        prompt:
          "Where does the user's token balance actually increase when the reward is minted?",
        options: [
          {
            id: "token-account",
            label: "Inside the user's associated token account.",
            rationale:
              "Correct. The mint supply changes globally, but the owned balance sits in the token account.",
          },
          {
            id: "mint-account",
            label: "Inside the mint account, because the mint stores every user's tokens.",
            rationale:
              "The mint stores global metadata and total supply, not per-user balances.",
          },
          {
            id: "vault-pda",
            label: "Inside the vault PDA, because it initiated the reward instruction.",
            rationale:
              "Your program state can record metadata about the reward, but SPL balances live in token accounts.",
          },
        ],
        correctOptionId: "token-account",
        checks: [
          {
            label: "Mint authority",
            status: "pass",
            detail: "The CPI uses the authority expected by the mint, so the token program accepts the instruction.",
          },
          {
            label: "ATA ownership",
            status: "pass",
            detail: "The recipient token account belongs to the user and references the correct mint.",
          },
          {
            label: "Supply update",
            status: "pass",
            detail: "Mint supply and token account amount both move in lockstep after the CPI succeeds.",
          },
        ],
        logs: [
          {
            label: "Program log",
            detail: "Calling the Token Program to mint 10 demo tokens as a completion reward.",
            tone: "pass",
          },
          {
            label: "Token Program",
            detail: "Minted 10 units to the user's associated token account.",
            tone: "pass",
          },
          {
            label: "Coach",
            detail: "Notice how the mint supply changes globally while the ATA tracks the user's personal balance.",
            tone: "warn",
          },
        ],
        accounts: [
          {
            id: "reward-mint",
            name: "Reward Mint",
            role: "Token definition",
            address: "Mint...demo",
            owner: "Token Program",
            summary: "Defines the reward token and its total supply.",
            chips: ["Mint", "Decimals: 0"],
            changes: [
              { label: "Supply", before: "0", after: "10" },
              { label: "Mint authority", before: "Vault PDA", after: "Vault PDA" },
            ],
          },
          {
            id: "reward-ata",
            name: "User ATA",
            role: "Balance holder",
            address: "Ata...user",
            owner: "Token Program",
            summary: "The account that actually holds the user's reward balance.",
            chips: ["Token account", "Writable"],
            changes: [
              { label: "Amount", before: "0", after: "10" },
              { label: "Owner", before: "4wT...user", after: "4wT...user" },
            ],
          },
        ],
        failures: [
          {
            id: "mint-wrong-ata",
            title: "Wrong token account",
            error: "TokenInvalidAccountOwnerError",
            why:
              "The destination account did not belong to the expected owner or mint pairing.",
            fix: "Derive the ATA from the wallet + mint pair instead of hardcoding token account addresses.",
          },
          {
            id: "mint-auth",
            title: "Wrong mint authority",
            error: "owner does not match",
            why:
              "The CPI tried to mint with an authority that the mint did not recognize.",
            fix: "Align the mint authority setup with the signer seeds used during the CPI.",
          },
        ],
      },
      {
        id: "break-it-safely",
        eyebrow: "Stage 05",
        title: "Break the flow and read the failure",
        concept: "Atomicity and debug instincts",
        objective: "See how the transaction rolls back when one validation fails.",
        coachNote:
          "This is the habit you want to build: when something fails, do not panic. Ask what the runtime checked last, which account that check referred to, and whether any state could have committed before the failure.",
        prompt:
          "The transaction fails with `ConstraintSeeds` before the reward CPI. What happens to the earlier state update in the same transaction?",
        options: [
          {
            id: "rollback",
            label: "Everything rolls back. No vault write or reward mint is committed.",
            rationale:
              "Correct. Solana transactions are atomic: one failed instruction means all prior writes in that transaction disappear.",
          },
          {
            id: "state-persists",
            label: "The vault write stays, but the reward mint is skipped.",
            rationale:
              "That would be partial commit behavior. Solana transactions do not work that way.",
          },
          {
            id: "logs-reset-only",
            label: "Only the logs are discarded. The state changes still land.",
            rationale:
              "Logs can still be emitted for debugging, but failed transactions do not commit state changes.",
          },
        ],
        correctOptionId: "rollback",
        checks: [
          {
            label: "Seed validation",
            status: "fail",
            detail: "The PDA passed from the client does not match the PDA the program derived.",
          },
          {
            label: "Instruction short-circuit",
            status: "warn",
            detail: "Execution stops before the token CPI, so the mint path never runs.",
          },
          {
            label: "Atomic rollback",
            status: "pass",
            detail: "All earlier writes in the same transaction are discarded, keeping on-chain state unchanged.",
          },
        ],
        logs: [
          {
            label: "Anchor",
            detail: "ConstraintSeeds: expected `9aP...vault`, got `85x...wrong`.",
            tone: "fail",
          },
          {
            label: "Runtime",
            detail: "Instruction aborted before any token CPI could execute.",
            tone: "warn",
          },
          {
            label: "Coach",
            detail: "If you inspect the accounts after failure, the vault counter and token balance remain unchanged.",
            tone: "pass",
          },
        ],
        accounts: [
          {
            id: "rollback-vault",
            name: "Vault PDA",
            role: "Rolled-back state",
            address: "9aP...vault",
            owner: "Vault Program",
            summary: "This account looks exactly like it did before the failed transaction began.",
            chips: ["Rollback verified"],
            changes: [
              { label: "Counter", before: "1", after: "1" },
              { label: "Last actor", before: "4wT...user", after: "4wT...user" },
            ],
          },
          {
            id: "rollback-ata",
            name: "User ATA",
            role: "Unchanged token balance",
            address: "Ata...user",
            owner: "Token Program",
            summary: "No extra reward arrives because the CPI never completed.",
            chips: ["Unchanged"],
            changes: [
              { label: "Amount", before: "10", after: "10" },
            ],
          },
        ],
        failures: [
          {
            id: "fail-seeds",
            title: "Seeds mismatch",
            error: "ConstraintSeeds",
            why:
              "The frontend or test derived the PDA incorrectly, so the program rejected the passed account.",
            fix: "Share PDA derivation helpers between program tests, frontend code, and docs examples.",
          },
          {
            id: "fail-owner",
            title: "Owner mismatch",
            error: "AccountOwnedByWrongProgram",
            why:
              "A different account with similar data was passed in, but ownership proved it was not valid state.",
            fix: "Read the owner field before anything else when debugging mysterious state account failures.",
          },
          {
            id: "fail-signer",
            title: "Missing signer",
            error: "Signature verification failed",
            why:
              "The transaction reached an auth check without the expected signer bit set on the required account.",
            fix: "Compare the Anchor accounts struct to the client-side `accounts` and `signers` lists one by one.",
          },
        ],
      },
    ],
};

const tokenProgramFlow: RuntimeLabFlow = {
  id: "token-reward-run",
  title: "Token Reward Run",
  tagline: "Create an ATA, mint a reward, and understand where balances actually live.",
  difficulty: "Beginner",
  duration: "10 min",
  memoryHook: "Mint defines. Token account holds. Authority approves.",
  outcomes: [
    "Separate mint metadata from per-user balances.",
    "See why ATAs are deterministic and safer than hardcoded token accounts.",
    "Debug common token authority and destination-account mistakes.",
  ],
  steps: [
    {
      id: "derive-ata",
      eyebrow: "Stage 01",
      title: "Derive the associated token account",
      concept: "ATA derivation and owner + mint pairing",
      objective: "Find the destination account that should hold the user's reward balance.",
      coachNote:
        "A lot of beginners think 'token account' is just any account with tokens in it. The real relationship is wallet + mint -> deterministic ATA.",
      prompt: "Why is deriving the ATA safer than hardcoding a token account address?",
      options: [
        {
          id: "wallet-mint-pair",
          label: "Because the ATA is derived from the wallet and mint pair, so the destination is predictable and correct.",
          rationale:
            "Correct. You remove guesswork and reduce the chance of minting to the wrong destination account.",
        },
        {
          id: "cheaper",
          label: "Because ATA derivation uses less compute than any other token account operation.",
          rationale:
            "Compute is not the main reason. The real benefit is correctness and deterministic addressing.",
        },
        {
          id: "private-key",
          label: "Because ATAs have their own private keys managed by the token program.",
          rationale:
            "ATAs do not introduce a new private key model for the user here. They are deterministic token accounts.",
        },
      ],
      correctOptionId: "wallet-mint-pair",
      checks: [
        {
          label: "Owner + mint derivation",
          status: "pass",
          detail: "The ATA address is derived from the wallet pubkey and the reward mint pubkey.",
        },
        {
          label: "Destination account type",
          status: "pass",
          detail: "The selected destination account is an SPL token account, not a system wallet account.",
        },
      ],
      logs: [
        {
          label: "Client",
          detail: "Derived ATA for wallet `4wT...user` and mint `Mint...reward`.",
          tone: "pass",
        },
        {
          label: "Coach",
          detail: "If you hardcode an address here, you often end up debugging the wrong problem later.",
          tone: "warn",
        },
      ],
      accounts: [
        {
          id: "token-user",
          name: "User Wallet",
          role: "ATA owner",
          address: "4wT...user",
          owner: "System Program",
          summary: "The wallet identity that owns the eventual token balance.",
          chips: ["Wallet", "Owner"],
          changes: [
            { label: "Pubkey", before: "4wT...user", after: "4wT...user" },
          ],
        },
        {
          id: "token-ata",
          name: "Reward ATA",
          role: "Destination token account",
          address: "Ata...reward",
          owner: "Token Program",
          summary: "The token account that will hold the user's reward balance.",
          chips: ["ATA", "Token account"],
          changes: [
            { label: "Amount", before: "0", after: "0" },
          ],
        },
      ],
      failures: [
        {
          id: "wrong-destination",
          title: "Wrong destination",
          error: "InvalidAccountData",
          why:
            "The destination was not the expected token account for this wallet + mint pair.",
          fix: "Always derive the ATA from the owner and mint instead of copying addresses by hand.",
        },
      ],
    },
    {
      id: "mint-reward-token",
      eyebrow: "Stage 02",
      title: "Mint into the ATA",
      concept: "Mint authority and token balance updates",
      objective: "Update the mint supply and the user's ATA balance in one token instruction path.",
      coachNote:
        "The mint does not store 'Alice has 10'. The mint stores supply and authorities. The ATA stores Alice's actual balance.",
      prompt: "Where does the user's personal token balance change after minting succeeds?",
      options: [
        {
          id: "ata-balance",
          label: "Inside the user's ATA.",
          rationale:
            "Correct. The ATA holds the user's balance, while the mint tracks global token metadata and supply.",
        },
        {
          id: "mint-only",
          label: "Only inside the mint account.",
          rationale:
            "The mint supply changes too, but per-user balances do not live there.",
        },
        {
          id: "wallet-native",
          label: "Inside the user's system wallet because the wallet owns the ATA.",
          rationale:
            "Ownership is not the same thing as storage location. SPL balances live in token accounts.",
        },
      ],
      correctOptionId: "ata-balance",
      checks: [
        {
          label: "Mint authority",
          status: "pass",
          detail: "The signer or PDA authority used for minting matches the mint's configured authority.",
        },
        {
          label: "Supply increment",
          status: "pass",
          detail: "Mint supply and ATA amount both move after the mint instruction succeeds.",
        },
      ],
      logs: [
        {
          label: "Token Program",
          detail: "Minted 25 reward units into the user's ATA.",
          tone: "pass",
        },
        {
          label: "Coach",
          detail: "This is the split to memorize: supply on the mint, owned balance on the ATA.",
          tone: "warn",
        },
      ],
      accounts: [
        {
          id: "reward-mint-supply",
          name: "Reward Mint",
          role: "Token definition",
          address: "Mint...reward",
          owner: "Token Program",
          summary: "Defines the token and tracks total supply.",
          chips: ["Mint"],
          changes: [
            { label: "Supply", before: "0", after: "25" },
          ],
        },
        {
          id: "reward-ata-balance",
          name: "User ATA",
          role: "Balance holder",
          address: "Ata...reward",
          owner: "Token Program",
          summary: "Stores the user's personal reward balance.",
          chips: ["Writable", "ATA"],
          changes: [
            { label: "Amount", before: "0", after: "25" },
          ],
        },
      ],
      failures: [
        {
          id: "wrong-authority",
          title: "Wrong mint authority",
          error: "owner does not match",
          why:
            "The mint instruction was attempted with an authority the mint does not trust.",
          fix: "Check the mint authority stored on the mint account and line it up with the signer or PDA seeds used in the CPI.",
        },
      ],
    },
    {
      id: "transfer-reward",
      eyebrow: "Stage 03",
      title: "Transfer from one ATA to another",
      concept: "Token account ownership and signer authority",
      objective: "Move tokens between token accounts while learning who must authorize the transfer.",
      coachNote:
        "The key mental model is simple: token accounts store balances, but the owner of that token account authorizes spending.",
      prompt: "Who normally signs a token transfer from the user's ATA?",
      options: [
        {
          id: "ata-owner",
          label: "The owner of the source token account.",
          rationale:
            "Correct. The token program expects authority from the owner or an approved delegate.",
        },
        {
          id: "mint-authority",
          label: "The mint authority, because the mint created the tokens.",
          rationale:
            "Mint authority controls minting, not normal transfers between token accounts.",
        },
        {
          id: "token-program",
          label: "The token program itself, because it owns both token accounts.",
          rationale:
            "Program ownership is not the same thing as transfer authority.",
        },
      ],
      correctOptionId: "ata-owner",
      checks: [
        {
          label: "Source authority",
          status: "pass",
          detail: "The owner of the source ATA signed, so the token program accepts the transfer.",
        },
        {
          label: "Mint consistency",
          status: "pass",
          detail: "Source and destination token accounts both reference the same mint.",
        },
      ],
      logs: [
        {
          label: "Token Program",
          detail: "Transferred 10 reward units from the source ATA to the destination ATA.",
          tone: "pass",
        },
      ],
      accounts: [
        {
          id: "source-ata",
          name: "Source ATA",
          role: "Sending balance",
          address: "Ata...source",
          owner: "Token Program",
          summary: "The user's token account before spending.",
          chips: ["Source", "ATA"],
          changes: [
            { label: "Amount", before: "25", after: "15" },
          ],
        },
        {
          id: "destination-ata",
          name: "Destination ATA",
          role: "Receiving balance",
          address: "Ata...dest",
          owner: "Token Program",
          summary: "The destination token account receiving the transfer.",
          chips: ["Destination", "ATA"],
          changes: [
            { label: "Amount", before: "0", after: "10" },
          ],
        },
      ],
      failures: [
        {
          id: "missing-transfer-authority",
          title: "Missing transfer authority",
          error: "owner does not match",
          why:
            "The transfer was attempted without the owner or delegate authority for the source ATA.",
          fix: "Trace the source ATA owner field first, then compare it to the signer list in the transaction.",
        },
      ],
    },
  ],
};

const pdaStateFlow: RuntimeLabFlow = {
  id: "counter-lifecycle",
  title: "Counter Lifecycle",
  tagline: "Initialize state, re-derive the PDA, mutate the counter, then fail on ownership assumptions.",
  difficulty: "Beginner",
  duration: "11 min",
  memoryHook: "Seeds find state. Ownership protects state. Mutability changes state.",
  outcomes: [
    "Build confidence around PDA-derived program state.",
    "See how ownership and mutability combine during writes.",
    "Recognize the most common state-account failure modes quickly.",
  ],
  steps: [
    {
      id: "counter-init",
      eyebrow: "Stage 01",
      title: "Initialize the counter account",
      concept: "PDA init and rent-funded state",
      objective: "Create a PDA that will store a simple program counter.",
      coachNote:
        "This is the smallest useful state pattern in Solana: derive a PDA, allocate space, and let the program own the bytes.",
      prompt: "What gives your program the right to write custom bytes into a PDA state account later?",
      options: [
        {
          id: "program-ownership",
          label: "The account is owned by your program.",
          rationale:
            "Correct. Program ownership is the authority model for mutating custom account data.",
        },
        {
          id: "payer-signature",
          label: "The payer signed during initialization.",
          rationale:
            "The payer can fund creation, but that alone does not grant future write authority over program state.",
        },
        {
          id: "rent-exemption",
          label: "The account is rent-exempt.",
          rationale:
            "Rent keeps the account alive, but ownership is what controls writes.",
        },
      ],
      correctOptionId: "program-ownership",
      checks: [
        {
          label: "PDA creation",
          status: "pass",
          detail: "The counter PDA is derived and created with enough space for the discriminator and state.",
        },
        {
          label: "Owner assignment",
          status: "pass",
          detail: "The new account is owned by the counter program, not the payer wallet.",
        },
      ],
      logs: [
        {
          label: "Program log",
          detail: "Initialized counter PDA with `count = 0`.",
          tone: "pass",
        },
      ],
      accounts: [
        {
          id: "counter-pda",
          name: "Counter PDA",
          role: "State account",
          address: "Cnt...pda",
          owner: "Counter Program",
          summary: "Stores a simple counter and bump for future writes.",
          chips: ["PDA", "Program-owned"],
          changes: [
            { label: "Count", before: "N/A", after: "0" },
          ],
        },
      ],
      failures: [
        {
          id: "counter-rent",
          title: "Rent failure",
          error: "insufficient funds for rent exemption",
          why:
            "The new state account could not be funded rent-exempt during initialization.",
          fix: "Reduce allocated size for the demo or fund the payer before initialization.",
        },
      ],
    },
    {
      id: "counter-increment",
      eyebrow: "Stage 02",
      title: "Increment the counter",
      concept: "State mutation and writable account rules",
      objective: "Update the counter from 0 to 1 without violating write constraints.",
      coachNote:
        "A state update is not mysterious. The runtime only cares whether the right program owns the account and whether the transaction marked it writable.",
      prompt: "What must be true before the program can change `count` from 0 to 1?",
      options: [
        {
          id: "owner-and-mut-counter",
          label: "The counter account is owned by the program and passed as writable.",
          rationale:
            "Correct. That is the core pair to check before any state mutation.",
        },
        {
          id: "payer-receives-sol",
          label: "The payer receives lamports back after initialization.",
          rationale:
            "Lamport refunds are unrelated to the state write permission model here.",
        },
        {
          id: "system-program-owner",
          label: "The counter account stays owned by the System Program.",
          rationale:
            "If that were true, your program would not own the custom state bytes.",
        },
      ],
      correctOptionId: "owner-and-mut-counter",
      checks: [
        {
          label: "Writable state",
          status: "pass",
          detail: "The transaction marks the counter account mutable.",
        },
        {
          label: "Discriminator decode",
          status: "pass",
          detail: "Anchor decodes the expected counter account before mutation.",
        },
      ],
      logs: [
        {
          label: "Program log",
          detail: "Loaded `count = 0` and wrote back `count = 1`.",
          tone: "pass",
        },
      ],
      accounts: [
        {
          id: "counter-after-write",
          name: "Counter PDA",
          role: "Mutated state",
          address: "Cnt...pda",
          owner: "Counter Program",
          summary: "The count field changes after a valid state write.",
          chips: ["Writable", "Decoded"],
          changes: [
            { label: "Count", before: "0", after: "1" },
          ],
        },
      ],
      failures: [
        {
          id: "counter-readonly",
          title: "Readonly state account",
          error: "instruction changed the balance of a read-only account",
          why:
            "The transaction tried to mutate state without passing the account as writable.",
          fix: "Check both the client instruction accounts and the Anchor `mut` annotation.",
        },
      ],
    },
    {
      id: "counter-rollback",
      eyebrow: "Stage 03",
      title: "Break the state flow",
      concept: "Ownership mismatch and atomic rollback",
      objective: "See how a bad state account aborts the instruction and protects committed state.",
      coachNote:
        "This is the debugger's habit: if the account owner is wrong, stop there. Everything after that is noise.",
      prompt: "If the wrong state account is passed and ownership fails, what happens to the attempted increment?",
      options: [
        {
          id: "rollback-counter",
          label: "It rolls back; the counter stays unchanged.",
          rationale:
            "Correct. Failed instruction paths do not partially commit the state write.",
        },
        {
          id: "partial-commit-counter",
          label: "The counter still increments before the error is returned.",
          rationale:
            "That is not how Solana transaction atomicity works.",
        },
        {
          id: "logs-only-counter",
          label: "Only the logs disappear, but the bytes stay mutated.",
          rationale:
            "Failed transactions can still produce logs, but they do not commit the write.",
        },
      ],
      correctOptionId: "rollback-counter",
      checks: [
        {
          label: "Ownership validation",
          status: "fail",
          detail: "The passed state account is not owned by the counter program.",
        },
        {
          label: "Atomic rollback",
          status: "pass",
          detail: "The attempted write is discarded because the instruction failed.",
        },
      ],
      logs: [
        {
          label: "Anchor",
          detail: "AccountOwnedByWrongProgram on `counter_state`.",
          tone: "fail",
        },
      ],
      accounts: [
        {
          id: "counter-rolled-back",
          name: "Counter PDA",
          role: "Protected state",
          address: "Cnt...pda",
          owner: "Counter Program",
          summary: "The account remains unchanged because the write never committed.",
          chips: ["Rollback"],
          changes: [
            { label: "Count", before: "1", after: "1" },
          ],
        },
      ],
      failures: [
        {
          id: "wrong-counter-owner",
          title: "Wrong owner",
          error: "AccountOwnedByWrongProgram",
          why:
            "A lookalike account was passed where real program state was expected.",
          fix: "Check the owner field before inspecting the rest of the data layout.",
        },
      ],
    },
  ],
};

const cpiDebugFlow: RuntimeLabFlow = {
  id: "reward-relay",
  title: "Reward Relay",
  tagline: "Trigger a CPI, pass signer seeds, and debug why the downstream program rejects bad authority.",
  difficulty: "Intermediate",
  duration: "13 min",
  memoryHook: "Your program calls. The callee validates again.",
  outcomes: [
    "Understand that CPIs restart validation in the callee program.",
    "Learn why signer seeds matter when a PDA acts as authority in a CPI.",
    "Trace failures across program boundaries instead of blaming the outer instruction blindly.",
  ],
  steps: [
    {
      id: "prepare-cpi",
      eyebrow: "Stage 01",
      title: "Prepare the CPI context",
      concept: "Account forwarding and authority intent",
      objective: "Package the accounts and authority needed for a downstream token-program mint CPI.",
      coachNote:
        "A CPI is not a shortcut around validation. It is another program invocation, which means another full round of account checks.",
      prompt: "What is the outer program really doing when it builds a CPI context?",
      options: [
        {
          id: "forward-accounts",
          label: "Forwarding the accounts and authority context the downstream program will validate again.",
          rationale:
            "Correct. The callee still performs its own checks, even though your program initiated the call.",
        },
        {
          id: "bypass-checks",
          label: "Bypassing downstream validation because the outer program is already trusted.",
          rationale:
            "That is exactly the wrong mental model. The callee validates independently.",
        },
        {
          id: "serialize-once",
          label: "Serializing data once so no other program needs to look at accounts anymore.",
          rationale:
            "Serialization does not remove the callee's validation responsibilities.",
        },
      ],
      correctOptionId: "forward-accounts",
      checks: [
        {
          label: "CPI account forwarding",
          status: "pass",
          detail: "The outer program passes the mint, destination ATA, and authority accounts into the downstream instruction.",
        },
        {
          label: "Authority intent",
          status: "warn",
          detail: "The outer program claims a PDA will act as authority, which means signer seeds must line up next.",
        },
      ],
      logs: [
        {
          label: "Outer program",
          detail: "Constructed CPI context for reward mint instruction.",
          tone: "pass",
        },
      ],
      accounts: [
        {
          id: "cpi-authority",
          name: "Reward PDA",
          role: "Authority candidate",
          address: "Rel...pda",
          owner: "Reward Relay Program",
          summary: "This PDA is supposed to authorize the CPI on behalf of the outer program.",
          chips: ["PDA", "Authority"],
          changes: [
            { label: "Signer seeds", before: "pending", after: "pending" },
          ],
        },
      ],
      failures: [
        {
          id: "missing-cpi-account",
          title: "Missing CPI account",
          error: "NotEnoughAccountKeys",
          why:
            "The outer program failed to pass one of the accounts the callee needed to validate.",
          fix: "Read the callee instruction signature and compare it line-by-line with the CPI context builder.",
        },
      ],
    },
    {
      id: "signer-seeds",
      eyebrow: "Stage 02",
      title: "Attach signer seeds for the PDA",
      concept: "PDA authority in CPIs",
      objective: "Let the outer program's PDA act like a signer inside the CPI.",
      coachNote:
        "A PDA does not magically sign. It only 'signs' inside a CPI when the seeds and bump supplied by the invoking program re-derive that PDA exactly.",
      prompt: "Why do signer seeds matter in a CPI when a PDA is the authority?",
      options: [
        {
          id: "pda-authority-cpi",
          label: "Because the runtime must re-derive the PDA and confirm the invoking program is allowed to act for it.",
          rationale:
            "Correct. That is how the runtime authorizes PDA signing during a CPI.",
        },
        {
          id: "save-seeds",
          label: "Because signer seeds reduce the number of accounts the callee has to inspect.",
          rationale:
            "Signer seeds are about authority proof, not account-count optimization.",
        },
        {
          id: "wallet-signing-cpi",
          label: "Because the user's wallet signs through the PDA automatically.",
          rationale:
            "Wallet signatures and PDA signer seeds are different mechanisms.",
        },
      ],
      correctOptionId: "pda-authority-cpi",
      checks: [
        {
          label: "Seed replay",
          status: "pass",
          detail: "The runtime re-derives the PDA from the provided seeds and bump.",
        },
        {
          label: "Authority match",
          status: "pass",
          detail: "The derived PDA matches the authority expected by the mint instruction.",
        },
      ],
      logs: [
        {
          label: "Runtime",
          detail: "Signer seeds validated for PDA `Rel...pda`.",
          tone: "pass",
        },
      ],
      accounts: [
        {
          id: "relay-pda",
          name: "Relay PDA",
          role: "CPI signer",
          address: "Rel...pda",
          owner: "Reward Relay Program",
          summary: "Acts as the mint authority only when signer seeds are correct.",
          chips: ["Signer seeds", "PDA"],
          changes: [
            { label: "Authority state", before: "unsigned", after: "signed via seeds" },
          ],
        },
      ],
      failures: [
        {
          id: "wrong-signer-seeds",
          title: "Wrong signer seeds",
          error: "Cross-program invocation with unauthorized signer",
          why:
            "The PDA authority did not re-derive from the supplied seeds, so the runtime refused to treat it as signed.",
          fix: "Log the exact seeds and bump used by both init and CPI paths; mismatches usually hide there.",
        },
      ],
    },
    {
      id: "callee-fails",
      eyebrow: "Stage 03",
      title: "Debug the downstream failure",
      concept: "Callee-side validation and error attribution",
      objective: "Learn to read whether the CPI failed because of outer-program setup or callee-program validation.",
      coachNote:
        "The subtle bug in CPI debugging is blaming the wrong program. Read the logs carefully: which program emitted the failure, and what account was it validating?",
      prompt: "If the token program rejects the mint authority during the CPI, where should your debugging start?",
      options: [
        {
          id: "authority-path",
          label: "At the authority path: expected mint authority, signer seeds, and CPI account forwarding.",
          rationale:
            "Correct. That trio is the highest-signal place to begin for this class of CPI failure.",
        },
        {
          id: "frontend-css",
          label: "At the frontend state because CPI failures usually begin with UI race conditions.",
          rationale:
            "Frontend issues can exist, but this specific error is about on-chain authority and CPI setup.",
        },
        {
          id: "rent-first",
          label: "At rent exemption because every CPI failure is ultimately a rent problem.",
          rationale:
            "Rent matters sometimes, but this error points at downstream authority validation.",
        },
      ],
      correctOptionId: "authority-path",
      checks: [
        {
          label: "Outer program setup",
          status: "warn",
          detail: "The CPI context may look correct from the outer program's perspective, but the callee still decides validity.",
        },
        {
          label: "Callee authority validation",
          status: "fail",
          detail: "The downstream token program rejects the supplied authority.",
        },
      ],
      logs: [
        {
          label: "Outer program",
          detail: "Invoking token program mint CPI.",
          tone: "warn",
        },
        {
          label: "Token Program",
          detail: "Owner does not match expected mint authority.",
          tone: "fail",
        },
      ],
      accounts: [
        {
          id: "callee-mint",
          name: "Reward Mint",
          role: "Callee-validated account",
          address: "Mint...relay",
          owner: "Token Program",
          summary: "The callee checks this mint's configured authority against the one forwarded in the CPI.",
          chips: ["Mint", "Callee-owned"],
          changes: [
            { label: "Supply", before: "40", after: "40" },
          ],
        },
      ],
      failures: [
        {
          id: "callee-authority",
          title: "Callee rejected authority",
          error: "owner does not match",
          why:
            "The downstream token program saw an authority mismatch between the mint and the account the outer program forwarded.",
          fix: "Read the failure from the callee's point of view, then verify the mint authority field, CPI authority account, and signer seeds together.",
        },
      ],
    },
  ],
};

export const runtimeLabPrograms: RuntimeLabProgram[] = [
  {
    id: "vault-bootcamp",
    name: "Vault Bootcamp",
    description:
      "Start here to learn the full shape of a Solana program flow: init, derive, mutate, mint, and rollback.",
    difficulty: "Beginner",
    focus: "Program flow foundations",
    flows: [vaultBootcampFlow],
  },
  {
    id: "token-program-basics",
    name: "Token Program Basics",
    description:
      "Learn ATAs, mint supply, token balances, and transfer authority without mixing up mint accounts and token accounts.",
    difficulty: "Beginner",
    focus: "SPL token mental models",
    flows: [tokenProgramFlow],
  },
  {
    id: "pda-state-patterns",
    name: "PDA + State Patterns",
    description:
      "Understand state-account lifecycles with PDAs, ownership, mutability, and rollback behavior.",
    difficulty: "Beginner",
    focus: "Program-owned state",
    flows: [pdaStateFlow],
  },
  {
    id: "cpi-debug-lab",
    name: "CPI Debug Lab",
    description:
      "Trace cross-program invocations, signer seeds, and downstream failures without guessing.",
    difficulty: "Intermediate",
    focus: "Cross-program invocation",
    flows: [cpiDebugFlow],
  },
];

export const runtimeLabFlows = runtimeLabPrograms.flatMap((program) => program.flows);

export function getRuntimeLabProgram(programId: string) {
  return runtimeLabPrograms.find((program) => program.id === programId);
}

export function getRuntimeLabFlow(flowId: string) {
  return runtimeLabFlows.find((flow) => flow.id === flowId);
}
