import { NextRequest, NextResponse } from "next/server";
import { getTopicContent } from "@/lib/mdx-utils";
import { serialize } from 'next-mdx-remote/serialize';

export async function GET(request: NextRequest) {
  try {
    // Get moduleId and topicId from query parameters
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("moduleId");
    const topicId = searchParams.get("topicId");

    if (!moduleId || !topicId) {
      return NextResponse.json(
        { error: "Missing moduleId or topicId parameters" },
        { status: 400 }
      );
    }

    const contentData = await getTopicContent(moduleId, topicId);

    if (!contentData) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    // Serialize the MDX content server-side
    const serializedContent = await serialize(contentData.content);

    return NextResponse.json({
      frontMatter: contentData.frontMatter,
      serializedContent
    });
  } catch (error) {
    console.error("Error in MDX API:", error);
    return NextResponse.json(
      { error: "Failed to fetch MDX content" },
      { status: 500 }
    );
  }
}
