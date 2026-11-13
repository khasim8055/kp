import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** Pages that were removed. Old links land on the closest living page. */
const retired = [
  { from: "/learning", to: "/papers" },
  { from: "/learning/:slug", to: "/papers" },
  { from: "/papers/react-2022", to: "/papers" },
  { from: "/papers/reflexion-2023", to: "/papers" },
];

const nextConfig: NextConfig = {
  experimental: {
    // English pages have no /en prefix, so the proxy rewrites /papers to
    // /en/papers. Client-side route prediction does not know about that
    // rewrite and guesses /papers is /[locale] with locale "papers", which
    // makes every prefetch of an unprefixed link return 404. Turning the
    // prediction off makes the client ask the server for the real route tree.
    optimisticRouting: false,
  },
  async redirects() {
    return retired.flatMap(({ from, to }) => [
      { source: from, destination: to, permanent: false },
      {
        source: `/:locale(en|de)${from}`,
        destination: `/:locale${to}`,
        permanent: false,
      },
    ]);
  },
};

export default withNextIntl(nextConfig);
