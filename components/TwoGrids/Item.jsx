import React from 'react';
import styles from './item.module.scss'
import {render} from "storyblok-rich-text-react-renderer";
import {storyblokEditable} from "@/lib/storyblokCompat";

const Item = ({blok}) => {
    return (
        <div {...storyblokEditable(blok)} className={styles.block}>
            <span className={styles.number}>
                {blok.number}
            </span>
            <div className={styles.text}>
                {render(blok.label)}
            </div>
        </div>
    );
};


export default Item;