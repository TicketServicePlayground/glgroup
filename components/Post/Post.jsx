import React from 'react';
import styles from './Post.module.scss';
import Link from "next/link";
import DynamicComponent from "@/components/ServerDynamicComponent";
import Image from "next/image";
import Share from "@/components/Share/Share";
import ContactForm from "@/components/ContactForm/ContactForm";
import {fetchData} from "@/lib/api";
import OtherArticles from "@/components/OtherArticles/OtherArticles";
import {storyblokEditable} from "@/lib/storyblokCompat";
import {useLocale} from "next-intl";
import {findAnchors} from "@/lib/findAnchors";
import textStyles from '@/components/UI/UI.module.scss';
import clsx from "clsx";
import OurRecomendations from "@/components/OurRecomendations/OurRecomendations";

export async function getData(title, locale, category, showcase) {
    const prefix = !showcase ? 'blog/' : 'showcase/';
    const sbParams = {
        version: "published",
        starts_with: prefix,
        language: locale,
        page: 1,
        per_page: 3,
        filter_query: {
            title: {
                not_in: title
            },
            ...((!showcase) && {
                Category: {
                    in: '1'
                }
            })
        }
    };

    return await fetchData('', sbParams);
}

export default async function Post ({blok, showcase}) {
    const locale = useLocale();
    const date = new Date(blok.published_at);
    const create  = new Date(blok.created_at);
    const contactForm = await fetchData('blog-contact', {version: 'draft', language: locale})
    const posts = await getData(blok.content.title, locale, blok.content.Category, showcase);
    const active = blok.content.active;
    const formattedDate = date.toLocaleDateString(`${locale}`, {day: 'numeric', month: 'long', year: 'numeric'});
    const created_at = create.toLocaleDateString(`${locale}`, {day: 'numeric', month: 'long', year: 'numeric'});
    const recom = await fetchData('showcase/index', {version: 'draft', language: locale})
    const anchors = findAnchors(blok.content.textBlocks)
    let author = "empty"
    if(locale === 'en'){
        author = await fetchData(blok.content.Author?.cached_url.replace("/en/", ""), {version: 'draft', language: locale})
    }else{
        author = await fetchData(blok.content.Author?.cached_url, {version: 'draft', language: locale})
    }


    // console.log(active);
    //console.log(showcase);

    const createLink = (link) => {
        if(locale === 'ru' && link.linktype === 'story'){
            return '/ru/'+link.cached_url;
        }else{
            return link.cached_url;
        }
    }
    return (
        <section {...storyblokEditable(blok)}>
            <div itemScope itemType="https://schema.org/NewsArticle" className={"hidden"}>
                <div itemProp="headline">{blok.content.title}</div>
                <img itemProp="image" src={blok.content.img.filename}/>
                <div>
                    <span itemProp="datePublished" content={blok.created_at}>
                      {created_at}
                    </span>
                    (last modified
                    <span itemProp="dateModified" content={blok.published_at}>
                      {formattedDate}
                    </span>
                    )
                </div>
            </div>
            <div className="container pb-24 flex-col flex md:flex-row gap-4">
                <div className="md:min-w-[59%] xl:min-w-[1000px]">
                    <h1 className={'h1 mb-5 xl:mb-4'}>{blok.content.title}</h1>
                    <div className="flex gap-8 items-center mb-5 xl:mb-10 ">
                        <span className={styles.date}>{formattedDate}</span>
                        {blok.content.showAuthor && (
                            <Link href={createLink(blok.content.Author)}
                                  className={styles.author}>{blok.content.authorLabel}</Link>
                        )}

                    </div>
                    <div className={styles.img}>
                        {showcase && !active && (
                            <div className={"absolute top-0 left-0 backdrop-blur flex items-center justify-center z-10 w-full h-full text-white text-xl lg:text-5xl font-bold"}>
                                {locale ==='en' ? "SOLD" : "ПРОДАНО"}
                            </div>
                        )}
                        <Image src={blok.content.img.filename} alt={blok.content.img.alt}
                               fill
                               quality={90}
                               sizes="(max-width: 768px) 50vw,
                                 (max-width: 1200px) 75vw,
                                 50vw"
                               style={{
                                   objectFit: "cover",
                               }}
                        />
                    </div>
                    {/*{anchors.length !== 0 && (*/}
                    {/*    <div className={"mb-16"}>*/}
                    {/*        <div className={styles.contentArticles}>*/}
                    {/*            <span className={"h2 mb-6 block"}>{locale === 'ru' ? "Содержание" : "Content"}</span>*/}
                    {/*            <ol className={styles.listLinks}>*/}
                    {/*                {anchors.map((anchor, index) => (*/}
                    {/*                    <li key={index}><Link href={`#${anchor.marks[0].attrs.id}`}>{anchor.text}</Link>*/}
                    {/*                    </li>*/}
                    {/*                ))}*/}
                    {/*            </ol>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    <div className={"mb-16 relative"}>
                        {showcase && !active && (
                            <div className={"absolute top-0 left-0 backdrop-blur flex items-center justify-center z-10 w-full h-full"}>
                            </div>
                        )}
                        {blok.content.textBlocks && blok.content.textBlocks.map((e, _uid) => (
                            <DynamicComponent blok={e} key={_uid}/>
                        ))}
                    </div>
                    <Share/>
                </div>
                <div className={"relative"}>
                    <div className="sticky top-20 pt-3">

                        {blok.content.showAuthor && !showcase && (
                            <Link href={createLink(blok.content.Author)}
                                  className={styles.author}>
                                <div className={clsx("text-black text-lg text-center")}>{locale === 'ru' ? "Автор" : "Author"}</div>
                                <div className={"flex gap-5 justify-center items-center"}>
                                    <div className={styles.imgBlock}>
                                        <Image src={author?.data.story?.content.photo.filename}
                                               alt={author?.data.story?.content.photo.alt}
                                               fill
                                               sizes="(max-width: 768px) 50vw,
                                 (max-width: 1200px) 25vw,
                                 25vw"
                                               style={{
                                                   objectFit: "cover",
                                               }}
                                               quality={100}
                                        />
                                    </div>
                                    <div className={styles.labelAuthor}>{author?.data.story?.content.fullname}</div>
                                </div>
                            </Link>
                        )}

                        {anchors.length !== 0 && !showcase && (
                            <div className={"hidden md:block mb-8"}>
                                <div className={styles.contentArticles}>
                                    <span
                                        className={"h3 mb-6 block"}>{locale === 'ru' ? "Содержание" : "Content"}</span>
                                    <ol className={styles.listLinks}>
                                        {anchors.map((anchor, index) => (
                                            <li key={index}><Link
                                                href={`#${anchor.marks[0].attrs.id}`}>{anchor.text}</Link>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        )}

                        <OtherArticles posts={posts.data.stories} showcase={showcase} />
                    </div>
                </div>
            </div>
            <ContactForm blok={contactForm.data.story.content.body[0]}/>
            <OurRecomendations blok={recom.data.story.content.body[0]} locale={locale} />
            {/*<OtherArticles posts={posts.data.stories}/>*/}
        </section>
    );
};


