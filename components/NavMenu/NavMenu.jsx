'use client';
import React, {useEffect, useState} from 'react';
import clsx from "clsx";
import Header from "@/components/header/header";
import Menu from "@/components/menu/menu";
import MobileMenu from "@/components/MobileMenu/MobileMenu";
import {usePathname} from "next/navigation";
import useScrollOffset from "@/lib/offset";
import styles from "./NavMenu.module.scss"
import {useLocale} from "next-intl";

export default function NavMenu ({headMenu, menu, contact}) {
    const pathname = usePathname();
    const [white, setWhite] = useState(false);
    const [fixed, setFixed] = useState(false);
    const [Home, setHome] = useState(false);
    const offset = useScrollOffset();
    const locale = useLocale();

    const paths = [
        'rules',
        'blog',
        'contacts',
        "authors",
        "showcase",
        "reviews",
        "preview",
    ]
    const checkType = (path) => {
        const parts = path.split('/');
        let segment, nextSegment;

        if (locale === "eu") {
            segment = parts[1];
            nextSegment = parts[2];
        } else {
            segment = parts[2];
            nextSegment = parts[3];
        }

        if (segment === 'currency-converter' && nextSegment) {
            return true;
        }
        if (segment === 'currency' && nextSegment) {
            return true;
        }

        if (paths.includes(segment)) {
            return true;
        }

        return false;
    };


    const isHome = (path) =>{
        if(locale === "eu"){
            const  parts = path.split('/');
            if(paths.includes(parts[1])){
                return false;
            }else{
                return true;
            }
        }else{
            if(path.length === 3){
                return true;
            }else{
                return false;
            }
        }

    }
    const fix = ()=>{
        if(offset > 50){
            return true;
        }else {
            return false;
        }
    }
    useEffect(() => {
        setWhite(checkType(pathname))
        setHome(isHome(pathname));
    }, [pathname]);
    useEffect(()=>{
        setFixed(fix)
    }, [offset])

    return (
        <header className={clsx(!white ? `w-full z-20 ${styles.blackMenu}` : `w-full mb-5 lg:mb-12 ${styles.whiteMenu}`, fixed ? styles.fixed : '')}>
            <Header links={headMenu} type={white} menu={menu}/>
            {Home && (
                <Menu menu={menu} type={white} contactFrom={contact}/>
            )}
            <MobileMenu menu={headMenu} link={menu} type={white}/>
        </header>
    );
};

