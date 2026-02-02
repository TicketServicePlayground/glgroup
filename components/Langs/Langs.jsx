'use client';
import React, {useEffect, useState} from 'react';
import clsx from "clsx";
import styles from "@/components/header/header.module.scss";

import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";

const Langs = ({type, locale}) => {
    const [url, setUrl] = useState('')
    const [loc, setLoc] = useState(locale)
    const pathname = usePathname();

    useEffect(()=>{
        let href = window.location.pathname.replace(/^\/[a-z]{2}/, '');
        setUrl(href);
        setLoc(locale)
    }, [pathname])
    return (
        <div className="flex lg:gap-2 xl:gap-3 font-gilroy font-bold text-sm items-center">
            <Link href={'/ru'+url}
                  className={clsx(loc === 'ru' ? (type ? "text-green-active" : "text-yellow-active") : (type ? "hover:text-green-active" : "hover:text-yellow-active"))}>
                RU
            </Link>
            <span className={clsx(styles.vertLine, type && styles.black)}></span>
            <Link href={'/en'+url}
                  className={clsx(loc === 'en' ? (type ? "text-green-active" : "text-yellow-active") : (type ? "hover:text-green-active" : "hover:text-yellow-active"))}>
                EN
            </Link>
            <span className={clsx(styles.vertLine, type && styles.black)}></span>
            <Link href={'/id'+url}
                  className={clsx(loc === 'id' ? (type ? "text-green-active" : "text-yellow-active") : (type ? "hover:text-green-active" : "hover:text-yellow-active"))}>
                ID
            </Link>
        </div>
    );
};


export default Langs;