import React from 'react';
import styles from './BlockWithArrow.module.scss'
import Image from "next/image";
import clsx from "clsx";
import {storyblokEditable} from "@/lib/storyblokCompat";

const BlockWithArrow = ({blok}) => {
    return (
        <div className={clsx(styles.block, blok.arrow && styles.withArrow)} {...storyblokEditable(blok)}>
            <div className={styles.iconBlock}>
                <i>
                    <Image src={blok?.icon.filename} width={46} height={46} alt={blok?.icon.filename} />
                </i>
                {blok.arrow && (
                    <div className={styles.arrows}>
                        <div className={styles.arrow}></div>
                    </div>
                )}
            </div>
            <h3 className={styles.h3}>{blok.title}</h3>
            <div className={styles.text}>
                {blok.text}
            </div>
        </div>
    );
};


export default BlockWithArrow;