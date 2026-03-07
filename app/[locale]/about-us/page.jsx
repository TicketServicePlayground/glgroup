import React from 'react';
import {fetchData} from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import AuthorPage from "@/components/AutohorPage/AuthorPage";
import DynamicComponent from "@/components/ServerDynamicComponent";
import {unstable_setRequestLocale} from "next-intl/server";
import {console} from "next/dist/compiled/@edge-runtime/primitives";

export const revalidate = 3600;
export async function generateMetadata({params},parent){
    const locale = params.locale;
    unstable_setRequestLocale(locale);
    const result = await fetchData("about-us", {version: 'draft', language: locale});
    const content = result?.data?.story?.content;
    return{
        title: content?.metaTitle,
        description: content?.metaDescription,
        alternates: {
            canonical: './',
            languages: {
                'ru-RU': 'https://www.glgconsult.com/ru/about-us',
                'en-EN': 'https://www.glgconsult.com/en/about-us',
                'id-ID': 'https://www.glgconsult.com/id/about-us',
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
export default async function Page({params: {locale}}){
    unstable_setRequestLocale(locale);
    const result = await fetchData("about-us", {version: 'draft', language: locale});
    const data = result?.data;

    return (
        <>
            <DynamicComponent blok={data?.story.content}  />
        </>
    );
};