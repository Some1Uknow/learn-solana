import { tutorialsSource } from "@/lib/tutorials/source";
import { DocsBody, DocsPage, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import { createCanonical, siteUrl, defaultOpenGraphImage, defaultTwitterImage } from "@/lib/seo";
import type { Metadata } from "next";
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;

  const page = tutorialsSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  
  // Build breadcrumb items for structured data
  const slugParts = params.slug || [];
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Tutorials", url: "/tutorials" },
  ];
  
  // Add current page
  if (slugParts.length > 0) {
    breadcrumbItems.push({
      name: page.data.title,
      url: `/tutorials/${slugParts.join("/")}`,
    });
  }

  // Extract keywords for structured data
  const keywords = (page.data as unknown as Record<string, unknown>).keywords as string[] | undefined;

  return (
    <>
      {/* Structured Data for SEO */}
      <BreadcrumbSchema items={breadcrumbItems} />
      <ArticleSchema
        title={page.data.title}
        description={page.data.description || ""}
        url={`/tutorials/${slugParts.join("/")}`}
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
  return tutorialsSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = tutorialsSource.getPage(params.slug);
  if (!page) notFound();

  const slugPath = params.slug?.join('/') ?? '';
  const canonical = createCanonical(`/tutorials${slugPath ? `/${slugPath}` : ''}`);

  // Extract keywords from frontmatter if available
  const frontmatterKeywords = (page.data as unknown as Record<string, unknown>).keywords as string[] | undefined;
  
  // Generate contextual keywords based on tutorial content
  const baseKeywords = [
    "solana tutorial",
    "solana development",
    "blockchain tutorial",
    "web3 development",
  ];
  
  const keywords = frontmatterKeywords || baseKeywords;

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
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: [defaultTwitterImage],
    },
  };
}

