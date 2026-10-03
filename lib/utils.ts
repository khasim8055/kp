import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isPlaceholderUrl(url: string) {
  return url.startsWith("TODO");
}

export function isTodo(value: string | number) {
  return typeof value === "string" && value.startsWith("TODO_");
}
