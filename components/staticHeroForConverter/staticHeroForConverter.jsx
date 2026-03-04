import React from 'react';
import styles from './staticHeroForConverter.module.scss'
import Image from "next/image";
import Breadcrumbs from "./Breadcrumbs";
import clsx from "clsx";
import {render} from "storyblok-rich-text-react-renderer";
import {storyblokEditable} from "@/lib/storyblokCompat";



const staticHeroForConverter = ({blok}) => {
    return (
        <section className={styles.staticHeroForConverter} {...storyblokEditable(blok)}>
            <div className={styles.img}>
                <Image src={blok.img.filename}
                       fill
                       quality={100}
                       sizes="100vw"
                       alt={blok.img.alt}
                />
            </div>
            <div className={clsx("container", styles.content)}>
                <Breadcrumbs onHero={true} links={blok.breadcrumbs}/>
                 <div className={styles.contentBlock}>
                     <div className={styles.first}>
                         <span className={styles.label}>{blok.label}</span>
                         <h1>{blok.title}</h1>
                     </div>
                     <div className={styles.second}>
                         {render(blok.description)}
                     </div>
                     <div className={styles.third}>
                         {render(blok.description2)}
                     </div>
                 </div>
            </div>
        </section>
    );
};



export default staticHeroForConverter;