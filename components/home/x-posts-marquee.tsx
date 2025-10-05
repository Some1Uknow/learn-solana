"use client";

import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/cn";
import { X_POSTS, type XPost } from "@/data/x-posts";
import ClientTweetCard from "./client-tweet-card";
import { TWEET_IDS } from "@/data/x-tweet-ids";

function PostCard({ p, className }: { p: XPost; className?: string }) {
  return (
    <article
      className={cn(
        "relative w-[320px] md:w-[380px] shrink-0 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-white/90 backdrop-blur-sm",
        "shadow-[0_8px_30px_rgba(0,0,0,0.15)]",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10">
          <Image src={p.avatar} alt={p.name} fill sizes="40px" className="object-contain" />
        </div>
        <div className="min-w-0">
          <div className="font-medium leading-tight text-white">{p.name}</div>
          <div className="text-xs text-zinc-400">{p.handle}</div>
        </div>
        <div className="ml-auto text-[#3BA9EE]">𝕏</div>
      </div>
      <p className="mt-3 text-sm text-zinc-300 leading-6">{p.content}</p>
    </article>
  );
}

export function XPostsMarquee() {
  return (
    <section className="container relative z-10 py-10 md:py-14">
      <div className="mb-6 text-center">
        <div className="text-xs tracking-[0.25em] text-zinc-400">[WHAT BUILDERS SAY]</div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">Best in the Community</h2>
      </div>

      <div className="[--gap:1.25rem]">
        {/* If you have real tweet IDs, render them; otherwise fallback to manual posts */}
        {/* Example: const tweetIds = ["184217132223", ...]; */}
        {(() => {
          const tweetIds: string[] = TWEET_IDS;
          if (Array.isArray(tweetIds) && tweetIds.length > 0) {
            return (
              <>
                <Marquee pauseOnHover className="[--duration:80s]">
                  {tweetIds.concat(tweetIds).map((id, i) => (
                    <ClientTweetCard key={i} id={id} />
                  ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="mt-4 [--duration:70s]">
                  {tweetIds.concat(tweetIds).map((id, i) => (
                    <ClientTweetCard key={`rev-${i}`} id={id} />
                  ))}
                </Marquee>
              </>
            );
          }
          return (
            <>
              <Marquee pauseOnHover className="[--duration:80s]">
                {X_POSTS.concat(X_POSTS).map((p, i) => (
                  <PostCard key={i} p={p} className="mx-2" />
                ))}
              </Marquee>
              <Marquee reverse pauseOnHover className="mt-4 [--duration:70s]">
                {X_POSTS.concat(X_POSTS).map((p, i) => (
                  <PostCard key={`rev-${i}`} p={p} className="mx-2" />
                ))}
              </Marquee>
            </>
          );
        })()}
      </div>
    </section>
  );
}

export default XPostsMarquee;
