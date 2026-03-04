import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import ServerDynamicComponent from "@/components/ServerDynamicComponent";
import { previewStore } from "@/lib/previewStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PreviewPage({ params }) {
  const { locale, token } = params;
  unstable_setRequestLocale(locale);

  const preview = previewStore.get(token);
  if (!preview) {
    notFound();
  }

  const content = preview.content;

  return (
    <main>
      <ServerDynamicComponent blok={content} />
    </main>
  );
}
