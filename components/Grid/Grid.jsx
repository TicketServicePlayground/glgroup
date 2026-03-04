'use client';
import React, {useEffect} from 'react';
import styles from "./Grid.module.scss";
import DynamicComponent from "@/components/DynamicComponent";
import clsx from "clsx";
import {storyblokEditable} from "@/lib/storyblokCompat";


const Grid = ({blok}) => {
    useEffect(() => {
        const containerElement = document.getElementById(`scrollBlock`);
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
        <section {...storyblokEditable(blok)}>
            <div className="container pb-10 lg:pb-24">
                <div className={styles.titleBlock}>
                    <h2 className="h2 lg:text-center">{blok.title}</h2>
                </div>
                <div className={clsx(styles.blocks,
                    (typeof blok.columns[0].arrow !== 'undefined' && blok.columns[0].arrow !== null) && styles.withArrow,
                     blok.mobileScroll && styles.mobileScroll )} id={blok.mobileScroll ? ("scrollBlock") : ('grid')}>
                    {blok.columns && blok.columns.map((e, _uid)=>(
                        <DynamicComponent blok={e} key={_uid}  />
                    ))}
                </div>
            </div>
        </section>
    );
};


export default Grid;