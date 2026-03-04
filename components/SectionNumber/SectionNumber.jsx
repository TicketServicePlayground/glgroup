import React from 'react';
import {storyblokEditable} from "@/lib/storyblokCompat";
import styles from "./number.module.scss";
import clsx from "clsx";
import NumberBlock from "/components/SectionNumber/NumberBlock";
import BlockItem from "/components/SectionNumber/blockItem";


const SectionNumber = ({blok}) => {
    const bgcolor = blok?.backgroundColor.color;
    const color = blok?.textColor.color;
    const numberColor = blok?.numberColor.color;
    return (
        <section {...storyblokEditable(blok)} style={{background: bgcolor, color:color}} id={blok.id}>
            <div className={'container pt-24 mb-24'} >
                <div className={clsx(styles.titleBlock, styles.half)}>
                    {blok.subTitle && (
                        <span className={styles.subLabel}>{blok.subTitle}</span>
                    )}
                    <h2 className={'h2'}>{blok.title}</h2>
                </div>
                <div className={styles.grid}>
                    {blok.numbers && blok.numbers.map((e, _uid)=>(
                            <NumberBlock item={e} key={_uid} color={numberColor}/>
                    ))}
                </div>
                <div className={styles.blocks}>
                    <span className={styles.label}>{blok?.titleBlock}</span>
                    <div className={styles.blockBloks}>
                        {blok.blocks && blok.blocks.map((e,_uid)=>(
                            <BlockItem key={_uid} blok={e}/>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};


export default SectionNumber;