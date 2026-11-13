import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BackToTop } from "@/components/ui/back-to-top";
import { Effects } from "@/components/ui/effects";
import { World } from "@/components/world/world";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { routing } from "@/i18n/routing";
import { resolveLocale } from "@/lib/locale";
import { siteUrl } from "@/lib/site";
import "../globals.css";

// Inter (body) and Space Grotesk (the page headline) are preloaded and use a
// metric-matched fallback, so text does not jump when the web font arrives.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space",
  display: "swap",
});

// Small labels only, so it is not preloaded.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

// The serif question is the second line of every hero, so it is preloaded too.
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: t("title"),
      template: `%s · ${t("title")}`,
    },
    description: t("description"),
    authors: [{ name: t("title"), url: siteUrl() }],
    creator: t("title"),
    openGraph: {
      siteName: t("title"),
      title: t("title"),
      description: t("description"),
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      types: { "application/rss+xml": "/rss.xml" },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const t = await getTranslations("Nav");

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${space.variable} ${jetbrains.variable} ${instrument.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <World />
            <Effects />
            <ScrollProgress />
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-border focus:bg-background focus:px-3 focus:py-2"
            >
              {t("skip")}
            </a>
            <SiteHeader />
            <main id="main" tabIndex={-1} className="flex-1 pt-20">
              {children}
            </main>
            <SiteFooter />
            <BackToTop />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
