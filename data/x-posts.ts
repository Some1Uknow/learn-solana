export type XPost = {
  name: string;
  handle: string;
  avatar: string;
  content: string;
  href?: string;
};

// Replace with real comments as you collect them. Keep avatars under /public.
export const X_POSTS: XPost[] = [
  {
    name: "Solana Dev",
    handle: "@buildonsol",
    avatar: "/solanaLogo.png",
    content: "learn.sol made Solana click for me. The modules are clean and practical.",
  },
  {
    name: "Rusty",
    handle: "@rustacean",
    avatar: "/rust-2.png",
    content: "Games + challenges = the best way to learn. Big fan of the UX.",
  },
  {
    name: "Anchor Max",
    handle: "@anchormax",
    avatar: "/anchor.png",
    content: "Anchor walkthroughs are on point. Went from zero to minting in a day.",
  },
  {
    name: "NextJS Wizard",
    handle: "@nextwizard",
    avatar: "/nextjs.png",
    content: "Love the consistency across modules, projects, and games. Super polished.",
  }
];
