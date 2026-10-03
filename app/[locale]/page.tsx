import { HomePage } from "@/components/sections/home-page";
import { resolveLocale } from "@/lib/locale";

type Props = { params: Promise<{ locale: string }> };

export default async function Page({ params }: Props) {
  await resolveLocale(params);
  return <HomePage />;
}
