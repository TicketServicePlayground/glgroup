import React from 'react';
import {fetchData} from "@/lib/api";
import DynamicComponent from "@/components/ServerDynamicComponent";
import {useLocale} from "next-intl";
import {unstable_setRequestLocale} from "next-intl/server";

export const revalidate = 3600;

export async function generateMetadata({params: {locale}},parent){
    unstable_setRequestLocale(locale);
    const {data} = await fetchData(`/services/index`, {version: 'draft', language: locale});
    return{
        title: data.story.content.metaTitle,
        description: data.story.content.metaDescription,
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
            title: data.story.content.metaTitle,
            description: data.story.content.metaDescription,
            images:[
                {
                    url: data.story.content?.metaImage?.filename,
                    alt: data.story.content?.metaImageAlt,
                }
            ],
        },
    }
}

export default async function Page({params: {locale}}) {
    unstable_setRequestLocale(locale);
    const {data} = await fetchData(`/services/index`, {version: 'draft', language: locale});
    return (
        <DynamicComponent blok={data?.story.content} />
    );
}
