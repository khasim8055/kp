"use client";

import { useEffect } from "react";
import { JetBrains_Mono, Newsreader } from "next/font/google";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  preload: false,
});

export function SecondaryFonts() {
  useEffect(() => {
    document.documentElement.classList.add(jetbrains.variable, newsreader.variable);
  }, []);

  return null;
}
