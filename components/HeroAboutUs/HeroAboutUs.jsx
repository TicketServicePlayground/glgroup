import React from 'react';
import styles from './HeroAboutUs.module.scss'
import Image from "next/image";
import Breadcrumbs from "./Breadcrumbs";
import clsx from "clsx";
import {render} from "storyblok-rich-text-react-renderer";
import Slider from "@/components/HeroAboutUs/Slider";
import {storyblokEditable} from "@/lib/storyblokCompat";



const HeroAboutUs = ({blok}) => {
    return (
        <section className={styles.heroAboutUs} {...storyblokEditable(blok)}>
            <div className={styles.img}>
                <Image src={blok.img.filename}
                       fill
                       quality={100}
                       sizes="(max-width: 768px) 50vw,
                                 (max-width: 1200px) 25vw,
                                 25vw"
                       style={{
                           objectFit: "cover",
                       }}
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
                 </div>
                 {/*<div className={styles.slidersBlock}>*/}
                 {/*    <span className={styles.label}>{blok.history}</span>*/}
                 {/*       <Slider sliders={blok.sliders} />*/}
                 {/*</div>*/}
            </div>
        </section>
    );
};



export default HeroAboutUs;