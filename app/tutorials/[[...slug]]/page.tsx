import { tutorialsSource } from "@/lib/tutorials/source";
import { DocsBody, DocsPage, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import { createCanonical, siteUrl, defaultOpenGraphImage, defaultTwitterImage } from "@/lib/seo";
import type { Metadata } from "next";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;

  const page = tutorialsSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
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

  return {
    title: page.data.title,
    description: page.data.description,
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

