'use client';
import React, {useEffect, useRef} from 'react';
import styles from './AllCategoryes.module.scss';
import Link from "next/link";
import clsx from "clsx";
import {storyblokEditable} from "@/lib/storyblokCompat";


const AllCategroyes = ({blok, active, locale}) => {
    const activeItemRef = useRef(null);
    // const scrollContainerRef = useRef(null);

    function createLink(link, locale){
        const prefixes = {
            ru: '/ru/',
            en: '/en/',
            id: '/id/',
        }

        const prefix = prefixes[locale];
        return prefix + link;
    }

    return (
        <div className={styles.allCategory} {...storyblokEditable(blok)}>
            {blok.map((e, index)=>(
                <Link href={ e.value === active ? createLink('blog/', locale) :
                    createLink('blog/category/'+e.value, locale)
                }
                      className={clsx(styles.item, e.value === active && styles.active)}
                      key={index}
                      ref={e.value === active ? activeItemRef : null}
                >
                    {e.name}
                </Link>
            ))}
        </div>
    );
};


export default AllCategroyes;