import React from 'react';
import {storyblokEditable} from "@/lib/storyblokCompat";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PosePreview from "@/components/PostPreview/PosePreview";
import LazyLoadBlog from "@/components/LazyLoadBlog/LazyLoadBlog";
import {getCategory} from "@/lib/category";
import AllCategroyes from "@/components/AllCategoryes/AllCategroyes";
import {unstable_setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {fetchData} from "@/lib/api";
import SearchBar from "@/components/SearchBar/SearchBar";


export const revalidate = 3600;
export async function generateMetadata({params: {locale}},parent){
    if(locale === 'ru'){
        return{
            title: "Блог",
            description: "",
            alternates: {
                canonical: './'
            },
            openGraph:{
                siteName: "GLG Consult",
                title: "Блог",
                description: "",
                // images:[
                //     {
                //         url: data.story.content?.metaImage.filename,
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
                canonical: './'
            },
            openGraph:{
                siteName: "GLG Consult",
                title: "Blog",
                description: "",
                // images:[
                //     {
                //         url: data.story.content?.metaImage?.filename,
                //         alt: data.story.content?.metaImageAlt,
                //     }
                // ],
            },
        }
    }

}

export async function getPosts(params, locale){
    let sbParams = {
        version: "published",
        starts_with: 'blog/',
        filter_query: {
            Category: {
                in: params,
            }
        },
        language: locale,
    }

    let fetch = await fetchData('', sbParams).then(success => {
        return success
    }).catch((error)=>{
        return null
    });
    return  fetch;
}

export default async function Page ({params, params: {locale}}){
    unstable_setRequestLocale(locale);
    const category = await getCategory(locale);
    const validCategory = category?.data?.datasource_entries?.find(e => e.value === params.slug);
    if (!validCategory) {
        notFound();
    }
    const fetch = await getPosts(params.slug, locale);
    const posts = fetch?.data?.stories ?? [];

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
                    <div className={'flex justify-end mb-3'}>
                        <SearchBar locale={locale}/>
                    </div>
                    <div className={'flex gap-4'}>
                        <AllCategroyes blok={category.data.datasource_entries} active={params.slug} locale={locale}/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-11 gap-x-8">
                        {posts && posts.map((e, _uid) => (
                            <PosePreview blok={e} key={_uid} locale={locale}/>
                        ))}
                    </div>
                    <LazyLoadBlog count={fetch?.total ?? posts.length} locale={locale}/>
                </div>
            </section>
        </>


    );
};
