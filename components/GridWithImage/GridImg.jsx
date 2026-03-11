import React from 'react';
import styles from './GridWithImage.module.scss'
import Link from "next/link";
import Image from "next/image";
import {storyblokEditable} from "@/lib/storyblokCompat";

const GridImg = ({blok}) => {
    const href = blok?.link?.cached_url || blok?.link?.url || '';
    return (
        href ? (
        <Link href={href} className={styles.item} {...storyblokEditable(blok)}>
            <div className={styles.textBlock}>
                <div className={styles.titleBlock}>
                    {/*<span className={styles.number}>{blok.number}</span>*/}
                    <h3>{blok.label}</h3>
                </div>
                <div className={styles.text}>
                    {blok.text}
                </div>
                <div className={styles.button} >
                    {blok.linkLabel}
                </div>
            </div>
            <div className={styles.img}>
                <Image src={blok.img.filename} alt={blok.img.alt}
                       fill
                       quality={80}
                       sizes="(max-width: 768px) 50vw,
                                 (max-width: 1200px) 25vw,
                                 25vw"
                       style={{
                           objectFit: "cover",
                       }}
                />
            </div>
        </Link>
        ) : null
    );
};

export default GridImg;