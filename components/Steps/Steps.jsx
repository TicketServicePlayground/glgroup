import React from 'react';
import styles from './Steps.module.scss'
import Image from "next/image";
import {storyblokEditable} from "@/lib/storyblokCompat";

const Steps = ({blok}) => {
    return (
        <section {...storyblokEditable(blok)} className={styles.steps}>
            <div className="container">
                <div className={styles.titleBlock}>
                    <h2>{blok.title}</h2>
                </div>
                <div className={styles.grid}>
                    {blok?.grid && blok.grid.map((e, index, _uid)=>(
                        <div className={styles.item} key={index}>
                            <div className={styles.first}>
                                <i>
                                    <Image src={e.icon.filename} width={34} height={34} alt={e.icon.alt}/>
                                </i>
                                {e.arrow && (
                                    <div className={styles.arrows}>
                                        <div className={styles.arrow}></div>
                                    </div>
                                )}
                            </div>
                            <div className={styles.textBlock}>
                                <span className={styles.number}>{index+1}.</span>
                                <span className={styles.text}>{e.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


export default Steps;