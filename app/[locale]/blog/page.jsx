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

export async function generateMetadata({params: {locale}},parent){
    if(locale === 'ru'){
        return{
            title: "Блог",
            description: "",
            alternates: {
                canonical: './',
                languages: {
                    'ru-RU': 'https://www.glgconsult.com/ru/blog',
                    'en-EN': 'https://www.glgconsult.com/en/blog',
                },
            },
            openGraph:{
                siteName: "GLG Consult",
                title: "Блог",
                description: "",
                // images:[
                //     {
                //         url: data.story.content?.metaImage?.filename,
                //         alt: data.story.content?.metaImageAlt,
                //     }
                // ],
            },
        }
    }else{
        return{
            title: "Blog",
            description: "",
            alternates: {
                canonical: './',
                languages: {
                    'ru_RU': 'https://www.glgconsult.com/ru/blog',
                    'en_EN': 'https://www.glgconsult.com/en/blog',
                },
            },
            openGraph:{
                siteName: "GLG Consult",
                title: "Blog",
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

export async function getPosts(locale){
    let sbParams = {
        version: "published",
        starts_with: 'blog/',
        page: 1,
        language: locale,
        per_page: 9
    }
    let fetch = await fetchData('', sbParams);

    return  fetch;
}

export default async function Page ({params: {locale}}){
    unstable_setRequestLocale(locale);
    const fetch = await getPosts(locale);
    const posts = fetch?.data?.stories ?? [];
    const category = await getCategory(locale);
    const blogResult = await fetchData('blog/index', {version: 'draft', language: locale});
    const data = blogResult?.data;


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
                cached_url: '/ru/blog/',
            },
            label: 'Блог',
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
                cached_url: '/en/blog/',
            },
            label: 'Blog',
            _uid: '2'
        }
    ]
    return (
        <>
            <Breadcrumbs links={locale === 'ru' ? breadcrumbs : breadcrumbsEn}/>

            <section>
                <div className="container pb-24">
                    <h1 className={'mb-5'}>{locale === 'ru' ? 'Блог' : 'Blog'}</h1>
                    <div className={'flex flex-col-reverse gap-4 md:flex-row md:gap-0 md:justify-start mb-3'}>

                    {/*</div>*/}
                    {/*<div className={'flex gap-4'}>*/}
                        <AllCategroyes blok={category.data.datasource_entries} locale={locale}/>
                        <SearchBar locale={locale}/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-11 gap-x-8 mb-8">
                        {posts && posts.map((e, _uid) => (
                            <PosePreview blok={e} key={_uid} locale={locale}/>
                        ))}
                    </div>
                    <LazyLoadBlog count={fetch.total} locale={locale}/>
                </div>
            </section>
            <DynamicComponent blok={data?.story.content} />
        </>


    );
};

