import React from 'react';
import {fetchData} from "@/lib/api";
import DynamicComponent from "@/components/ServerDynamicComponent";
import {useLocale} from "next-intl";
import {unstable_setRequestLocale} from "next-intl/server";

export const revalidate = 3600;

export async function generateMetadata({params: {locale}},parent){
    unstable_setRequestLocale(locale);
    const result = await fetchData(`/services/index`, {version: 'draft', language: locale});
    const content = result?.data?.story?.content;
    return{
        title: content?.metaTitle,
        description: content?.metaDescription,
        alternates: {
            canonical: './',
            languages: {
                'ru-RU': 'https://www.glgconsult.com/ru/services',
                'en-EN': 'https://www.glgconsult.com/en/services',
                'id-ID': 'https://www.glgconsult.com/id/services',
            },
        },
        openGraph:{
            siteName: "GLG Consult",
            title: content?.metaTitle,
            description: content?.metaDescription,
            images:[
                {
                    url: content?.metaImage?.filename,
                    alt: content?.metaImageAlt,
                }
            ],
        },
    }
}

export default async function Page({params: {locale}}) {
    unstable_setRequestLocale(locale);
    const result = await fetchData(`/services/index`, {version: 'draft', language: locale});
    const data = result?.data;
    return (
        <DynamicComponent blok={data?.story.content} />
    );
}
