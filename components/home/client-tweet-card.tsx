"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { CheckCircle } from "lucide-react";

export interface TweetCardData {
  id: string;
  text: string;
  url: string;
  author: {
    name: string;
    handle: string;
    profileImageUrl?: string;
    verified: boolean;
    blueVerified: boolean;
  };
}

export function TweetCardSkeleton() {
  return (
    <div className="mx-2 w-[320px] md:w-[350px] shrink-0 rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded bg-white/10 animate-pulse" />
          <div className="h-2 w-20 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="h-4 w-4 rounded bg-[#3BA9EE]/40 animate-pulse" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-white/10 animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}

function sanitizeTweetText(text: string) {
  return text.replace(/^@some1uknow25\b[:\s,.-]*/i, "").trimStart();
}

export default function TweetCard({ tweet, className }: { tweet: TweetCardData; className?: string }) {
  const { author, url } = tweet;
  const cleanedText = sanitizeTweetText(tweet.text);
  const isVerified = author.verified || author.blueVerified;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "mx-2 w-[320px] md:w-[350px] shrink-0 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-white/90 backdrop-blur-sm",
        "shadow-[0_8px_30px_rgba(0,0,0,0.15)]",
        "block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3BA9EE]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        className
      )}
    >
      <article className="flex flex-col">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10">
            {author.profileImageUrl ? (
              <Image
                src={author.profileImageUrl}
                alt={author.name || author.handle}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-white/10" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 truncate font-medium leading-tight text-white">
              <span className="truncate" title={author.name}>{author.name}</span>
              {isVerified && (
                <span className="text-blue-500" aria-label="Verified on X">
                  <CheckCircle className="h-4 w-4" />
                </span>
              )}
            </div>
            <div className="truncate text-xs text-zinc-400" title={author.handle}>
              {author.handle}
            </div>
          </div>
          <div className="ml-auto text-[#3BA9EE]" aria-hidden="true">
            𝕏
          </div>
        </div>
        <p className="mt-3 line-clamp-6 text-sm leading-6 text-zinc-300">{cleanedText}</p>
      </article>
    </Link>
  );
}
