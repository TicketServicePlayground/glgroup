import React from 'react';
import {fetchData} from "@/lib/api";
import DynamicComponent from "@/components/ServerDynamicComponent";
import {storyblokEditable} from "@/lib/storyblokCompat";
import Breadcrumbs from "/components/Breadcrumbs/Breadcrumbs";
import {notFound} from "next/navigation";
import {unstable_setRequestLocale} from "next-intl/server";
import {console} from "next/dist/compiled/@edge-runtime/primitives";
export const revalidate = 3600;


export async function generateMetadata({params, params: {locale}},parent){
    unstable_setRequestLocale(locale);
    const res = await fetchData(`rules/${params.slug}`, {version: 'draft', language: locale});

    if(!res){
        return {
            title: "Page not found",
            description: "Page not found",
        }
    }else{
        const {data} = res
        //console.log(data.story.slug);
        return{
            title: data.story.content.metaTitle,
            description: data.story.content.metaDescription,
            alternates: {
                canonical: './',
                languages: {
                    'ru-RU': 'https://www.glgconsult.com/ru/'+data.story.slug,
                    'en-EN': 'https://www.glgconsult.com/en/'+data.story.slug,
                    'id-ID': 'https://www.glgconsult.com/id/'+data.story.slug,
                },
            },
            openGraph:{
                title: data.story.content.metaTitle,
                description: data.story.content.metaDescription,
                siteName: "GLG Consult",
                images:[
                    {
                        url: data.story.content?.metaImage?.filename,
                        alt: data.story.content?.metaImageAlt,
                    }
                ],
            },
        }
    }

}
export default async function Page({params, params: {locale}}) {
    unstable_setRequestLocale(locale);
    const res = await fetchData(`rules/${params.slug}`, {version: 'draft', language: locale});
    if(!res){
        notFound();
    }

    const {data} = res
    return (
        <>
            <Breadcrumbs links={data?.story.content.breadcrumbs}/>
            <DynamicComponent blok={data?.story.content}  />
        </>

    );

};

