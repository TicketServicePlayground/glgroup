'use client';
import React, {useEffect} from 'react';
import Link from "next/link";
import Image from "next/image";
import styles from "/components/Slider/slider.module.scss"
import clsx from "clsx";
import {unstable_setRequestLocale} from "next-intl/server";
import {useLocale, useTranslations} from "next-intl";

export async function generateMetadata({params}, parent){
    const locale = params.locale || 'en';
    const titles = {
        ru: "404 Страница не найдена - glgconsult",
        en: '404 page not found - glgconsult',
        id: '404 page not found - glgconsult',
    }
    const descriptions = {
        ru: "Что-то пошло не так, данная страница не найдена 404",
        en: '404 page not found',
        id: '404 page not found',
    }

    return  {
        title: titles[locale] || titles['en'],
        description: descriptions[locale] || descriptions['en'],
    };

}
const NotFoundPage = () => {
    const local = useLocale();

    useEffect(() => {
        const titles = {
            ru: "404 Страница не найдена - glgconsult",
            en: "404 page not found - glgconsult",
            id: "404 page not found - glgconsult",
        };

        const descriptions = {
            ru: "Что-то пошло не так, данная страница не найдена 404",
            en: "404 page not found",
            id: "404 page not found",
        };

        document.title = titles[local] || titles['en'];
        document.querySelector('meta[name="description"]')?.setAttribute('content', descriptions[local] || descriptions['en']);
    }, [local]);

    const en = {
        title : "Page not found",
        link: "Home"
    }
    const id = {
        title : "Page not found",
        link: "Home"
    }
    const ru = {
        title : "Страница не найдена",
        link: "На главную"
    }
    return (
        <section>
            <div className="relative w-full h-[100vh] not-found z-0">
                <Image src={"/img/banner1.png"}
                       fill
                       quality={80}
                       sizes="(max-width: 768px) 50vw,
                                 (max-width: 1200px) 25vw,
                                 25vw"
                       style={{
                           objectFit: "cover",
                       }}
                       alt={"not found"}
                />
                <div className={clsx("absolute top-0 w-full", styles.content)}>
                    <div className="container text-white">
                        <div className={clsx(styles.line, 'mx-auto', styles.error)}></div>
                        <div className={clsx(styles.textBlock, 'mt-40 lg:mt-20  mb-10', styles.error)}>
                            <div className={"text-9xl lg:text-12xl font-gilroy font-bold text-center mb-3 lg:mb-4 leading-tight"}>
                                404
                            </div>
                            <span
                                className={'font-medium text-sm md:text-2xl text-center  block '}>{local === 'ru' ? ru['title'] : en['title']}</span>
                        </div>
                        <Link href={`/${local}`} className={'link-not-found'}>{local === 'ru' ? ru['link'] : en['link']}</Link>

                    </div>
                </div>
            </div>

        </section>
    );
};

export default NotFoundPage;