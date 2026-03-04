import React from 'react';
import styles from './OurPartners.module.scss';
import Slider from './Slider';
import {storyblokEditable} from "@/lib/storyblokCompat";


const OurPartners = ({blok}) => {
    return (
        <section {...storyblokEditable(blok)} className={"py-20 lg:py-32"}>
            <div className="container">
                <div className={styles.blockTitle}>
                    <span className={styles.subTitle}>{blok.subTitle}</span>
                    <h2 className={'h2'}>{blok.title}</h2>
                </div>
            </div>

            <div className={styles.slider}>
                {blok?.sliders && (
                    <Slider items={blok?.sliders}/>
                )}
            </div>
        </section>
    );
};


export default OurPartners;