export const opportunityCategories = [
  "grants",
  "jobs",
  "hackathons",
  "bounties",
  "accelerators",
  "events",
  "community",
  "ecosystem",
] as const;

export type OpportunityCategory = (typeof opportunityCategories)[number];

export type OpportunitySource = {
  publisher: string;
  title: string;
  sourceUrl: string;
  summary: string;
  logo: {
    src: string;
    alt: string;
    variant: "mark" | "wordmark";
  };
  sourceType: "official" | "ecosystem-partner";
  lastVerified: string;
  statusNote?: string;
};

export type OpportunityPage = {
  category: OpportunityCategory;
  label: string;
  href: `/${OpportunityCategory}`;
  eyebrow: string;
  title: string;
  description: string;
  sources: readonly OpportunitySource[];
};

const verifiedOn = "2026-07-16";

export const opportunityPages: Record<OpportunityCategory, OpportunityPage> = {
  grants: {
    category: "grants",
    label: "Grants",
    href: "/grants",
    eyebrow: "Fund the public good",
    title: "Grants and funding for Solana builders.",
    description:
      "Start with the Foundation for public goods, then explore ecosystem funding for early-stage work.",
    sources: [
      {
        publisher: "Solana Foundation",
        title: "Grants & Funding",
        sourceUrl: "https://solana.org/grants-funding",
        summary:
          "Funding guidance, Foundation grant applications, and requests for proposals for Solana public goods.",
        logo: {
          src: "/solanaFndn.png",
          alt: "Solana Foundation",
          variant: "wordmark",
        },
        sourceType: "official",
        lastVerified: verifiedOn,
      },
      {
        publisher: "Superteam Earn",
        title: "Crypto Grants & Web3 Funding",
        sourceUrl: "https://superteam.fun/earn/grants",
        summary:
          "Equity-free grant opportunities for builders turning early ideas into Solana products.",
        logo: {
          src: "https://superteam.fun/assets/logo.svg",
          alt: "Superteam",
          variant: "wordmark",
        },
        sourceType: "ecosystem-partner",
        lastVerified: verifiedOn,
      },
    ],
  },
  jobs: {
    category: "jobs",
    label: "Jobs",
    href: "/jobs",
    eyebrow: "Build a career in the ecosystem",
    title: "Jobs across the Solana ecosystem.",
    description:
      "Explore the network job board for full-time roles and project marketplaces for flexible work.",
    sources: [
      {
        publisher: "Solana Foundation",
        title: "Solana Network Opportunities Job Board",
        sourceUrl: "https://jobs.solana.com/jobs",
        summary:
          "Search current roles across companies building in and around the Solana network.",
        logo: {
          src: "/solanaFndn.png",
          alt: "Solana Foundation",
          variant: "wordmark",
        },
        sourceType: "official",
        lastVerified: verifiedOn,
      },
      {
        publisher: "Superteam Earn",
        title: "Projects",
        sourceUrl: "https://superteam.fun/earn/all?tab=projects",
        summary:
          "Browse short-term and freelance-style projects where proof of work can lead to deeper opportunities.",
        logo: {
          src: "https://superteam.fun/assets/logo.svg",
          alt: "Superteam",
          variant: "wordmark",
        },
        sourceType: "ecosystem-partner",
        lastVerified: verifiedOn,
        statusNote: "Project work, not a conventional employment board.",
      },
    ],
  },
  hackathons: {
    category: "hackathons",
    label: "Hackathons",
    href: "/hackathons",
    eyebrow: "Enter the arena",
    title: "Solana hackathons worth watching.",
    description:
      "Follow the home for global Solana competitions, builder resources, team formation, and winner pathways.",
    sources: [
      {
        publisher: "Colosseum",
        title: "Solana Hackathons",
        sourceUrl: "https://colosseum.com/hackathon",
        summary:
          "The official competition page for Colosseum's global online Solana hackathons.",
        logo: {
          src: "https://colosseum.com/images/logos/colosseum-logo-white.svg",
          alt: "Colosseum",
          variant: "wordmark",
        },
        sourceType: "ecosystem-partner",
        lastVerified: verifiedOn,
      },
    ],
  },
  bounties: {
    category: "bounties",
    label: "Bounties",
    href: "/bounties",
    eyebrow: "Earn through proof of work",
    title: "Paid bounties for proof of work.",
    description:
      "Bounties are a practical route to build a public portfolio while contributing to ecosystem teams.",
    sources: [
      {
        publisher: "Superteam Earn",
        title: "Bounties",
        sourceUrl: "https://superteam.fun/earn/all?tab=bounties",
        summary:
          "Browse bounties across development, design, content, and other contributor tracks.",
        logo: {
          src: "https://superteam.fun/assets/logo.svg",
          alt: "Superteam",
          variant: "wordmark",
        },
        sourceType: "ecosystem-partner",
        lastVerified: verifiedOn,
      },
    ],
  },
  accelerators: {
    category: "accelerators",
    label: "Accelerators",
    href: "/accelerators",
    eyebrow: "From prototype to company",
    title: "Accelerators for Solana founders.",
    description:
      "Explore the founder pathway available to selected hackathon winners building full-time on Solana.",
    sources: [
      {
        publisher: "Colosseum",
        title: "Accelerator",
        sourceUrl: "https://colosseum.com/accelerator",
        summary:
          "An eight-week founder program with mentorship, a peer network, and an upfront investment for accepted teams.",
        logo: {
          src: "https://colosseum.com/images/logos/colosseum-logo-white.svg",
          alt: "Colosseum",
          variant: "wordmark",
        },
        sourceType: "ecosystem-partner",
        lastVerified: verifiedOn,
        statusNote: "Admission is tied to Colosseum hackathon or Eternal outcomes.",
      },
    ],
  },
  events: {
    category: "events",
    label: "Events",
    href: "/events",
    eyebrow: "Meet builders in real life",
    title: "Meet the Solana ecosystem.",
    description:
      "Track official gatherings, online sessions, and community events from one trusted starting point.",
    sources: [
      {
        publisher: "Solana",
        title: "Solana Events",
        sourceUrl: "https://solana.com/events",
        summary:
          "The official calendar for upcoming Solana and community events, with direct registration links.",
        logo: {
          src: "/solanaLogo4k.png",
          alt: "Solana",
          variant: "mark",
        },
        sourceType: "official",
        lastVerified: verifiedOn,
      },
    ],
  },
  community: {
    category: "community",
    label: "Community",
    href: "/community",
    eyebrow: "Never build alone",
    title: "Find your people in Solana.",
    description:
      "Use official community channels, technical Q&A, and local Superteam chapters to find your people.",
    sources: [
      {
        publisher: "Solana",
        title: "Solana Community",
        sourceUrl: "https://solana.com/community",
        summary:
          "Official communication channels for engineering discussions, announcements, events, and media.",
        logo: {
          src: "/solanaLogo4k.png",
          alt: "Solana",
          variant: "mark",
        },
        sourceType: "official",
        lastVerified: verifiedOn,
      },
      {
        publisher: "Stack Exchange",
        title: "Solana Stack Exchange",
        sourceUrl: "https://solana.stackexchange.com/",
        summary:
          "A searchable technical Q&A community for Anchor, programs, token flows, RPC, and client development.",
        logo: {
          src: "https://cdn.sstatic.net/Sites/solana/Img/apple-touch-icon.png",
          alt: "Solana Stack Exchange",
          variant: "mark",
        },
        sourceType: "ecosystem-partner",
        lastVerified: verifiedOn,
      },
      {
        publisher: "Superteam",
        title: "Find Your Nearest Superteam",
        sourceUrl: "https://superteam.fun/",
        summary:
          "Find local Solana and Web3 talent communities, including chapters around the world.",
        logo: {
          src: "https://superteam.fun/assets/logo.svg",
          alt: "Superteam",
          variant: "wordmark",
        },
        sourceType: "ecosystem-partner",
        lastVerified: verifiedOn,
      },
    ],
  },
  ecosystem: {
    category: "ecosystem",
    label: "Ecosystem",
    href: "/ecosystem",
    eyebrow: "See what is possible",
    title: "Map the Solana ecosystem.",
    description:
      "Use the ecosystem map to move from a learning track into the products, categories, and builders that interest you.",
    sources: [
      {
        publisher: "Solana",
        title: "Solana Ecosystem Directory",
        sourceUrl: "https://solana.com/ecosystem",
        summary:
          "Explore network resources, community programs, events, research, and use-case categories.",
        logo: {
          src: "/solanaLogo4k.png",
          alt: "Solana",
          variant: "mark",
        },
        sourceType: "official",
        lastVerified: verifiedOn,
      },
      {
        publisher: "Solana",
        title: "Developer Resources",
        sourceUrl: "https://solana.com/developers",
        summary:
          "A starting point for official documentation, tools, guides, courses, and developer support.",
        logo: {
          src: "/solanaLogo4k.png",
          alt: "Solana",
          variant: "mark",
        },
        sourceType: "official",
        lastVerified: verifiedOn,
      },
    ],
  },
};

export const opportunityNavigation = opportunityCategories.map((category) => {
  const page = opportunityPages[category];
  return { label: page.label, href: page.href };
});

export function getOpportunityPage(category: string): OpportunityPage | undefined {
  return opportunityPages[category as OpportunityCategory];
}
