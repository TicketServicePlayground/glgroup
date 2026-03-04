import React from 'react';
import styles from './Hero.module.scss';
import Header from "/components/header/header";
import Menu from "/components/menu/menu";
import Slider from "/components/Slider/Slider";
import clsx from "clsx";
import {Swiper} from "swiper";
import {fetchData} from "@/lib/api";
import MainStatic from "@/components/MainStatic/MainStatic";
import {storyblokEditable} from "@/lib/storyblokCompat";

const  Hero = ({blok}) => {
    const heroBlock = blok.heroBlock[0];
    return (
        <div className={clsx(styles.hero, '')} {...storyblokEditable(blok)}>
            {heroBlock.component === 'staticMain' && (
                <MainStatic blok={heroBlock} breadcrumbs={blok.heroBlock[1]}/>
            )}
            {heroBlock.component === 'sliderMain' && (
                <Slider items={blok?.heroBlock}/>
            )}
        </div>

    );
};

export default Hero;