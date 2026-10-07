"use client";

import dynamic from "next/dynamic";

const NeuralField = dynamic(
  () => import("@/components/sections/neural-field").then((mod) => mod.NeuralField),
  { ssr: false },
);

const ParticlePortrait = dynamic(
  () => import("@/components/sections/particle-portrait").then((mod) => mod.ParticlePortrait),
  { ssr: false },
);

export function NeuralSlot() {
  return <NeuralField />;
}

export function PortraitSlot() {
  return <ParticlePortrait />;
}
