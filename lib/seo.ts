import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

/** Path for a locale. English has no prefix, German lives under /de. */
export function localizedPath(locale: string, path = "") {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

/** Canonical URL plus hreflang alternates for one page. */
export function alternatesFor(
  locale: string,
  path = "",
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      ...Object.fromEntries(
        routing.locales.map((item) => [item, localizedPath(item, path)]),
      ),
      "x-default": localizedPath(routing.defaultLocale, path),
    },
  };
}

/** Title, description, canonical and social tags for one page. */
export function pageMeta({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: string;
  path: string;
  title?: string;
  description: string;
  /** Preview image path. Defaults to the site-wide one. */
  image?: { url: string; alt: string };
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: alternatesFor(locale, path),
    // A page that sets openGraph replaces the layout's whole openGraph object,
    // including the shared preview image, so everything is repeated here.
    openGraph: {
      siteName: profile.name,
      ...(title ? { title } : {}),
      description,
      url: localizedPath(locale, path),
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: image?.url ?? `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: image?.alt ?? profile.name,
        },
      ],
    },
  };
}

/** schema.org Person, rendered once on the home page. */
export function personJsonLd(description: string) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: base,
    description,
    jobTitle: profile.title,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "SRH University of Applied Sciences Berlin",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Lovely Professional University",
    },
    knowsAbout: [...profile.focus],
    knowsLanguage: ["en", "de", "hi"],
    sameAs: [profile.linkedin, profile.github],
  };
}

/** Serialise JSON-LD so a stray "<" can never close the script tag. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
