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
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 bg-[var(--ds-background)] pb-16 pt-2 text-[var(--ds-foreground)] sm:pb-20"
    >
      <div className="ds-shell">
        <nav
          aria-label="Opportunity categories"
          className="overflow-x-auto border-b border-[var(--ds-border)] py-3"
        >
          <div className="flex min-w-max items-center gap-1">
            {opportunityNavigation.map((item) => {
              const active = item.href === page.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "ds-focus-ring inline-flex min-h-10 items-center rounded-full px-3 text-sm font-medium transition-colors duration-150 active:translate-y-px",
                    active
                      ? "bg-[var(--ds-foreground)] text-[var(--ds-card)]"
                      : "text-[var(--ds-muted-foreground)] hover:bg-[var(--ds-secondary)] hover:text-[var(--ds-foreground)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <header className="grid gap-8 border-b border-[var(--ds-border)] py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end lg:py-20">
          <div>
            <p className="ds-section-label">{page.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[3.5rem]">
              {page.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--ds-muted-foreground)] sm:text-lg">
              {page.description}
            </p>
          </div>

          <aside className="border-t border-[var(--ds-border)] pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4 text-[var(--ds-accent-muted)]" aria-hidden="true" />
              Curated, not scraped
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--ds-muted-foreground)]">
              {String(page.sources.length).padStart(2, "0")} trusted {page.sources.length === 1 ? "source" : "sources"}. Details remain with each publisher.
            </p>
          </aside>
        </header>

        <section className="py-12 sm:py-16">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-medium tracking-[-0.02em]">Primary sources</h2>
            <span className="font-mono text-xs tabular-nums text-[var(--ds-muted-foreground)]">
              {String(page.sources.length).padStart(2, "0")}
            </span>
          </div>

          <div className="space-y-3">
            {page.sources.map((source, index) => {
              const stale = needsReview(source.lastVerified);
              return (
                <article
                  key={source.sourceUrl}
                  className="group grid gap-6 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-card)] p-5 transition-colors duration-150 hover:border-[#bdbdbd] hover:bg-[#fcfcfc] sm:p-6 lg:grid-cols-[180px_minmax(0,1fr)_auto] lg:items-center"
                >
                  <div className="flex min-h-16 items-center justify-center lg:border-r lg:border-[var(--ds-border)] lg:pr-6">
                    <div
                      className={cn(
                        "relative flex items-center justify-center overflow-hidden rounded-lg border border-[var(--ds-border)]",
                        source.logo.variant === "mark"
                          ? "h-14 w-14 bg-[var(--ds-background)]"
                          : "h-14 w-36 bg-[var(--ds-foreground)]",
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
                      <span className="font-mono text-[11px] tabular-nums text-[var(--ds-muted-foreground)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs font-medium text-[var(--ds-muted-foreground)]">{source.publisher}</span>
                      <span className="h-1 w-1 rounded-full bg-[#c9c9c9]" aria-hidden="true" />
                      <span className="text-xs text-[var(--ds-muted-foreground)]">
                        {source.sourceType === "official" ? "Official" : "Ecosystem partner"}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-medium tracking-[-0.025em]">{source.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ds-muted-foreground)]">{source.summary}</p>
                    {source.statusNote ? (
                      <p className="mt-3 text-xs leading-5 text-[var(--ds-accent-muted)]">{source.statusNote}</p>
                    ) : null}
                    <div
                      className={cn(
                        "mt-4 flex items-center gap-2 text-xs lg:mt-3",
                        stale ? "text-[var(--ds-warning)]" : "text-[var(--ds-muted-foreground)]",
                      )}
                    >
                      <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{stale ? "Review due" : `Checked ${formatVerifiedDate(source.lastVerified)}`}</span>
                    </div>
                  </div>

                  <a
                    href={source.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${source.title} from ${source.publisher}`}
                    className="ds-focus-ring inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[var(--ds-accent-control)] px-4 text-sm font-semibold text-[var(--ds-accent-ink)] transition-colors duration-150 hover:bg-[var(--ds-accent-control-hover)] active:translate-y-px"
                  >
                    Visit source
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-[var(--ds-border)] pt-6 text-sm leading-6 text-[var(--ds-muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
          <p>Learn.sol does not reproduce third-party listings or application terms.</p>
          <Link
            href="/modules"
            className="ds-focus-ring w-fit font-medium text-[var(--ds-foreground)] underline decoration-[#bdbdbd] underline-offset-4 transition-colors duration-150 hover:text-[var(--ds-accent-muted)]"
          >
            Return to learning
          </Link>
        </footer>
      </div>
    </main>
  );
}
