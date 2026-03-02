// This file exports the contents-data originally from contents-data.json
// Use this for direct import in your modules/pages/components

export const contentsData = {
  modules: [
    {
      id: "week-1",
      title: "Solana Fundamentals",
      description:
        "Understand how Solana works under the hood and interact via CLI",
      goal: "Master Solana's core architecture and command-line interactions",
      image: "/solanaLogo.png",
      icon: "fundamentals",
      overviewUrl: "/learn/week-1",
      topics: [
        {
          id: "devnet-setup",
          title: "Development Environment & CLI Tools",
          description:
            "Setting up Solana CLI, configuring clusters, managing keypairs, and understanding the development workflow",
          type: "setup",
          url: "/learn/week-1/devnet-setup",
        },
        {
          id: "accounts-lamports-exercise",
          title: "Exercise: Accounts & Lamports Exploration",
          description:
            "Hands-on practice creating accounts, transferring lamports, understanding rent and account data structures",
          type: "exercise",
          url: "/learn/week-1/accounts-lamports-exercise",
        },
        {
          id: "transaction-anatomy",
          title: "Transaction Structure & Mechanics",
          description:
            "Instruction format, signers, recent blockhash, and transaction lifecycle from creation to confirmation",
          type: "theory",
          url: "/learn/week-1/transaction-anatomy",
        },
        {
          id: "program-interaction-project",
          title: "Project: Program Interaction Toolkit",
          description:
            "Build CLI tools to interact with existing Solana programs, inspect account data, and analyze transactions (non-Anchor approach)",
          type: "project",
          url: "/learn/week-1/program-interaction-project",
        },
        {
          id: "basic-exploration-challenge",
          title: "Challenge: Devnet Program Analysis",
          description:
            "Discover and document how existing devnet programs work by analyzing their transactions and account structures",
          type: "challenge",
          url: "/learn/week-1/basic-exploration-challenge",
        },
      ],
    },
    {
      id: "week-2",
      title: "Rust for Solana",
      description:
        "Learn Rust deeply enough to write secure, optimized smart contracts",
      goal: "Master Rust programming with focus on blockchain security and optimization",
      image: "https://rustacean.net/assets/rustacean-flat-happy.svg",
      icon: "rust",
      overviewUrl: "/learn/week-2",
      topics: [
        {
          id: "day-1-rust-fundamentals",
          title: "Day 1: Rust Fundamentals",
          description: "Core Rust syntax and concepts.",
          type: "theory",
          url: "/learn/week-2/day-1-rust-fundamentals",
        },
        {
          id: "day-1-challenges",
          title: "Day 1: Challenges",
          description: "Practice problems for fundamentals.",
          type: "challenge",
          url: "/learn/week-2/day-1-challenges",
        },
        {
          id: "day-2-ownership-system",
          title: "Day 2: Ownership System",
          description: "Ownership, borrowing, lifetimes.",
          type: "theory",
          url: "/learn/week-2/day-2-ownership-system",
        },
        {
          id: "day-2-challenges",
          title: "Day 2: Challenges",
          description: "Ownership exercises.",
          type: "challenge",
          url: "/learn/week-2/day-2-challenges",
        },
        {
          id: "day-3-data-structures",
          title: "Day 3: Data Structures",
          description: "Enums, structs, traits basics.",
          type: "theory",
          url: "/learn/week-2/day-3-data-structures",
        },
        {
          id: "day-3-challenges",
          title: "Day 3: Challenges",
          description: "Data structures exercises.",
          type: "challenge",
          url: "/learn/week-2/day-3-challenges",
        },
        {
          id: "mid-course-projects",
          title: "Mid-Course Projects",
          description: "Hands-on projects.",
          type: "project",
          url: "/learn/week-2/mid-course-projects",
        },
        {
          id: "day-4-enums-pattern-matching",
          title: "Day 4: Enums & Pattern Matching",
          description: "Advanced enums and match.",
          type: "theory",
          url: "/learn/week-2/day-4-enums-pattern-matching",
        },
        {
          id: "day-4-challenges",
          title: "Day 4: Challenges",
          description: "Enums challenges.",
          type: "challenge",
          url: "/learn/week-2/day-4-challenges",
        },
        {
          id: "day-5-collections-strings",
          title: "Day 5: Collections & Strings",
          description: "Vec, HashMap, String.",
          type: "theory",
          url: "/learn/week-2/day-5-collections-strings",
        },
        {
          id: "day-5-challenges",
          title: "Day 5: Challenges",
          description: "Collections challenges.",
          type: "challenge",
          url: "/learn/week-2/day-5-challenges",
        },
      ],
    },
    {
      id: "week-3",
      title: "Anchor Framework",
      description:
        "Learn Anchor from beginner to intermediate with a slower, step-by-step path",
      goal: "Build production-ready Solana programs with clean Anchor patterns, testing, and security-first validation",
      image: "/anchor.png",
      icon: "anchor",
      overviewUrl: "/learn/week-3",
      topics: [
        {
          id: "anchor-local-setup",
          title: "Anchor Local Setup (Your First Working Workspace)",
          description:
            "Install and verify Solana, Rust, and Anchor; create a workspace; and run your first local tests end to end",
          type: "setup",
          url: "/learn/week-3/anchor-local-setup",
        },
        {
          id: "anchor-core-concepts",
          title: "Anchor Core Concepts (Slow and Clear)",
          description:
            "Understand instructions, accounts, signers, and constraints before writing CRUD logic",
          type: "theory",
          url: "/learn/week-3/anchor-core-concepts",
        },
        {
          id: "anchor-program-anatomy",
          title: "Anchor Program Anatomy (What Each File Does)",
          description:
            "Learn project structure, IDL output, test flow, and how client calls become on-chain state changes",
          type: "theory",
          url: "/learn/week-3/anchor-program-anatomy",
        },
        {
          id: "first-anchor-program",
          title: "First Anchor Program: Counter CRUD (Step by Step)",
          description:
            "Build initialize, increment, decrement, and reset instructions one step at a time with tests",
          type: "exercise",
          url: "/learn/week-3/first-anchor-program",
        },
        {
          id: "pda-seed-derivation",
          title: "PDAs & Seed Derivation (Beginner Friendly)",
          description:
            "Use deterministic account addresses safely with clear seed design and bump handling",
          type: "theory",
          url: "/learn/week-3/pda-seed-derivation",
        },
        {
          id: "spl-token-integration",
          title: "SPL Token Integration with Anchor",
          description:
            "Create mints, token accounts, and safe transfer flows across Token and Token-2022",
          type: "theory",
          url: "/learn/week-3/spl-token-integration",
        },
        {
          id: "token-minting-project",
          title: "Project: Token Minting & Supply Control",
          description:
            "Implement PDA mint authority, supply caps, and admin-controlled minting rules",
          type: "project",
          url: "/learn/week-3/token-minting-project",
        },
        {
          id: "escrow-mechanism-project",
          title: "Project: Escrow with PDA Vault",
          description:
            "Build escrow state transitions with vault PDAs, cancellation paths, and release guardrails",
          type: "project",
          url: "/learn/week-3/escrow-mechanism-project",
        },
        {
          id: "cpi-cross-program",
          title: "Cross-Program Invocations (CPI)",
          description:
            "Calling other programs, building CPI contexts, authority delegation, and composable program design",
          type: "theory",
          url: "/learn/week-3/cpi-cross-program",
        },
        {
          id: "anchor-ergonomics",
          title: "Anchor Development Ergonomics (From Working Code to Clean Code)",
          description:
            "Use constraints, custom errors, events, and testing strategy to keep programs maintainable",
          type: "theory",
          url: "/learn/week-3/anchor-ergonomics",
        },
        {
          id: "defi-integration-challenge",
          title: "Challenge: DeFi Integration with Anchor CPI",
          description:
            "Capstone challenge: integrate CPI flows with strict validation, state machines, and failure-path tests",
          type: "challenge",
          url: "/learn/week-3/defi-integration-challenge",
        },
      ],
    },
    {
      id: "week-4",
      title: "Client-Side & Full-Stack",
      description:
        "Rebuilding this module with a solana/kit-first client architecture",
      goal: "Master wallet connection, transaction flows, and app patterns using @solana/kit in a clean, modern client architecture",
      image: "/solana-kit.svg",
      icon: "fullstack",
      overviewUrl: "/learn/week-4",
      topics: [
        {
          id: "kit-foundations",
          title: "Kit Foundations",
          description:
            "Start with a clean kit-first setup and understand why @solana/kit is the default for new client code",
          type: "setup",
          url: "/learn/week-4/kit-foundations",
        },
        {
          id: "wallet-standard-connection-flow",
          title: "Wallet Standard Connection Flow",
          description:
            "Implement wallet-standard-first connection UX and signing lifecycle for modern Solana clients",
          type: "theory",
          url: "/learn/week-4/wallet-standard-connection-flow",
        },
        {
          id: "rpc-reads-and-account-decoding-with-kit",
          title: "RPC Reads & Account Decoding with Kit",
          description:
            "Read accounts, decode on-chain data, and structure reliable query patterns with @solana/kit",
          type: "exercise",
          url: "/learn/week-4/rpc-reads-and-account-decoding-with-kit",
        },
        {
          id: "transaction-message-building-and-signers",
          title: "Transaction Message Building & Signers",
          description:
            "Build transaction messages, manage fee payer/signer responsibilities, and keep instruction assembly explicit",
          type: "exercise",
          url: "/learn/week-4/transaction-message-building-and-signers",
        },
        {
          id: "send-confirm-retry-and-lifetime-management",
          title: "Send, Confirm, Retry & Lifetime Management",
          description:
            "Handle blockhash lifetimes, confirmations, retries, and user-facing transaction states with production-safe defaults",
          type: "theory",
          url: "/learn/week-4/send-confirm-retry-and-lifetime-management",
        },
        {
          id: "spl-token-and-token-2022-client-flows",
          title: "SPL Token & Token-2022 Client Flows",
          description:
            "Implement token transfer flows with explicit token program handling and extension-aware checks",
          type: "project",
          url: "/learn/week-4/spl-token-and-token-2022-client-flows",
        },
        {
          id: "anchor-client-with-kit",
          title: "Anchor Client Patterns with Kit",
          description:
            "Connect Anchor program workflows to a kit-first client architecture without confusing abstractions",
          type: "theory",
          url: "/learn/week-4/anchor-client-with-kit",
        },
        {
          id: "frontend-transaction-ux-status-errors-recovery",
          title: "Frontend Transaction UX: Status, Errors, Recovery",
          description:
            "Design resilient UX for pending, confirmed, failed, and retried transactions with clear user feedback",
          type: "project",
          url: "/learn/week-4/frontend-transaction-ux-status-errors-recovery",
        },
        {
          id: "client-testing-strategy-lite-unit-and-integration",
          title: "Client Testing Strategy: Lite Unit & Integration",
          description:
            "Build a practical testing stack for client transaction flows, adapters, and failure-path behavior",
          type: "theory",
          url: "/learn/week-4/client-testing-strategy-lite-unit-and-integration",
        },
        {
          id: "mini-capstone-kit-client-for-anchor-program",
          title: "Mini Capstone: Kit Client for an Anchor Program",
          description:
            "Ship a small but complete kit-first client that interacts with an Anchor program end to end",
          type: "challenge",
          url: "/learn/week-4/mini-capstone-kit-client-for-anchor-program",
        },
      ],
    },
    {
      id: "week-5",
      title: "Capstone & Portfolio",
      description:
        "Package your skills into a showcase-worthy, production-grade dApp",
      goal: "Create a professional portfolio piece demonstrating mastery of full Solana development stack",
      image: "/capstone.png",
      icon: "capstone",
      overviewUrl: "/learn/week-5",
      topics: [
        {
          id: "advanced-features-implementation",
          title: "Advanced Features Implementation",
          description:
            "Multi-program interactions, complex state management, advanced security patterns, and performance optimizations",
          type: "implementation",
          url: "/learn/week-5/advanced-features-implementation",
        },
        {
          id: "fullstack-integration",
          title: "Full-Stack Integration & Polish",
          description:
            "Seamless frontend-backend integration, responsive design, accessibility, and professional UI/UX implementation",
          type: "implementation",
          url: "/learn/week-5/fullstack-integration",
        },
        {
          id: "testing-security-audit",
          title: "Comprehensive Testing & Security Audit",
          description:
            "Complete test coverage, security vulnerability assessment, performance testing, and code quality assurance",
          type: "quality-assurance",
          url: "/learn/week-5/testing-security-audit",
        },
        {
          id: "deployment-production",
          title: "Production Deployment",
          description:
            "Deploy full-stack dApp to mainnet/devnet with proper monitoring, analytics, and error tracking systems",
          type: "deployment",
          url: "/learn/week-5/deployment-production",
        },
        {
          id: "documentation-polish",
          title: "Documentation & Professional Polish",
          description:
            "User guides, developer documentation, README optimization, video demos, and professional presentation materials",
          type: "documentation",
          url: "/learn/week-5/documentation-polish",
        },
        {
          id: "performance-optimization",
          title: "Performance Optimization & Scaling",
          description:
            "Gas optimization, caching strategies, CDN setup, database optimization, and scalability preparations",
          type: "optimization",
          url: "/learn/week-5/performance-optimization",
        },
        {
          id: "portfolio-presentation",
          title: "Portfolio Presentation & Showcase",
          description:
            "Professional portfolio website, case study documentation, technical blog posts, and hiring-ready presentation materials",
          type: "showcase",
          url: "/learn/week-5/portfolio-presentation",
        },
      ],
    },
  ],
  learning_progression: {
    week_1_focus:
      "Understanding Solana's unique architecture and mastering CLI-based interactions",
    week_2_focus:
      "Deep Rust programming skills with security-first mindset for blockchain development",
    week_3_focus:
      "Rapid application development using Anchor with real-world DeFi integrations",
    week_4_focus:
      "Professional frontend development with seamless blockchain user experiences",
    week_5_focus:
      "Portfolio-ready production applications demonstrating full-stack mastery",
  },
  skill_milestones: {
    week_1:
      "Can navigate Solana ecosystem confidently via CLI and understand core architectural differences",
    week_2:
      "Can write secure, efficient Rust programs with proper error handling and defensive patterns",
    week_3:
      "Can build complex multi-program applications with token integrations and DeFi interactions",
    week_4:
      "Can create production-ready full-stack dApps with professional UX and deployment pipelines",
    week_5:
      "Can present a portfolio-quality application demonstrating mastery of entire Solana stack",
  },
  project_progression: [
    "CLI toolkit for exploring existing Solana programs and transactions",
    "Security-hardened counter program built with raw Rust and comprehensive testing",
    "Multi-feature DeFi application using Anchor with token minting and escrow capabilities",
    "Full-stack React dApp with wallet integration and real-time blockchain interactions",
    "Production-deployed capstone project with professional documentation and showcase materials",
  ],
  assessment_criteria: {
    technical_depth:
      "Understanding of Solana's unique features and ability to leverage them effectively",
    security_awareness:
      "Implementation of security best practices and defensive programming patterns",
    code_quality:
      "Clean, maintainable, well-tested code following Solana development standards",
    user_experience:
      "Intuitive, responsive frontend with smooth blockchain interaction flows",
    professional_readiness:
      "Portfolio-quality documentation, deployment, and presentation materials",
  },
};
