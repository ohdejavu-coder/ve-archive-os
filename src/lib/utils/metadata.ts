import type { Metadata } from "next";

interface MetadataParams {
  title: string;
  description: string;
  ogImage?: string;
  /** e.g. "/photographer" — canonical URL path */
  path?: string;
}

const SITE_NAME = "VE Archive OS";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vearchive.com";

/**
 * Generates consistent SEO metadata for any page.
 */
export function createMetadata({
  title,
  description,
  ogImage = "/media/brand/og-image.jpg",
  path = "",
}: MetadataParams): Metadata {
  const url = `${BASE_URL}${path}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: "zh_CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}
