import React from 'react';
import clsx from "clsx";
import styles from "./GridItem.module.scss";
import {storyblokEditable} from "@/lib/storyblokCompat";
import Image from "next/image";
import {render} from "storyblok-rich-text-react-renderer";

const GridItem = ({blok}) => {
    return (
        <div className={styles.block} {...storyblokEditable(blok)}>
            <div className={styles.icon}>
                <i>
                    <Image src={blok.icon.filename} alt={blok.icon.alt} width={44} height={44}/>
                </i>
            </div>
            <div className={styles.textBlock}>
                <h3 className={styles.label}>{blok.label}</h3>
                <div className={styles.text}>
                    {render(blok.text)}
                </div>
            </div>

        </div>
    );
};


export default GridItem;