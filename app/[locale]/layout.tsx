import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BackToTop } from "@/components/ui/back-to-top";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { routing } from "@/i18n/routing";
import { resolveLocale } from "@/lib/locale";
import { siteUrl } from "@/lib/site";
import "../globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
  preload: false,
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
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
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
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ScrollProgress />
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-border focus:bg-background focus:px-3 focus:py-2"
            >
              {t("skip")}
            </a>
            <SiteHeader />
            <main id="main" tabIndex={-1} className="flex-1">
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
