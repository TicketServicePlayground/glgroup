import React from 'react';
import {fetchData} from "@/lib/api";
import DynamicComponent from "@/components/ServerDynamicComponent";
import {storyblokEditable} from "@/lib/storyblokCompat";
import Breadcrumbs from "/components/Breadcrumbs/Breadcrumbs";
import {unstable_setRequestLocale} from "next-intl/server";
import Organization from "@/components/JSON-LD/Organization";
export const revalidate = 3600;


export async function generateMetadata({params: {locale}}, parent){
    unstable_setRequestLocale(locale);
    const {data} = await fetchData("contacts", {version: 'draft', language: locale});
    return{
        title: data.story.content.metaTitle,
        description: data.story.content.metaDescription,
        alternates: {
            canonical: './',
            languages: {
                'ru-RU': 'https://www.glgconsult.com/ru/contacts',
                'en-EN': 'https://www.glgconsult.com/en/contacts',
                'id-ID': 'https://www.glgconsult.com/id/contacts',
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
    const {data} = await fetchData("contacts", {version: 'draft', language: locale});
    return (
        <>
            <Organization />
            <Breadcrumbs links={data?.story.content.breadcrumbs}/>
            <DynamicComponent blok={data?.story.content}  />
        </>

    );
};

