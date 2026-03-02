import { source, getPageImage } from "@/lib/source";
import { DocsBody, DocsPage, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import { PageFooter, PageTOC, PageTOCItems } from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import { createCanonical, siteUrl } from "@/lib/seo";
import type { Metadata } from "next";
import { BreadcrumbSchema, LearningResourceSchema } from "@/components/seo";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

function toTitleCase(input: string) {
  return input
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

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

  const lessonChip = slugParts.length > 0
    ? slugParts
      .slice(0, 2)
      .map((part) => toTitleCase(part))
      .join(" • ")
    : "Curriculum";

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
      
      <DocsPage
        toc={page.data.toc}
        full={page.data.full}
        breadcrumb={{ enabled: false }}
        footer={{ component: <PageFooter className="ls-docs-footer-nav" /> }}
        tableOfContent={{
          component: (
            <PageTOC className="ls-docs-toc-rail">
              <h5 className="ls-docs-toc-heading">On this page</h5>
              <PageTOCItems />
            </PageTOC>
          ),
        }}
      >
        <header className="ls-docs-hero">
          <nav className="ls-docs-breadcrumb" aria-label="Breadcrumb">
            <Link href="/learn">Curriculum</Link>
            {slugParts.slice(0, -1).map((part, index) => {
              const href = `/learn/${slugParts.slice(0, index + 1).join("/")}`;
              return (
                <span key={href} className="ls-docs-breadcrumb-item">
                  <ChevronRight className="size-3.5" aria-hidden />
                  <Link href={href}>{toTitleCase(part)}</Link>
                </span>
              );
            })}
            <span className="ls-docs-breadcrumb-item" aria-current="page">
              <ChevronRight className="size-3.5" aria-hidden />
              <span>{page.data.title}</span>
            </span>
          </nav>
          <div className="ls-docs-lesson-chip">{lessonChip}</div>
          <DocsTitle className="ls-docs-title">{page.data.title}</DocsTitle>
          <DocsDescription className="ls-docs-description">
            {page.data.description}
          </DocsDescription>
        </header>
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
