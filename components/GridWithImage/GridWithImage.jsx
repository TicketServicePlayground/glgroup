import React from 'react';
import styles from './GridWithImage.module.scss'
import DynamicComponent from "@/components/DynamicComponent";
import {storyblokEditable} from "@/lib/storyblokCompat";
const GridWithImage = ({blok}) => {
    return (
        <section className={styles.gridWithImage} {...storyblokEditable(blok)}>
            <div className="container">
                <h2>{blok.title}</h2>
                <div className={styles.grid}>
                    {blok?.blocks && blok.blocks.map((e, _uid)=>(
                        <DynamicComponent blok={e} key={_uid}/>
                    ))}
                </div>
            </div>
        </section>
    );
};


export default GridWithImage;