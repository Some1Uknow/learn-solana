"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

type Provider = {
  id: string;
  label: string;
  buildHref: (prompt: string) => string;
};

const providers: Provider[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    buildHref: (prompt) => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: "claude",
    label: "Claude",
    buildHref: (prompt) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: "perplexity",
    label: "Perplexity",
    buildHref: (prompt) =>
      `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`,
  },
];

function AssistantLogo({ provider }: { provider: Provider["id"] }) {
  switch (provider) {
    case "chatgpt":
      return (
        <span className="ls-docs-assistant-icon" data-provider={provider} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              fill="currentColor"
              d="M22.282 9.821a6 6 0 0 0-.516-4.91a6.05 6.05 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a6 6 0 0 0-3.998 2.9a6.05 6.05 0 0 0 .743 7.097a5.98 5.98 0 0 0 .51 4.911a6.05 6.05 0 0 0 6.515 2.9A6 6 0 0 0 13.26 24a6.06 6.06 0 0 0 5.772-4.206a6 6 0 0 0 3.997-2.9a6.06 6.06 0 0 0-.747-7.073M13.26 22.43a4.48 4.48 0 0 1-2.876-1.04l.141-.081l4.779-2.758a.8.8 0 0 0 .392-.681v-6.737l2.02 1.168a.07.07 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494M3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085l4.783 2.759a.77.77 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646M2.34 7.896a4.5 4.5 0 0 1 2.366-1.973V11.6a.77.77 0 0 0 .388.677l5.815 3.354l-2.02 1.168a.08.08 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.08.08 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667m2.01-3.023l-.141-.085l-4.774-2.782a.78.78 0 0 0-.785 0L9.409 9.23V6.897a.07.07 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.8.8 0 0 0-.393.681zm1.097-2.365l2.602-1.5l2.607 1.5v2.999l-2.597 1.5l-2.607-1.5Z"
            />
          </svg>
        </span>
      );
    case "claude":
      return (
        <span className="ls-docs-assistant-icon" data-provider={provider} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              fill="currentColor"
              d="m4.714 15.956l4.718-2.648l.079-.23l-.08-.128h-.23l-.79-.048l-2.695-.073l-2.337-.097l-2.265-.122l-.57-.121l-.535-.704l.055-.353l.48-.321l.685.06l1.518.104l2.277.157l1.651.098l2.447.255h.389l.054-.158l-.133-.097l-.103-.098l-2.356-1.596l-2.55-1.688l-1.336-.972l-.722-.491L2 6.223l-.158-1.008l.656-.722l.88.06l.224.061l.893.686l1.906 1.476l2.49 1.833l.364.304l.146-.104l.018-.072l-.164-.274l-1.354-2.446l-1.445-2.49l-.644-1.032l-.17-.619a3 3 0 0 1-.103-.729L6.287.133L6.7 0l.995.134l.42.364l.619 1.415L9.735 4.14l1.555 3.03l.455.898l.243.832l.09.255h.159V9.01l.127-1.706l.237-2.095l.23-2.695l.08-.76l.376-.91l.747-.492l.583.28l.48.685l-.067.444l-.286 1.851l-.558 2.903l-.365 1.942h.213l.243-.242l.983-1.306l1.652-2.064l.728-.82l.85-.904l.547-.431h1.032l.759 1.129l-.34 1.166l-1.063 1.347l-.88 1.142l-1.263 1.7l-.79 1.36l.074.11l.188-.02l2.853-.606l1.542-.28l1.84-.315l.832.388l.09.395l-.327.807l-1.967.486l-2.307.462l-3.436.813l-.043.03l.049.061l1.548.146l.662.036h1.62l3.018.225l.79.522l.473.638l-.08.485l-1.213.62l-1.64-.389l-3.825-.91l-1.31-.329h-.183v.11l1.093 1.068l2.003 1.81l2.508 2.33l.127.578l-.321.455l-.34-.049l-2.204-1.657l-.85-.747l-1.925-1.62h-.127v.17l.443.649l2.343 3.521l.122 1.08l-.17.353l-.607.213l-.668-.122l-1.372-1.924l-1.415-2.168l-1.141-1.943l-.14.08l-.674 7.254l-.316.37l-.728.28l-.607-.461l-.322-.747l.322-1.476l.388-1.924l.316-1.53l.285-1.9l.17-.632l-.012-.042l-.14.018l-1.432 1.967l-2.18 2.945l-1.724 1.845l-.413.164l-.716-.37l.066-.662l.401-.589l2.386-3.036l1.439-1.882l.929-1.086l-.006-.158h-.055L4.138 18.56l-1.13.146l-.485-.456l.06-.746l.231-.243l1.907-1.312Z"
            />
          </svg>
        </span>
      );
    case "perplexity":
      return (
        <span className="ls-docs-assistant-icon" data-provider={provider} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              fill="currentColor"
              d="M22.398 7.09h-2.31V.068l-7.51 6.354V.158h-1.156v6.196L4.49 0v7.09H1.602v10.397H4.49V24l6.933-6.36v6.201h1.155v-6.047l6.932 6.181v-6.488h2.888zm-3.466-4.531v4.53h-5.355zm-13.286.067l4.869 4.464h-4.87zM2.758 16.332V8.245h7.847L4.49 14.36v1.972zm2.888 5.04v-6.534l5.776-5.776v7.011zm12.708.025l-5.776-5.15V9.061l5.776 5.776zm2.889-5.065H19.51V14.36l-6.115-6.115h7.848z"
            />
          </svg>
        </span>
      );
    default:
      return null;
  }
}

function absoluteUrl(path: string) {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).toString();
}

function buildPrompt(title: string, pagePath: string, markdownPath: string) {
  return [
    `Explain the concepts on this page: ${absoluteUrl(pagePath)}`,
    `Use the markdown version if available: ${absoluteUrl(markdownPath)}`,
    `Lesson title: ${title}`,
    "Break the explanation into clear steps and keep the code reasoning concrete.",
  ].join("\n");
}

export function LearnPageActions({
  title,
  pagePath,
  markdownPath,
}: {
  title: string;
  pagePath: string;
  markdownPath: string;
}) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const providerCountLabel = `${providers.length} assistants`;

  async function handleCopyMarkdown() {
    try {
      setBusy(true);
      const response = await fetch(markdownPath, {
        headers: {
          accept: "text/markdown,text/plain;q=0.9,*/*;q=0.8",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to load markdown: ${response.status}`);
      }

      const markdown = await response.text();
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      toast({
        title: "Markdown copied",
        description: "The lesson markdown is now in your clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "The markdown could not be copied. Try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleOpenIn(provider: Provider) {
    try {
      const prompt = buildPrompt(title, pagePath, markdownPath);
      await navigator.clipboard.writeText(prompt);
      window.open(provider.buildHref(prompt), "_blank", "noopener,noreferrer");
      toast({
        title: `Opened ${provider.label}`,
        description:
          "The assistant was opened with the lesson prompt and the prompt was copied as fallback.",
      });
    } catch {
      toast({
        title: `Couldn't open ${provider.label}`,
        description: "The prompt could not be copied. Try again.",
      });
    }
  }

  return (
    <div className="ls-docs-actions">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="ls-docs-action-button"
        onClick={handleCopyMarkdown}
        disabled={busy}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Copied" : "Copy Markdown"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ls-docs-action-button"
          >
            <Sparkles className="size-4" />
            Open in
            <ChevronDown className="size-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>{providerCountLabel}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {providers.map((provider) => (
            <DropdownMenuItem
              key={provider.id}
              onClick={() => handleOpenIn(provider)}
            >
              <AssistantLogo provider={provider.id} />
              {provider.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
