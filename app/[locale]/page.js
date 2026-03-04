import Image from "next/image";
import DynamicComponent from "@/components/ServerDynamicComponent";
import {fetchData} from "@/lib/api";
import {unstable_setRequestLocale} from "next-intl/server";
import {useLocale} from "next-intl";
import Organization from "@/components/JSON-LD/Organization";

export const revalidate = 3600;

export async function generateMetadata({params},parent){
    const locale = params.locale;
    unstable_setRequestLocale(locale);
    // let locale = params.locale;
    // unstable_setRequestLocale(locale);
    const {data} = await fetchData("index", {version: 'draft', language: locale});
    return{
        title: data.story.content.metaTitle,
        description: data.story.content.metaDescription,
        alternates: {
            canonical: './',
            languages: {
                'ru_RU': 'https://www.glgconsult.com/ru',
                'en_EN': 'https://www.glgconsult.com/en',
            },
        },
        openGraph:{
            siteName: "GLG Consult",
            title: data.story.content.metaTitle,
            description: data.story.content.metaDescription,
            images:[
                {
                    url: data.story.content?.metaImage?.filename,
                    alt: data.story.content.metaImageAlt,
                }
            ],
        },
    }
}
export default async function Home({params}) {
    const locale = params.locale;
    unstable_setRequestLocale(locale);
    const {data} = await fetchData("index", {version: 'draft', language: locale});
    return (
        <>
            <Organization />
            <DynamicComponent blok={data?.story.content}  />
        </>

    );
}
