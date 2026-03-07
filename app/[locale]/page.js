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
    const result = await fetchData("index", {version: 'draft', language: locale});
    const content = result?.data?.story?.content;
    return{
        title: content?.metaTitle,
        description: content?.metaDescription,
        alternates: {
            canonical: './',
            languages: {
                'ru_RU': 'https://www.glgconsult.com/ru',
                'en_EN': 'https://www.glgconsult.com/en',
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
export default async function Home({params}) {
    const locale = params.locale;
    unstable_setRequestLocale(locale);
    const result = await fetchData("index", {version: 'draft', language: locale});
    const data = result?.data;
    return (
        <>
            <Organization />
            <DynamicComponent blok={data?.story.content}  />
        </>

    );
}
