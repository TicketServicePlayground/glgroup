import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import ServerDynamicComponent from "@/components/ServerDynamicComponent";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { previewStore } from "@/lib/previewStore";
import { fetchData } from "@/lib/api";
import { getCategory } from "@/lib/category";
import AllCategroyes from "@/components/AllCategoryes/AllCategroyes";
import PosePreview from "@/components/PostPreview/PosePreview";
import SearchBar from "@/components/SearchBar/SearchBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function BlogPreview({ content, locale }) {
  const fetchResult = await fetchData('', {
    version: 'published',
    starts_with: 'blog/',
    page: 1,
    language: locale,
    per_page: 9,
  });
  const posts = fetchResult?.data?.stories ?? [];
  const category = await getCategory(locale);

  const breadcrumbs = locale === 'ru'
    ? [
        { link: { linktype: '', cached_url: '/ru/' }, label: 'Главная', _uid: '1' },
        { link: { linktype: '', cached_url: '/ru/blog/' }, label: 'Блог', _uid: '2' },
      ]
    : [
        { link: { linktype: '', cached_url: '/en/' }, label: 'Home', _uid: '1' },
        { link: { linktype: '', cached_url: '/en/blog/' }, label: 'Blog', _uid: '2' },
      ];

  return (
    <>
      <Breadcrumbs links={breadcrumbs} />
      <section>
        <div className="container pb-24">
          <h1 className="mb-5">{locale === 'ru' ? 'Блог' : 'Blog'}</h1>
          <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-0 md:justify-start mb-3">
            {category?.data?.datasource_entries && (
              <AllCategroyes blok={category.data.datasource_entries} locale={locale} />
            )}
            <SearchBar locale={locale} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-11 gap-x-8 mb-8">
            {posts.map((e, idx) => (
              <PosePreview blok={e} key={idx} locale={locale} />
            ))}
          </div>
        </div>
      </section>
      <ServerDynamicComponent blok={content} />
    </>
  );
}

async function ShowcasePreview({ content, locale }) {
  const fetchResult = await fetchData('', {
    version: 'published',
    starts_with: 'showcase/',
    page: 1,
    language: locale,
    per_page: 8,
  });
  const posts = fetchResult?.data?.stories ?? [];

  const breadcrumbs = locale === 'ru'
    ? [
        { link: { linktype: '', cached_url: '/ru/' }, label: 'Главная', _uid: '1' },
        { link: { linktype: '', cached_url: '/ru/showcase/' }, label: 'Готовые бизнесы', _uid: '2' },
      ]
    : [
        { link: { linktype: '', cached_url: '/en/' }, label: 'Home', _uid: '1' },
        { link: { linktype: '', cached_url: '/en/showcase/' }, label: 'Ready-made businesses', _uid: '2' },
      ];

  return (
    <>
      <Breadcrumbs links={breadcrumbs} />
      <section>
        <div className="container pb-24">
          <h1 className="mb-5">{locale === 'ru' ? 'Готовые бизнесы' : 'Ready-made businesses'}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-11 gap-x-8 mb-8">
            {posts.map((e, idx) => (
              <PosePreview blok={e} key={idx} locale={locale} />
            ))}
          </div>
        </div>
      </section>
      <ServerDynamicComponent blok={content} />
    </>
  );
}

function GenericPreview({ content }) {
  return (
    <main>
      <Breadcrumbs links={content?.breadcrumbs} />
      <ServerDynamicComponent blok={content} />
    </main>
  );
}

export default async function PreviewPage({ params }) {
  const { locale, token } = params;
  unstable_setRequestLocale(locale);

  const preview = previewStore.get(token);
  if (!preview) {
    notFound();
  }

  const { content, slug } = preview;

  if (slug === 'blog/index') {
    return <BlogPreview content={content} locale={locale} />;
  }

  if (slug === 'showcase/index') {
    return <ShowcasePreview content={content} locale={locale} />;
  }

  return <GenericPreview content={content} />;
}
