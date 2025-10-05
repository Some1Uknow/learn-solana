import { NextResponse } from "next/server";
import { getTweet } from "react-tweet/api";

import { TWEET_IDS } from "@/data/x-tweet-ids";

export const revalidate = 1800; // 30 minutes

type TweetAuthor = {
  name: string;
  handle: string;
  profileImageUrl?: string;
  verified: boolean;
  blueVerified: boolean;
};

type ApiTweet = {
  id: string;
  text: string;
  author: TweetAuthor;
  createdAt?: string;
  url: string;
};

const BASE_URL = "https://x.com";

export async function GET() {
  const ids = Array.from(new Set(TWEET_IDS.filter(Boolean)));

  if (ids.length === 0) {
    return NextResponse.json({ tweets: [], fetchedAt: new Date().toISOString() });
  }

  const tweets = (
    await Promise.all(
      ids.map(async (id) => {
        try {
          const tweet = await getTweet(id);

          if (!tweet) {
            return null;
          }

          const author = tweet.user;
          const idStr = tweet.id_str ?? id;
          const screenName = author?.screen_name ?? "i/web";

          const apiTweet: ApiTweet = {
            id: idStr,
            text: tweet.text ?? "",
            createdAt: tweet.created_at ?? undefined,
            url: `${BASE_URL}/${screenName}/status/${idStr}`,
            author: {
              name: author?.name ?? "",
              handle: author?.screen_name ? `@${author.screen_name}` : "",
              profileImageUrl: author?.profile_image_url_https ?? undefined,
              verified: Boolean(author?.verified),
              blueVerified: Boolean((author as { is_blue_verified?: boolean })?.is_blue_verified),
            },
          };

          return apiTweet;
        } catch (error) {
          console.error(`Failed to load tweet ${id}`, error);
          return null;
        }
      })
    )
  ).filter((tweet): tweet is ApiTweet => Boolean(tweet));

  return NextResponse.json(
    {
      tweets,
      count: tweets.length,
      fetchedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    }
  );
}
