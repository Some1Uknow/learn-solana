"use client";

import * as React from "react";
import Image from "next/image";
import { useTweet } from "react-tweet";
import { cn } from "@/lib/cn";
import { CheckCircle } from "lucide-react";

function SkeletonCard() {
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

function ErrorCard() {
  return (
    <div className="mx-2 w-[320px] md:w-[350px] shrink-0 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-zinc-400">
      Unable to load tweet.
    </div>
  );
}

export default function ClientTweetCard({ id, className }: { id: string; className?: string }) {
  const { data, error, isLoading } = useTweet(id);

  // Important: Always call hooks in the same order on every render.
  // Compute memoized text unconditionally and guard against undefined data.
  const cleanedText = React.useMemo(() => {
    // Remove a leading reply handle to @Some1UKnow25 if present
    // Example: "@Some1UKnow25 Thanks for..." -> "Thanks for..."
    return (data?.text || "").replace(/^@some1uknow25\b[:\s,.-]*/i, "").trimStart();
  }, [data?.text]);

  if (isLoading) return <SkeletonCard />;
  if (error || !data) return <ErrorCard />;

  const user = data.user;
  const handle = `@${user.screen_name}`;

  return (
    <article
      className={cn(
        "mx-2 w-[320px] md:w-[350px] shrink-0 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-white/90 backdrop-blur-sm",
        "shadow-[0_8px_30px_rgba(0,0,0,0.15)]",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10">
          <Image
            src={user.profile_image_url_https}
            alt={user.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="font-medium leading-tight text-white truncate flex items-center gap-1">
            {user.name}
            {(user.verified || user.is_blue_verified) && (
              <span className="text-blue-500" aria-label="Verified">
                <CheckCircle/>
              </span>
            )}
          </div>
          <div className="text-xs text-zinc-400 truncate">{handle}</div>
        </div>
        <div className="ml-auto text-[#3BA9EE]">𝕏</div>
      </div>
      <p className="mt-3 text-sm text-zinc-300 leading-6 line-clamp-6">{cleanedText}</p>
    </article>
  );
}
