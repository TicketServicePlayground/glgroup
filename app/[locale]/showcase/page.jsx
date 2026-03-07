import React from 'react';
import {storyblokEditable} from "@/lib/storyblokCompat";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import DynamicComponent from "@/components/ServerDynamicComponent";
import PosePreview from "@/components/PostPreview/PosePreview";
import LazyLoadBlog from "@/components/LazyLoadBlog/LazyLoadBlog";
import {getCategory} from "@/lib/category";
import AllCategroyes from "@/components/AllCategoryes/AllCategroyes";
import {fetchBlog} from "@/lib/blog";
import {console} from "next/dist/compiled/@edge-runtime/primitives";
import {unstable_setRequestLocale} from "next-intl/server";
import {fetchData} from "@/lib/api";
import SearchBar from "@/components/SearchBar/SearchBar";

export const revalidate = 3600;

export async function generateMetadata({params: {locale}}, parent) {

    const data = fetchData('showcase/index', {version: 'draft', language: locale})
    if (locale === 'ru') {
        return {
            title: "Готовые бизнесы",
            description: "",
            alternates: {
                canonical: './',
                languages: {
                    'ru-RU': 'https://www.glgconsult.com/ru/showcase',
                    'en-EN': 'https://www.glgconsult.com/en/showcase',
                    'id-ID': 'https://www.glgconsult.com/id/showcase',
                },
            },
            openGraph: {
                siteName: "GLG Consult",
                title: "Готовые бизнесы",
                description: "",
                // images:[
                //     {
                //         url: data.story.content?.metaImage?.filename,
                //         alt: data.story.content?.metaImageAlt,
                //     }
                // ],
            },
        }
    } else {
        return {
            title: "Ready-made businesses",
            description: "",
            alternates: {
                canonical: './',
                languages: {
                    'ru-RU': 'https://www.glgconsult.com/ru/showcase',
                    'en-EN': 'https://www.glgconsult.com/en/showcase',
                    'id-ID': 'https://www.glgconsult.com/id/showcase',
                },
            },
            openGraph: {
                siteName: "GLG Consult",
                title: "Ready-made businesses",
                description: "",
                // images:[
                //     {
                //         url: data.story.content?.metaImage.filename,
                //         alt: data.story.content?.metaImageAlt,
                //     }
                // ],
            },
        }
    }

}

export async function getPosts(locale) {
    let sbParams = {
        version: "published",
        //version: 'draft',
        starts_with: 'showcase/',
        page: 1,
        language: locale,
        per_page: 8,
        filter_query: {
            // title:{
            //     not_in: title,
            // },
            active: {
                is: true,
            }
        }
    }
    let fetch = await fetchData('', sbParams);

    return fetch;
}

export default async function Page({params: {locale}}) {
    unstable_setRequestLocale(locale);
    const showcaseResult = await fetchData('showcase/index', {version: 'draft', language: locale});
    const data = showcaseResult?.data;
    const fetch = await getPosts(locale);
    const posts = fetch?.data?.stories ?? [];
    const category = await getCategory(locale);


    const breadcrumbs = [
        {
            link: {
                linktype: '',
                cached_url: '/ru/',
            },
            label: 'Главная',
            _uid: '1'
        },
        {
            link: {
                linktype: '',
                cached_url: '/ru/showcase/',
            },
            label: 'Готовые бизнесы',
            _uid: '2'
        }
    ]

    const breadcrumbsEn = [
        {
            link: {
                linktype: '',
                cached_url: '/en/',
            },
            label: 'Home',
            _uid: '1'
        },
        {
            link: {
                linktype: '',
                cached_url: '/en/showcase/',
            },
            label: 'Ready-made businesses',
            _uid: '2'
        }
    ]
    return (
        <>
            <Breadcrumbs links={locale === 'ru' ? breadcrumbs : breadcrumbsEn}/>

            <section>
                <div className="container pb-24">
                    <h1 className={'mb-5'}>{locale === 'ru' ? 'Готовые бизнесы' : 'Ready-made businesses'}</h1>
                    {/*<div className={'flex flex-col-reverse gap-4 md:flex-row md:gap-0 md:justify-start mb-6'}>*/}

                    {/*    /!*</div>*!/*/}
                    {/*    /!*<div className={'flex gap-4'}>*!/*/}
                    {/*    /!*<AllCategroyes blok={category.data.datasource_entries} locale={locale}/>*!/*/}
                    {/*    <SearchBar locale={locale}/>*/}
                    {/*</div>*/}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-11 gap-x-8 mb-8">
                        {posts && posts.map((e, _uid) => (
                            <PosePreview blok={e} key={_uid} locale={locale}/>
                        ))}
                    </div>
                    {/*<LazyLoadBlog count={fetch.total} locale={locale}/>*/}
                </div>
            </section>
            <DynamicComponent blok={data?.story.content}/>
        </>


    );
};

