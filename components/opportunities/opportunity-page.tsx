import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarClock, CheckCircle2 } from "lucide-react";
import { opportunityNavigation, type OpportunityPage } from "@/data/opportunity-resources";
import { cn } from "@/lib/utils";

function formatVerifiedDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function needsReview(date: string) {
  const reviewedAt = new Date(`${date}T00:00:00Z`).getTime();
  return Date.now() - reviewedAt > 45 * 24 * 60 * 60 * 1000;
}

export function OpportunityPageView({ page }: { page: OpportunityPage }) {
  return (
    <main className="min-h-screen bg-[#070809] pb-20 pt-28 text-white sm:pt-32 lg:pt-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Opportunity categories" className="-mx-1 overflow-x-auto pb-1">
          <div className="flex min-w-max items-center gap-1 px-1">
            {opportunityNavigation.map((item) => {
              const active = item.href === page.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-10 items-center rounded-full px-3 text-sm font-medium transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a9ff2f] active:translate-y-px",
                    active
                      ? "bg-white text-[#070809]"
                      : "text-white/58 hover:bg-white/[0.05] hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <header className="grid gap-8 border-b border-white/[0.08] pb-12 pt-12 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end lg:pb-14 lg:pt-16">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#a9ff2f]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#a9ff2f]" aria-hidden="true" />
              {page.eyebrow}
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-[3.5rem]">
              {page.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/66 sm:text-lg">
              {page.description}
            </p>
          </div>

          <div className="border-l border-white/[0.1] pl-5">
            <div className="flex items-center gap-2 text-sm font-medium text-white/82">
              <CheckCircle2 className="h-4 w-4 text-[#a9ff2f]" aria-hidden="true" />
              Curated, not scraped
            </div>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {String(page.sources.length).padStart(2, "0")} trusted {page.sources.length === 1 ? "source" : "sources"}. Details remain with each publisher.
            </p>
          </div>
        </header>

        <section className="py-12 sm:py-14">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">Primary sources</h2>
            <span className="font-mono text-xs tabular-nums text-white/58">
              {String(page.sources.length).padStart(2, "0")}
            </span>
          </div>

          <div className="space-y-3">
            {page.sources.map((source, index) => {
              const stale = needsReview(source.lastVerified);
              return (
                <article
                  key={source.sourceUrl}
                  className="group grid gap-6 rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5 transition-colors duration-100 hover:border-white/[0.16] hover:bg-white/[0.04] sm:p-6 lg:grid-cols-[180px_minmax(0,1fr)_auto] lg:items-center"
                >
                  <div className="flex min-h-16 items-center justify-center lg:border-r lg:border-white/[0.08] lg:pr-6">
                    <div
                      className={cn(
                        "relative flex items-center justify-center",
                        source.logo.variant === "mark" ? "h-12 w-12" : "h-12 w-36",
                      )}
                    >
                      <Image
                        src={source.logo.src}
                        alt={source.logo.alt}
                        fill
                        unoptimized
                        sizes={source.logo.variant === "mark" ? "48px" : "144px"}
                        className="object-contain object-center"
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] tabular-nums text-white/58">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs font-medium text-white/60">{source.publisher}</span>
                      <span className="h-1 w-1 rounded-full bg-white/20" aria-hidden="true" />
                      <span className="text-xs text-white/58">
                        {source.sourceType === "official" ? "Official" : "Ecosystem partner"}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-white">{source.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">{source.summary}</p>
                    {source.statusNote ? (
                      <p className="mt-3 text-xs leading-5 text-[#d8ff98]">{source.statusNote}</p>
                    ) : null}
                    <div className="mt-4 flex items-center gap-2 text-xs text-white/58 lg:mt-3">
                      <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{stale ? "Review due" : `Checked ${formatVerifiedDate(source.lastVerified)}`}</span>
                    </div>
                  </div>

                  <a
                    href={source.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${source.title} from ${source.publisher}`}
                    className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#070809] transition-colors duration-100 hover:bg-[#d8ff98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a9ff2f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070809] active:translate-y-px"
                  >
                    Visit source
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-white/[0.08] pt-6 text-sm leading-6 text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>Learn.sol does not reproduce third-party listings or application terms.</p>
          <Link
            href="/modules"
            className="w-fit font-medium text-white/72 underline decoration-white/20 underline-offset-4 transition-colors duration-100 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a9ff2f]"
          >
            Return to learning
          </Link>
        </footer>
      </div>
    </main>
  );
}
