import React from 'react';
import styles from "./TwoBlock.module.scss";
import Link from "next/link";
import Image from "next/image";
import DynamicComponent from "@/components/DynamicComponent";
import {storyblokEditable} from "@/lib/storyblokCompat";


const TwoBlock = ({blok}) => {
    return (
        <section {...storyblokEditable(blok)} id={blok.id} className={"py-14 lg:py-24"}>
            <div className={'container flex flex-col-reverse lg:flex-row  gap-4 lg:gap-12 justify-between'}>
                <div className={styles.firstBlock}>
                    {blok?.leftBlock && blok.leftBlock.map((e, _uid)=>(
                        <DynamicComponent blok={e} key={_uid}  />
                    ))}

                </div>
                <div className={styles.secondBlock}>
                    {blok?.rightBlock && blok.rightBlock.map((e, _uid)=>(
                        <DynamicComponent blok={e} key={_uid}  />
                    ))}
                </div>
            </div>
        </section>
    );
};


export default TwoBlock;