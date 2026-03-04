import React from 'react';
import { fetchData } from "@/lib/api";
import DynamicComponent from "@/components/ServerDynamicComponent";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Service from "@/components/JSON-LD/Service";
import ServicesListComponent from "@/components/ServicesList/ServicesList";
import OurRecommendationsComponent from "@/components/OurRecomendations/OurRecomendations";

export const revalidate = 3600;

export async function generateMetadata({ params, params: { locale } }, parent) {
    unstable_setRequestLocale(locale);
    const res = await fetchData(`/currency-converter/${params.slug}`, { version: 'draft', language: locale });

    if (!res) {
        return {
            title: "Page not found",
            description: "Page not found",
        };
    } else {
        const { data } = res;
        return {
            title: data.story.content.metaTitle,
            description: data.story.content.metaDescription,
            alternates: {
                canonical: './',
                languages: {
                    'ru_RU': 'https://www.glgconsult.com/ru/currency-converter' + data.story.slug,
                    'en_EN': 'https://www.glgconsult.com/en/currency-converter' + data.story.slug,
                },
            },
            openGraph: {
                siteName: "GLG Consult",
                title: data.story.content.metaTitle,
                description: data.story.content.metaDescription,
                images: [
                    {
                        url: data.story.content?.metaImage?.filename,
                        alt: data.story.content?.metaImageAlt,
                    }
                ],
            },
        };
    }
}

export default async function Page({ params, params: { locale } }) {
    unstable_setRequestLocale(locale);
    const res = await fetchData(`/currency-converter/${params.slug}`, { version: 'draft', language: locale });
    if (!res) notFound();

    const { data } = res;

    const servicesData = await fetchData("currency-converter/index", { version: "draft", language: locale });
    const servicesListBlock = servicesData.data.story.content.body.find(blok => blok.component === 'ServicesList');
    const ourRecommendationsBlock = servicesData.data.story.content.body.find(blok => blok.component === 'ourRecomendations');

    return (
        <>
            <Service into={data} lang={locale} />

            {data?.story.content.body?.map((blok, index) => (
                <React.Fragment key={blok._uid}>
                    <DynamicComponent blok={blok} />

                    {/* Вставка після другого блоку (index === 1) */}
                    {index === 1 && servicesListBlock && (
                        <ServicesListComponent blok={servicesListBlock} />
                    )}
                    {index === 1 && ourRecommendationsBlock && (
                        <OurRecommendationsComponent blok={ourRecommendationsBlock} />
                    )}
                </React.Fragment>
            ))}
        </>
    );
}
