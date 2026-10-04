"use client";

import dynamic from "next/dynamic";

const SecondaryFonts = dynamic(
  () =>
    import("@/components/providers/secondary-fonts").then(
      (mod) => mod.SecondaryFonts,
    ),
  { ssr: false },
);

export function FontLoader() {
  return <SecondaryFonts />;
}
