import { source, getPageImage } from "@/lib/source";
import { DocsBody, DocsPage, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import { createCanonical, siteUrl } from "@/lib/seo";
import type { Metadata } from "next";
import { BreadcrumbSchema, LearningResourceSchema } from "@/components/seo";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;

  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  
  // Build breadcrumb items for structured data
  const slugParts = params.slug || [];
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Learn", url: "/learn" },
  ];
  
  // Add intermediate paths (e.g., week-1)
  let currentPath = "/learn";
  for (let i = 0; i < slugParts.length - 1; i++) {
    currentPath += `/${slugParts[i]}`;
    const partName = slugParts[i].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    breadcrumbItems.push({ name: partName, url: currentPath });
  }
  
  // Add current page
  if (slugParts.length > 0) {
    breadcrumbItems.push({
      name: page.data.title,
      url: `/learn/${slugParts.join("/")}`,
    });
  }

  // Extract keywords for structured data
  const keywords = (page.data as unknown as Record<string, unknown>).keywords as string[] | undefined;

  return (
    <>
      {/* Structured Data for SEO */}
      <BreadcrumbSchema items={breadcrumbItems} />
      <LearningResourceSchema
        title={page.data.title}
        description={page.data.description || ""}
        url={`/learn/${slugParts.join("/")}`}
        educationalLevel="Beginner to Advanced"
        learningResourceType="Lesson"
        teaches={keywords}
        keywords={keywords}
      />
      
      <DocsPage toc={page.data.toc} full={page.data.full}>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <MDX components={getMDXComponents()} />
        </DocsBody>
      </DocsPage>
    </>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const slugPath = params.slug?.join('/') ?? '';
  const canonical = createCanonical(`/learn${slugPath ? `/${slugPath}` : ''}`);
  const ogImage = getPageImage(page);

  // Extract keywords from frontmatter if available
  const keywords = (page.data as unknown as Record<string, unknown>).keywords as string[] | undefined;

  return {
    title: page.data.title,
    description: page.data.description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: canonical,
      siteName: "learn.sol",
      locale: "en_US",
      type: "article",
      images: [
        {
          url: `${siteUrl}${ogImage.url}`,
          width: 1200,
          height: 630,
          alt: page.data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: [`${siteUrl}${ogImage.url}`],
    },
  };
}

