import React from 'react';
import styles from './twoGrids.module.scss';
import DynamicComponent from "@/components/DynamicComponent";
import GridItem from "./GridItem";
import Image from "next/image";
import Item from "@/components/TwoGrids/Item";
import {storyblokEditable} from "@/lib/storyblokCompat";

const TwoGrids = ({blok}) => {
    return (
        <section {...storyblokEditable(blok)} className={styles.twoGrids}>
            <div className="container">
                <div className={styles.titleBlock}>
                    <h2>{blok.Title}</h2>
                    <h3 className={styles.label}>
                        {blok.labelFirst}
                    </h3>
                </div>
                <div className={styles.firstBlocks}>
                    <div className={styles.flex}>
                        {blok?.gridFirst && blok.gridFirst.map((e, _uid) => (
                            <GridItem blok={e} key={_uid} grid={"yes"}/>
                        ))}
                    </div>
                    <div className={styles.imageBlock}>
                        <Image src={blok.img.filename} alt={blok.img.alt}
                               fill
                               quality={80}
                               sizes="(max-width: 768px) 50vw,
                                 (max-width: 1200px) 25vw,
                                 25vw"
                               style={{
                                   objectFit: "cover",
                               }}
                        />
                    </div>
                </div>
                <div className={styles.titleBlock}>
                    <h3 className={styles.label}>
                        {blok.labelSecond}
                    </h3>
                </div>
                <div className={styles.secondBlocks}>
                     <div className={styles.grid}>
                         {blok?.gridSecond && blok.gridSecond.map((e, _uid)=>(
                             <Item blok={e} key={_uid}/>
                         ))}
                     </div>
                    <div className={styles.leftBlock}>
                        {blok?.leftSide && blok.leftSide.map((e, _uid)=>(
                            <DynamicComponent blok={e}  key={_uid}/>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};


export default TwoGrids;