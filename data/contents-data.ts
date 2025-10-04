// This file exports the contents-data originally from contents-data.json
// Use this for direct import in your modules/pages/components

export const contentsData = {
  modules: [
    {
      id: "week-1",
      title: "🧱 Solana Fundamentals",
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
      title: "🦀 Rust for Solana",
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
      title: "⚓ Anchor Framework",
      description:
        "Build real apps using Anchor (Solana's Rust-based smart contract framework)",
      goal: "Master Anchor for ergonomic and powerful smart contract development",
      image: "/anchor.png",
      icon: "anchor",
      overviewUrl: "/learn/week-3",
      topics: [
        {
          id: "anchor-introduction",
          title: "Anchor Framework Overview",
          description:
            "Understanding Anchor's benefits: IDL generation, account validation macros, TypeScript client generation, and testing framework",
          type: "theory",
          url: "/learn/week-3/anchor-introduction",
        },
        {
          id: "spl-token-integration",
          title: "SPL Token Integration",
          description:
            "Working with SPL tokens: minting, burning, transfers, associated token accounts, and token metadata",
          type: "theory",
          url: "/learn/week-3/spl-token-integration",
        },
        {
          id: "token-minting-project",
          title: "Project: Token Minting & Management dApp",
          description:
            "Build complete token ecosystem with minting authority, supply management, and holder interactions using Anchor",
          type: "project",
          url: "/learn/week-3/token-minting-project",
        },
        {
          id: "pda-seed-derivation",
          title: "PDAs & Seed Derivation Mastery",
          description:
            "Program Derived Addresses, seed patterns, bump derivation, and using PDAs for program-controlled accounts",
          type: "theory",
          url: "/learn/week-3/pda-seed-derivation",
        },
        {
          id: "escrow-mechanism-project",
          title: "Project: Advanced Escrow System",
          description:
            "Build sophisticated escrow with PDAs, conditional releases, multi-party agreements, and time-based unlocking",
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
          id: "defi-integration-challenge",
          title: "Challenge: DeFi Protocol Integration",
          description:
            "Integrate with existing DeFi protocols using CPI: token swaps, liquidity provision, or yield farming mechanisms",
          type: "challenge",
          url: "/learn/week-3/defi-integration-challenge",
        },
        {
          id: "anchor-ergonomics",
          title: "Anchor Development Best Practices",
          description:
            "Account constraints, error handling, events, program upgrades, and testing patterns for maintainable code",
          type: "theory",
          url: "/learn/week-3/anchor-ergonomics",
        },
      ],
    },
    {
      id: "week-4",
      title: "🧑‍💻 Client-Side & Full-Stack",
      description:
        "Integrate smart contracts with React, wallets, and full dApp flows",
      goal: "Build production-ready frontend applications with seamless blockchain integration",
      image: "/nextjs.png",
      icon: "fullstack",
      overviewUrl: "/learn/week-4",
      topics: [
        {
          id: "wallet-integration-exercise",
          title: "Exercise: Wallet Connect Implementation",
          description:
            "Integrate multiple wallet adapters (Phantom, Solflare, Ledger), handle connection states, and manage user sessions",
          type: "exercise",
          url: "/learn/week-4/wallet-integration-exercise",
        },
        {
          id: "react-integration-project",
          title: "Project: React dApp with Real-Time Updates",
          description:
            "Build responsive React application with wallet integration, account subscriptions, and optimistic UI updates",
          type: "project",
          url: "/learn/week-4/react-integration-project",
        },
        {
          id: "ux-enhancements",
          title: "UX Enhancement Patterns",
          description:
            "Transaction status indicators, error handling, loading states, confirmation flows, and user feedback systems",
          type: "theory",
          url: "/learn/week-4/ux-enhancements",
        },
        {
          id: "testing-cicd-setup",
          title: "Testing & CI/CD Pipeline",
          description:
            "Unit tests, integration tests, E2E testing with Cypress, GitHub Actions, automated deployment workflows",
          type: "theory",
          url: "/learn/week-4/testing-cicd-setup",
        },
        {
          id: "deployment-strategies",
          title: "Deployment to Devnet/Mainnet",
          description:
            "Environment configuration, program deployment, frontend hosting, monitoring, and rollback strategies",
          type: "theory",
          url: "/learn/week-4/deployment-strategies",
        },
        {
          id: "architecture-optimization",
          title: "Architecture & Gas Optimization",
          description:
            "Compute unit budgeting, transaction batching, account optimization, and cost-effective design patterns",
          type: "theory",
          url: "/learn/week-4/architecture-optimization",
        },
        {
          id: "upgrades-maintenance-challenge",
          title: "Challenge: Program Upgrades & Maintenance",
          description:
            "Implement upgrade mechanisms, state migration strategies, and backward compatibility for evolving applications",
          type: "challenge",
          url: "/learn/week-4/upgrades-maintenance-challenge",
        },
      ],
    },
    {
      id: "week-5",
      title: "🚀 Capstone & Portfolio",
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
