'use client';
import React, {useEffect} from 'react';
import {storyblokEditable} from "@/lib/storyblokCompat";
import styles from "./number.module.scss";
import clsx from "clsx";
import NumberBlock from "./NumberBlock";
import BlockItem from "./blockItem";


const OurAdvantages = ({blok}) => {

    useEffect(() => {
        const containerElement = document.getElementById(`blockAdvantage`);
        const scrollElement = (element) => {
            const currentScroll = element.scrollLeft;
            element.scrollTo({
                left: currentScroll+200,
                behavior: "smooth",
            })
            setTimeout(() => {
                element.scrollTo({
                    left: currentScroll,
                    behavior: "smooth",
                })
                // handleClick(0);
            }, 500); // Вернуть обратно через 0.5 секунд
        };

        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scrollElement(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });
        observer.observe(containerElement);
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <section {...storyblokEditable(blok)} className={clsx(styles.ourAdvantages, "py-24")} id={blok.id}>
            <div className={'container'} >
                <div className={clsx(styles.titleBlock, styles.half)}>
                    {blok.subTitle && (
                        <span className={styles.subLabel}>{blok.subTitle}</span>
                    )}
                    <h2 className={'h2'}>{blok.title}</h2>
                </div>
                <div className={styles.grid}>
                    {blok.numbers && blok.numbers.map((e, _uid)=>(
                            <NumberBlock item={e} key={_uid}/>
                    ))}
                </div>
                <div className={styles.blocks}>
                    <span className={styles.label}>{blok?.titleBlock}</span>
                    <div className={styles.blockBloks} id={'blockAdvantage'}>
                        {blok.blocks && blok.blocks.map((e,_uid)=>(
                            <BlockItem key={_uid} blok={e}/>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};


export default OurAdvantages;