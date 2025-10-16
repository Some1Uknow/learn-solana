import Link from "next/link";
import { challengesSource } from "@/lib/challenges/source";
import { getMDXComponents } from "@/mdx-components";
import ChallengeEditorClient from "./ChallengeEditorClient";

export type ChallengeSpec = {
  title: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string[];
  description: string;
  starterCode?: string;
  mdxSlug?: string[]; // e.g., ["rust","1"] mapped to content/challenges/rust/1.mdx
  currentIndex?: number; // for nav
  totalCount?: number; // for nav
  track?: string; // e.g., "rust"
};

type Props = ChallengeSpec & {
  backHref?: string;
};

export default function ChallengePageWorkspace({
  title,
  difficulty = "Easy",
  tags = [],
  description,
  starterCode = '// Write your Rust solution here\nfn main() {\n    println!("Hello, Rustacean!");\n}\n',
  backHref = "/challenges",
  mdxSlug,
  currentIndex,
  totalCount,
  track,
}: Props) {
  const backgroundStyle = `
    radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.12), transparent 50%),
    radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.10), transparent 60%),
    radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.14), transparent 65%),
    radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.06), transparent 40%),
    #000000
  `;

  // Resolve MDX for problem statement if provided
  let MDX: React.ComponentType<any> | null = null;
  if (mdxSlug) {
    const page = challengesSource.getPage(mdxSlug);
    MDX = page?.data.body ?? null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] w-full overflow-hidden"
      style={{ background: backgroundStyle, height: "100dvh" }}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(80%_60%_at_80%_0%,rgba(255,255,255,0.05),transparent_60%)]" />

      <div
        className="relative z-10 flex min-h-0 flex-col overflow-hidden"
        style={{ height: "100dvh" }}
      >
        {/* Warning banner - top */}
        <div className="w-full overflow-hidden">
          <div
            className="py-2 whitespace-nowrap will-change-transform animate-marquee"
            style={
              { ["--duration" as any]: "12s", ["--gap" as any]: "2rem" } as any
            }
          >
            <span className="mx-4 inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#ff6b6b]/90 via-[#ff4d4f]/80 to-[#ff6b6b]/90 font-semibold text-sm drop-shadow-[0_0_16px_rgba(255,75,75,0.8)]">
              NOTICE: Execution of code in this editor is not yet supported. The
              execution infrastructure (WASM sandboxes) is currently under
              development. Contributions are welcome — please open an issue or
              submit a pull request to the project repository to help accelerate
              completion and improve the project.
            </span>
          </div>
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-3 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href={backHref}
              className="group rounded-md border border-white/10 bg-white/5 p-2 text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="transition group-hover:scale-110"
              >
                <path
                  d="M10 6l-6 6 6 6M4 12h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-white">{title}</div>
              <div className="mt-0.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                  {difficulty}
                </span>
                {tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5"
                  >
                    {t}
                  </span>
                ))}
                {tags.length > 3 && <span>+{tags.length - 3}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="relative min-h-0 grid h-full flex-1 grid-rows-1 overflow-hidden sm:grid-cols-2 sm:gap-0">
          {/* Problem panel */}
          <section className="relative flex h-full min-h-0 flex-col border-b border-white/10 sm:border-b-0 sm:border-r sm:border-white/10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_0%_0%,rgba(255,255,255,0.04),transparent_55%)]" />
            <div className="relative flex-1 overflow-y-auto p-5 sm:p-8">
              {MDX ? (
                <div className="prose prose-invert prose-zinc max-w-none">
                  <MDX components={getMDXComponents()} />
                </div>
              ) : (
                <div className="prose prose-invert prose-zinc max-w-none text-zinc-300">
                  <h2 className="mb-3 text-lg font-semibold text-white sm:text-xl">
                    {title}
                  </h2>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {description}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Code panel */}
          <section className="relative flex h-full min-h-0 flex-col">
            <ChallengeEditorClient
              starterCode={starterCode}
              track={track}
              currentIndex={currentIndex}
              totalCount={totalCount}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
