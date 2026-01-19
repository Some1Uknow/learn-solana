"use client";

import Script from "next/script";

/**
 * SEO Structured Data Components
 * Provides JSON-LD schema markup for better search engine understanding
 */

// Base site URL - MUST use www version for canonical consistency
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.learnsol.site";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * BreadcrumbList Schema
 * Helps search engines understand site hierarchy and enables breadcrumb rich snippets
 */
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  image?: string;
  keywords?: string[];
}

/**
 * Article Schema
 * For blog posts, tutorials, and educational content
 */
export function ArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author = "learn.sol Team",
  image,
  keywords,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    author: {
      "@type": "Organization",
      name: author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "learn.sol",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/opengraph-image.png`,
      },
    },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
      },
    }),
    ...(keywords && keywords.length > 0 && { keywords: keywords.join(", ") }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    },
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface LearningResourceSchemaProps {
  title: string;
  description: string;
  url: string;
  educationalLevel?: string;
  learningResourceType?: string;
  teaches?: string[];
  timeRequired?: string;
  keywords?: string[];
}

/**
 * LearningResource Schema
 * For educational content like courses, tutorials, and lessons
 */
export function LearningResourceSchema({
  title,
  description,
  url,
  educationalLevel = "Beginner to Advanced",
  learningResourceType = "Tutorial",
  teaches,
  timeRequired,
  keywords,
}: LearningResourceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: title,
    description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    educationalLevel,
    learningResourceType,
    inLanguage: "en",
    isAccessibleForFree: true,
    provider: {
      "@type": "EducationalOrganization",
      name: "learn.sol",
      url: SITE_URL,
    },
    ...(teaches && teaches.length > 0 && { teaches }),
    ...(timeRequired && { timeRequired }),
    ...(keywords && keywords.length > 0 && { keywords: keywords.join(", ") }),
  };

  return (
    <Script
      id="learning-resource-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

export interface HowToSchemaProps {
  title: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  image?: string;
}

/**
 * HowTo Schema
 * For step-by-step tutorials and guides
 */
export function HowToSchema({
  title,
  description,
  steps,
  totalTime,
  image,
}: HowToSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    ...(totalTime && { totalTime }),
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
      },
    }),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url.startsWith("http") ? step.url : `${SITE_URL}${step.url}` }),
      ...(step.image && {
        image: {
          "@type": "ImageObject",
          url: step.image.startsWith("http") ? step.image : `${SITE_URL}${step.image}`,
        },
      }),
    })),
  };

  return (
    <Script
      id="howto-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * FAQ Schema
 * For frequently asked questions sections
 */
export function FAQSchema({ items }: { items: FAQItem[] }) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface CourseModuleSchemaProps {
  courseName: string;
  moduleTitle: string;
  moduleDescription: string;
  moduleUrl: string;
  position: number;
  totalModules: number;
}

/**
 * Course Module Schema
 * For individual course modules/lessons
 */
export function CourseModuleSchema({
  courseName,
  moduleTitle,
  moduleDescription,
  moduleUrl,
  position,
  totalModules,
}: CourseModuleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: moduleTitle,
    description: moduleDescription,
    url: moduleUrl.startsWith("http") ? moduleUrl : `${SITE_URL}${moduleUrl}`,
    provider: {
      "@type": "EducationalOrganization",
      name: "learn.sol",
      url: SITE_URL,
    },
    isPartOf: {
      "@type": "Course",
      name: courseName,
      url: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT2H",
    },
    position,
    numberOfItems: totalModules,
    isAccessibleForFree: true,
    inLanguage: "en",
  };

  return (
    <Script
      id="course-module-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Software Application Schema
 * For tools and applications
 */
export function SoftwareApplicationSchema({
  name,
  description,
  url,
  category = "DeveloperApplication",
  operatingSystem = "Web",
}: {
  name: string;
  description: string;
  url: string;
  category?: string;
  operatingSystem?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    applicationCategory: category,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <Script
      id="software-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
