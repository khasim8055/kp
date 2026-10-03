import {
  pageMetadata,
  PlaceholderPage,
} from "@/components/sections/placeholder-page";
import { resolveLocale } from "@/lib/locale";

type Props = { params: Promise<{ locale: string }> };

export function generateMetadata({ params }: Props) {
  return pageMetadata(params, "research");
}

export default async function ResearchPage({ params }: Props) {
  await resolveLocale(params);
  return <PlaceholderPage titleKey="research" />;
}
