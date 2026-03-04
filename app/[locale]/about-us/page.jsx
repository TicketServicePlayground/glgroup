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
    const {data} = await fetchData("about-us", {version: 'draft', language: locale});
    //console.log(data.story.content);
    return{
        title: data.story.content.metaTitle,
        description: data.story.content.metaDescription,
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
export default async function Page({params: {locale}}){
    unstable_setRequestLocale(locale);
    const {data} = await fetchData("about-us", {version: 'draft', language: locale});
    //console.log(data);

    return (
        <>
            <DynamicComponent blok={data?.story.content}  />
        </>
    );
};