import Link from "next/link";
import { challengesSource } from "@/lib/challenges/source";
import { getMDXComponents } from "@/mdx-components";
import ChallengeEditorClient from "./ChallengeEditorClient";
import type { ChallengeExecutor } from "@/lib/challenges/registry";
import { ArrowLeft } from "lucide-react";

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
  executor?: ChallengeExecutor;
};

type Props = ChallengeSpec & {
  backHref?: string;
};

const getDifficultyStyle = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "text-[#14f195] bg-[#14f195]/10 border-[#14f195]/20";
    case "Medium":
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "Hard":
      return "text-[#9945ff] bg-[#9945ff]/10 border-[#9945ff]/20";
    default:
      return "text-neutral-400 bg-neutral-800 border-neutral-700";
  }
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
  executor,
}: Props) {
  // Resolve MDX for problem statement if provided
  let MDX: React.ComponentType<any> | null = null;
  if (mdxSlug) {
    const page = challengesSource.getPage(mdxSlug);
    MDX = page?.data.body ?? null;
  }

  const canExecute = Boolean(executor);

  return (
    <div
      className="fixed inset-0 z-[100] w-full overflow-hidden bg-black"
      style={{ height: "100dvh" }}
    >
      <div
        className="relative z-10 flex min-h-0 flex-col overflow-hidden"
        style={{ height: "100dvh" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/80 px-4 py-3 sm:px-6 shrink-0">
          <div className="flex items-center gap-4">
            <Link
              href={backHref}
              className="group flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="h-4 w-px bg-neutral-700" />
            <div className="flex flex-col">
              <div className="text-sm font-medium text-white">{title}</div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                <span className={`px-2 py-0.5 rounded border text-[10px] uppercase tracking-wider font-medium ${getDifficultyStyle(difficulty)}`}>
                  {difficulty}
                </span>
                {tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="hidden sm:inline text-neutral-500"
                  >
                    {t}
                  </span>
                ))}
                {currentIndex && totalCount && (
                  <span className="text-neutral-600">
                    {currentIndex} / {totalCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="relative min-h-0 grid h-full flex-1 grid-rows-1 overflow-hidden sm:grid-cols-2 sm:gap-0">
          {/* Problem panel */}
          <section className="relative flex h-full min-h-0 flex-col border-b border-neutral-800 sm:border-b-0 sm:border-r sm:border-neutral-800 bg-neutral-950">
            <div className="relative flex-1 overflow-y-auto p-5 sm:p-8">
              {MDX ? (
                <div className="prose prose-invert prose-neutral max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-p:text-neutral-400 prose-code:text-[#14f195] prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800">
                  <MDX components={getMDXComponents()} />
                </div>
              ) : (
                <div className="prose prose-invert prose-neutral max-w-none">
                  <h2 className="mb-3 text-xl font-medium tracking-tight text-white">
                    {title}
                  </h2>
                  <p className="text-neutral-400 leading-relaxed">
                    {description}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Code panel */}
          <section className="relative flex h-full min-h-0 flex-col bg-neutral-950">
            <ChallengeEditorClient
              starterCode={starterCode}
              track={track}
              currentIndex={currentIndex}
              totalCount={totalCount}
              challengeId={currentIndex}
              canExecute={canExecute}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
