import React from 'react';
import styles from './number.module.scss';
import {render} from 'storyblok-rich-text-react-renderer';
import {storyblokEditable} from "@/lib/storyblokCompat";

const NumberBlock = ({item}) => {
    return (
        <div className={styles.item}>
            <div className={styles.number}>
                {item.Number}
            </div>
            <div className={styles.text}>
                {render(item.text)}
            </div>
        </div>
    );
};


export default NumberBlock;