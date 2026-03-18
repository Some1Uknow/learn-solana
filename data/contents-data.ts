// This file exports the contents-data originally from contents-data.json
// Use this for direct import in your modules/pages/components

export const contentsData = {
  modules: [
    {
      id: "solana-foundations",
      title: "Solana Foundations",
      description:
        "Understand how Solana works, use the CLI confidently, and build your first clear mental model of accounts and transactions.",
      goal: "Build real comfort with the Solana runtime, the CLI, and the transaction model before moving into Rust or Anchor.",
      image: "/solanaLogo.png",
      icon: "fundamentals",
      overviewUrl: "/learn/solana-foundations",
      topics: [
        {
          id: "devnet-setup",
          title: "Solana Development Environment Setup",
          description:
            "Install the Solana CLI, configure devnet, manage keypairs, and verify your local workflow end to end.",
          type: "setup",
          url: "/learn/solana-foundations/devnet-setup",
        },
        {
          id: "accounts-lamports-exercise",
          title: "Accounts and Lamports Exploration",
          description:
            "Create wallets, inspect balances, move SOL on devnet, and understand the account model step by step.",
          type: "exercise",
          url: "/learn/solana-foundations/accounts-lamports-exercise",
        },
        {
          id: "transaction-anatomy",
          title: "Understanding Solana Transactions",
          description:
            "Learn what a transaction really is, who signs it, how instructions fit together, and how confirmation works.",
          type: "theory",
          url: "/learn/solana-foundations/transaction-anatomy",
        },
        {
          id: "solana-architecture",
          title: "Understanding Solana Architecture",
          description:
            "Learn how leaders, validators, PoH, Sealevel, and propagation work together when a transaction moves through the network.",
          type: "theory",
          url: "/learn/solana-foundations/solana-architecture",
        },
        {
          id: "program-interaction-project",
          title: "Program Interaction Toolkit",
          description:
            "Build a small toolkit with @solana/kit to inspect accounts, read balances, and send a real transaction.",
          type: "project",
          url: "/learn/solana-foundations/program-interaction-project",
        },
        {
          id: "basic-exploration-challenge",
          title: "Solana Foundations Capstone",
          description:
            "Inspect live devnet state, send a transfer, verify the result in Explorer, and explain exactly what changed.",
          type: "challenge",
          url: "/learn/solana-foundations/basic-exploration-challenge",
        },
      ],
    },
    {
      id: "rust-foundations",
      title: "Rust Foundations",
      description:
        "Learn the Rust syntax and ownership model you need before writing Solana programs.",
      goal: "Build enough Rust fluency to reason clearly about ownership, data modeling, control flow, and common program structure.",
      image: "/rust-2.png",
      icon: "rust",
      overviewUrl: "/learn/rust-foundations",
      topics: [
        {
          id: "rust-setup-and-core-syntax",
          title: "Rust Setup and Core Syntax",
          description: "Install Rust, learn the Cargo workflow, and understand the basic syntax every later lesson depends on.",
          type: "theory",
          url: "/learn/rust-foundations/rust-setup-and-core-syntax",
        },
        {
          id: "rust-syntax-practice",
          title: "Rust Syntax Practice",
          description: "Practice variables, functions, loops, and input handling with small focused exercises.",
          type: "challenge",
          url: "/learn/rust-foundations/rust-syntax-practice",
        },
        {
          id: "ownership-and-borrowing",
          title: "Ownership and Borrowing",
          description: "Understand moves, immutable borrows, mutable borrows, and how Rust prevents invalid memory access.",
          type: "theory",
          url: "/learn/rust-foundations/ownership-and-borrowing",
        },
        {
          id: "ownership-and-borrowing-practice",
          title: "Ownership and Borrowing Practice",
          description: "Practice the rules around references, mutation, and move semantics without falling back to unnecessary cloning.",
          type: "challenge",
          url: "/learn/rust-foundations/ownership-and-borrowing-practice",
        },
        {
          id: "structs-and-methods",
          title: "Structs and Methods",
          description: "Model related data with structs and attach behavior with methods and associated functions.",
          type: "theory",
          url: "/learn/rust-foundations/structs-and-methods",
        },
        {
          id: "structs-and-methods-practice",
          title: "Structs and Methods Practice",
          description: "Practice defining structs, choosing method receivers, and building small stateful models.",
          type: "challenge",
          url: "/learn/rust-foundations/structs-and-methods-practice",
        },
        {
          id: "wallet-ledger-build",
          title: "Wallet Ledger Build",
          description: "Combine syntax, ownership, and structs into one guided CLI build before moving into richer Rust control flow.",
          type: "project",
          url: "/learn/rust-foundations/wallet-ledger-build",
        },
        {
          id: "enums-and-pattern-matching",
          title: "Enums and Pattern Matching in Rust",
          description: "Represent mutually exclusive states safely and use match to write explicit branching logic.",
          type: "theory",
          url: "/learn/rust-foundations/enums-and-pattern-matching",
        },
        {
          id: "enums-and-pattern-matching-practice",
          title: "Enums and Pattern Matching Practice",
          description: "Practice enums and pattern matching through a small wallet manager exercise.",
          type: "challenge",
          url: "/learn/rust-foundations/enums-and-pattern-matching-practice",
        },
        {
          id: "collections-and-string-handling",
          title: "Collections and String Handling in Rust",
          description: "Learn when to use vectors, maps, and strings, and how to work with them without fighting ownership.",
          type: "theory",
          url: "/learn/rust-foundations/collections-and-string-handling",
        },
        {
          id: "collections-and-string-handling-practice",
          title: "Collections and String Handling Practice",
          description: "Use vectors, hash maps, and strings in realistic exercises that prepare you for program account data.",
          type: "challenge",
          url: "/learn/rust-foundations/collections-and-string-handling-practice",
        },
      ],
    },
    {
      id: "anchor-programs",
      title: "Anchor Programs",
      description:
        "Learn Anchor from setup and core concepts through PDAs, CPIs, token flows, and guided projects.",
      goal: "Build production-minded Solana programs with Anchor using clear account models, validation, tests, and project work.",
      image: "/anchor.png",
      icon: "anchor",
      overviewUrl: "/learn/anchor-programs",
      topics: [
        {
          id: "anchor-local-setup",
          title: "Anchor Local Setup",
          description:
            "Install and verify Solana, Rust, and Anchor, create a workspace, and run your first local tests end to end.",
          type: "setup",
          url: "/learn/anchor-programs/anchor-local-setup",
        },
        {
          id: "anchor-program-anatomy",
          title: "Anchor Program Anatomy",
          description:
            "Learn what each file in an Anchor workspace does and how a method call becomes an on-chain state change.",
          type: "theory",
          url: "/learn/anchor-programs/anchor-program-anatomy",
        },
        {
          id: "anchor-core-concepts",
          title: "Anchor Core Concepts",
          description:
            "Understand instructions, accounts, signers, and constraints before writing your first real program.",
          type: "theory",
          url: "/learn/anchor-programs/anchor-core-concepts",
        },
        {
          id: "first-anchor-program",
          title: "First Anchor Program",
          description:
            "Build a small stateful program one instruction at a time and verify each step with tests.",
          type: "exercise",
          url: "/learn/anchor-programs/first-anchor-program",
        },
        {
          id: "pda-seed-derivation",
          title: "PDAs and Seed Derivation",
          description:
            "Use deterministic account addresses safely with clear seed design, bumps, and update rules.",
          type: "theory",
          url: "/learn/anchor-programs/pda-seed-derivation",
        },
        {
          id: "spl-token-integration",
          title: "SPL Token Integration with Anchor",
          description:
            "Work with mints, token accounts, and safer token constraints across Token and Token-2022.",
          type: "theory",
          url: "/learn/anchor-programs/spl-token-integration",
        },
        {
          id: "cpi-cross-program",
          title: "Cross-Program Invocations",
          description:
            "Call other programs safely and reason about CPI contexts, signer seeds, and delegated authority.",
          type: "theory",
          url: "/learn/anchor-programs/cpi-cross-program",
        },
        {
          id: "token-minting-project",
          title: "Token Minting and Supply Control",
          description:
            "Combine PDAs, token CPI, and supply rules in one guided Anchor build.",
          type: "project",
          url: "/learn/anchor-programs/token-minting-project",
        },
        {
          id: "escrow-mechanism-project",
          title: "Escrow with a PDA Vault",
          description:
            "Build a stronger state machine with a vault PDA, release rules, and failure-path testing.",
          type: "project",
          url: "/learn/anchor-programs/escrow-mechanism-project",
        },
        {
          id: "anchor-ergonomics",
          title: "Anchor Development Ergonomics",
          description:
            "Make programs easier to trust with better constraints, errors, events, and testing habits.",
          type: "theory",
          url: "/learn/anchor-programs/anchor-ergonomics",
        },
        {
          id: "defi-integration-challenge",
          title: "DeFi Integration Capstone",
          description:
            "Use the full Anchor toolchain in an optional capstone once the main path feels solid.",
          type: "project",
          url: "/learn/anchor-programs/defi-integration-challenge",
        },
      ],
    },
    {
      id: "solana-kit-clients",
      title: "Solana Kit Clients",
      description:
        "Build a Solana client with @solana/kit: connect a wallet, read accounts, build messages, and send transactions.",
      goal: "Master wallet connection, transaction flows, and client architecture using @solana/kit in modern Solana applications.",
      image: "/solana-kit.svg",
      icon: "fullstack",
      overviewUrl: "/learn/solana-kit-clients",
      topics: [
        {
          id: "kit-foundations",
          title: "Kit Foundations",
          description:
            "Start with a clean kit-first setup and understand why @solana/kit is the default for new client code.",
          type: "setup",
          url: "/learn/solana-kit-clients/kit-foundations",
        },
        {
          id: "wallet-standard-connection-flow",
          title: "Wallet Standard Connection Flow",
          description:
            "Implement wallet-standard-first connection UX and signing lifecycle for modern Solana clients.",
          type: "theory",
          url: "/learn/solana-kit-clients/wallet-standard-connection-flow",
        },
        {
          id: "rpc-reads-and-account-decoding-with-kit",
          title: "RPC Reads and Account Decoding with Kit",
          description:
            "Read accounts, decode on-chain data, and structure reliable query patterns with @solana/kit.",
          type: "exercise",
          url: "/learn/solana-kit-clients/rpc-reads-and-account-decoding-with-kit",
        },
        {
          id: "transaction-message-building-and-signers",
          title: "Transaction Message Building and Signers",
          description:
            "Build transaction messages, manage fee payer and signer responsibilities, and keep instruction assembly explicit.",
          type: "exercise",
          url: "/learn/solana-kit-clients/transaction-message-building-and-signers",
        },
        {
          id: "send-confirm-retry-and-lifetime-management",
          title: "Send, Confirm, Retry and Lifetime Management",
          description:
            "Handle blockhash lifetimes, confirmations, retries, and user-facing transaction states with production-safe defaults.",
          type: "theory",
          url: "/learn/solana-kit-clients/send-confirm-retry-and-lifetime-management",
        },
        {
          id: "spl-token-and-token-2022-client-flows",
          title: "SPL Token and Token-2022 Client Flows",
          description:
            "Implement token transfer flows with explicit token program handling and extension-aware checks.",
          type: "project",
          url: "/learn/solana-kit-clients/spl-token-and-token-2022-client-flows",
        },
        {
          id: "anchor-client-with-kit",
          title: "Anchor Client Patterns with Kit",
          description:
            "Connect Anchor program workflows to a kit-first client architecture without confusing abstractions.",
          type: "theory",
          url: "/learn/solana-kit-clients/anchor-client-with-kit",
        },
        {
          id: "frontend-transaction-ux-status-errors-recovery",
          title: "Frontend Transaction UX: Status, Errors, Recovery",
          description:
            "Design resilient UX for pending, confirmed, failed, and retried transactions with clear user feedback.",
          type: "project",
          url: "/learn/solana-kit-clients/frontend-transaction-ux-status-errors-recovery",
        },
        {
          id: "client-testing-strategy-lite-unit-and-integration",
          title: "Client Testing Strategy: Lite Unit and Integration",
          description:
            "Build a practical testing stack for client transaction flows, adapters, and failure-path behavior.",
          type: "theory",
          url: "/learn/solana-kit-clients/client-testing-strategy-lite-unit-and-integration",
        },
        {
          id: "mini-capstone-kit-client-for-anchor-program",
          title: "Mini Capstone: Kit Client for an Anchor Program",
          description:
            "Ship a small but complete kit-first client that interacts with an Anchor program end to end.",
          type: "challenge",
          url: "/learn/solana-kit-clients/mini-capstone-kit-client-for-anchor-program",
        },
      ],
    },
    {
      id: "ship-and-production",
      title: "Ship and Production",
      description:
        "Turn your Solana application into something stable, testable, deployable, and portfolio-ready.",
      goal: "Create a professional portfolio piece that demonstrates engineering quality across integration, testing, deployment, and presentation.",
      image: "/capstone.png",
      icon: "capstone",
      overviewUrl: "/learn/ship-and-production",
      topics: [
        {
          id: "advanced-features-implementation",
          title: "Advanced Features Implementation",
          description:
            "Handle multi-program interactions, richer state management, and more advanced production patterns.",
          type: "implementation",
          url: "/learn/ship-and-production/advanced-features-implementation",
        },
        {
          id: "fullstack-integration",
          title: "Full-Stack Integration",
          description:
            "Connect program logic, client flows, and product UX into one coherent application.",
          type: "implementation",
          url: "/learn/ship-and-production/fullstack-integration",
        },
        {
          id: "testing-security-audit",
          title: "Testing and Security Audit",
          description:
            "Expand test coverage, inspect failure paths, and apply a stricter security review mindset.",
          type: "quality-assurance",
          url: "/learn/ship-and-production/testing-security-audit",
        },
        {
          id: "deployment-production",
          title: "Production Deployment",
          description:
            "Prepare the app for deployment with monitoring, environment management, and release discipline.",
          type: "deployment",
          url: "/learn/ship-and-production/deployment-production",
        },
        {
          id: "documentation-polish",
          title: "Documentation and Professional Polish",
          description:
            "Write docs, tighten onboarding, and make the project easier to understand and present.",
          type: "documentation",
          url: "/learn/ship-and-production/documentation-polish",
        },
        {
          id: "performance-optimization",
          title: "Performance Optimization",
          description:
            "Improve runtime efficiency, caching strategy, and production responsiveness.",
          type: "optimization",
          url: "/learn/ship-and-production/performance-optimization",
        },
        {
          id: "portfolio-presentation",
          title: "Portfolio Presentation",
          description:
            "Package the final work into a clear case study, demo, and hiring-ready showcase.",
          type: "showcase",
          url: "/learn/ship-and-production/portfolio-presentation",
        },
      ],
    },
  ],
  learning_progression: {
    solana_foundations_focus:
      "Understand Solana's core model through CLI work, accounts, transactions, and architecture.",
    rust_foundations_focus:
      "Build the Rust fluency needed to write Solana programs without guessing through ownership or data modeling.",
    anchor_programs_focus:
      "Use Anchor to build real programs with better structure, safer validation, and realistic project flows.",
    solana_kit_clients_focus:
      "Build modern clients with @solana/kit, wallet-standard, and production-minded transaction UX.",
    ship_and_production_focus:
      "Turn a working project into a deployable, testable, well-documented portfolio piece.",
  },
  skill_milestones: {
    solana_foundations:
      "Can use the Solana CLI confidently and explain accounts, transactions, and the high-level runtime model.",
    rust_foundations:
      "Can write clear Rust code using ownership, borrowing, structs, enums, collections, and methods with confidence.",
    anchor_programs:
      "Can build Anchor programs with tested instructions, PDA flows, token interactions, and cleaner validation logic.",
    solana_kit_clients:
      "Can build kit-first Solana clients with wallet connection, account reads, transaction assembly, and reliable UX.",
    ship_and_production:
      "Can polish, test, deploy, and present a Solana project with production quality expectations.",
  },
  project_progression: [
    "A CLI toolkit for exploring real Solana accounts, balances, and transactions.",
    "A wallet ledger build that forces clean Rust syntax, ownership, and data modeling habits.",
    "Anchor program projects that teach PDAs, token flows, and cross-program interaction with real constraints.",
    "A modern @solana/kit client that connects wallets, reads state, and sends transactions cleanly.",
    "A production-ready capstone with deployment, performance work, documentation, and portfolio presentation.",
  ],
  assessment_criteria: {
    technical_depth:
      "Understanding of Solana's architecture, program model, and client flows with accurate mental models.",
    security_awareness:
      "Ability to reason about validation, authority, failure paths, and defensive implementation choices.",
    code_quality:
      "Clean, maintainable, well-tested code that matches modern Solana development practices.",
    user_experience:
      "Clear transaction flows, readable interfaces, and resilient feedback for blockchain actions.",
    professional_readiness:
      "Strong documentation, deployment discipline, and a credible portfolio presentation of the final work.",
  },
};
