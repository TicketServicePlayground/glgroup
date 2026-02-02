'use client';
import React, {useEffect} from 'react';
import styles from './MobileMenu.module.scss';
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useLocale} from "next-intl";

const MobileNav = ({datas, setShowNav, contactUs, type}) => {
    const number = datas?.whatsappNumber;
    const locale = useLocale();

    const filteredLinks = datas.links.filter((e) => {
        return !(locale === 'id' && e.link.url.includes('blog'));
    })

    const createForm = (link) => {
        if(locale === 'ru'){
            return '/ru/'+link.cached_url;
        }else if(locale === 'en' && link.linktype !== 'story'){
            return '/en/'+link.cached_url;
        }else{
            return link.cached_url;
        }
    }

    const createLink = (link) => {
        if(locale === 'ru' && link.linktype === 'story'){
            return '/ru/'+link.cached_url;
        }else{
            return link.cached_url;
        }
    }
    return (
        <section className={clsx('fixed h-full w-full top-0 left-0', type ? 'bg-white' : 'bg-[#141414]')} id={'menu'}>
            <div className={clsx('flex lg:hidden items-center justify-between w-full px-5 mb-10', styles.content, type && styles.black)}>

                <div className={styles.logoBlock}>
                    <Link href={`/${locale}`} className={'flex gap-3 items-center'} onClick={()=>(setShowNav(false))}>
                        <i className={styles.logo}>
                            <svg width="59" height="58" viewBox="0 0 59 58" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M25.6467 8.32758C25.3114 7.06224 24.3792 6.01466 23.2294 5.17721C19.9458 2.78561 17.9053 0.889873 21.9128 0.225235C23.2076 0.0104789 24.9342 -0.41798 29.2505 1.0824C33.4762 2.55128 34.0658 4.2168 34.8617 5.79754C35.4011 6.86891 35.5092 11.1553 35.5091 11.5841C35.5091 12.8878 34.711 16.4717 31.9054 16.686C29.0997 16.9003 27.7398 15.442 27.1574 14.1142C26.6118 12.8702 26.7258 12.3996 25.6467 8.32758Z"
                                    fill="#FDE14E"/>
                                <path
                                    d="M41.6425 12.0555C42.2216 10.8807 42.2061 9.48341 41.8877 8.10377C40.9789 4.16537 40.6773 1.39912 44.1511 3.50025C45.2723 4.17843 46.8608 4.97513 49.1392 8.91273C51.3697 12.7677 50.7195 14.4108 50.281 16.1237C49.9839 17.2845 47.2438 20.5982 46.9615 20.9227C46.1032 21.9091 43.1399 24.1029 40.8757 22.4436C38.6117 20.7843 38.5427 18.7978 38.9762 17.415C39.3823 16.1194 39.7783 15.8373 41.6425 12.0555Z"
                                    fill="#FDE14E"/>
                                <path
                                    d="M50.0569 25.6174C51.3284 25.2792 52.3785 24.3503 53.2164 23.2062C55.607 19.9423 57.511 17.8872 58.1995 21.8742C58.4214 23.1591 58.8605 24.8718 57.3682 29.1646C55.9075 33.3674 54.233 33.9601 52.6446 34.7574C51.5682 35.2977 47.2524 35.4237 46.8205 35.4255C45.5078 35.4311 41.8953 34.6541 41.6673 31.869C41.4393 29.0837 42.902 27.7269 44.2364 27.1428C45.4868 26.5955 45.9611 26.7067 50.0569 25.6174Z"
                                    fill="#FDE14E"/>
                                <path
                                    d="M11.8381 16.9257C10.6773 16.3081 9.27095 16.2724 7.87127 16.5379C3.87614 17.2957 1.07992 17.4953 3.32149 14.1233C4.04479 13.0353 4.90441 11.4877 8.94955 9.37019C12.9098 7.29712 14.5393 8.00261 16.2467 8.5003C17.404 8.83764 20.638 11.6783 20.9543 11.9704C21.9155 12.8583 24.0146 15.8797 22.2624 18.0662C20.5102 20.2528 18.5089 20.2487 17.1334 19.768C15.8446 19.3175 15.5753 18.9142 11.8381 16.9257Z"
                                    fill="#FDE14E"/>
                                <path
                                    d="M8.41003 32.4275C7.13222 32.7418 6.06443 33.651 5.20466 34.7792C2.75175 37.9979 0.808576 40.017 0.196907 36.018C-0.000231327 34.7291 -0.406178 33.0085 1.16817 28.7443C2.70947 24.5696 4.39514 24.0083 5.99846 23.2408C7.08517 22.7207 11.4026 22.6754 11.8344 22.6816C13.1471 22.7006 16.7439 23.5448 16.9183 26.3338C17.0927 29.1228 15.6042 30.4521 14.2587 31.0111C12.9981 31.5349 12.526 31.4149 8.41003 32.4275Z"
                                    fill="#FDE14E"/>
                                <path
                                    d="M16.712 46.0471C16.0811 47.1951 16.0342 48.5917 16.2906 49.984C17.0227 53.9582 17.201 56.7357 13.8241 54.4835C12.7343 53.7566 11.1828 52.8908 9.08241 48.8568C7.02611 44.9074 7.74912 43.2946 8.26356 41.6027C8.6122 40.456 11.4975 37.2662 11.7941 36.9544C12.6955 36.0068 15.7538 33.9456 17.9417 35.7029C20.1294 37.4603 20.1097 39.4479 19.615 40.8102C19.1514 42.0867 18.7432 42.351 16.712 46.0471Z"
                                    fill="#FDE14E"/>
                                <path
                                    d="M32.2035 49.7565C32.6051 51.0027 33.5913 52.0004 34.7837 52.7769C38.1889 54.9943 40.3267 56.7814 36.3597 57.6535C35.078 57.9353 33.3764 58.4531 28.9869 57.1792C24.6895 55.9322 24.0128 54.2996 23.1347 52.7624C22.5395 51.7207 22.2055 47.4458 22.1829 47.0174C22.1142 45.7156 22.7221 42.0951 25.5126 41.7351C28.303 41.3752 29.7381 42.7608 30.3897 44.0565C31.0001 45.2704 30.9112 45.7462 32.2035 49.7565Z"
                                    fill="#FDE14E"/>
                                <path
                                    d="M46.0618 41.7058C47.2077 42.3504 48.613 42.4192 50.0188 42.1866C54.0316 41.523 56.8317 41.3895 54.5102 44.7072C53.7611 45.7778 52.8647 47.3046 48.7696 49.3261C44.7606 51.3052 43.1481 50.5617 41.4528 50.0241C40.3038 49.6597 37.138 46.7441 36.8288 46.4446C35.8889 45.5345 33.8621 42.4651 35.6662 40.3206C37.4703 38.1762 39.4713 38.2273 40.8351 38.7402C42.113 39.2207 42.3726 39.6302 46.0618 41.7058Z"
                                    fill="#FDE14E"/>
                            </svg>
                        </i>
                        <span className={styles.name}>
                        Good Luck Group
                    </span>
                    </Link>
                </div>
                <div className={'flex h-full'}>
                    <Link href={'https://wa.me/' + number} className={clsx(styles.phoneBlock, type && styles.black)} onClick={()=>(setShowNav(false))}>
                        <i>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M19.925 5.35997C16.79 0.499965 10.37 -0.940034 5.40499 2.07497C0.559989 5.08997 -1.00001 11.66 2.13499 16.505L2.38999 16.895L1.33999 20.825L5.26999 19.775L5.65999 20.03C7.35499 20.945 9.19999 21.47 11.03 21.47C12.995 21.47 14.96 20.945 16.655 19.895C21.5 16.745 22.94 10.31 19.925 5.32997V5.35997ZM17.18 15.47C16.655 16.25 15.995 16.775 15.08 16.91C14.555 16.91 13.895 17.165 11.285 16.13C9.06499 15.08 7.21999 13.37 5.91499 11.405C5.13499 10.49 4.72999 9.30497 4.60999 8.11997C4.60999 7.06997 4.99999 6.15497 5.65999 5.49497C5.91499 5.23997 6.18499 5.10497 6.43999 5.10497H7.09999C7.35499 5.10497 7.62499 5.10497 7.75999 5.62997C8.01499 6.28997 8.67499 7.86497 8.67499 7.99997C8.80999 8.13497 8.74999 9.13997 8.14999 9.70997C7.81999 10.085 7.75999 10.1 7.89499 10.37C8.41999 11.15 9.07999 11.945 9.72499 12.605C10.505 13.265 11.3 13.79 12.215 14.18C12.47 14.315 12.74 14.315 12.875 14.045C13.01 13.79 13.655 13.13 13.925 12.86C14.18 12.605 14.315 12.605 14.585 12.725L16.685 13.775C16.94 13.91 17.21 14.03 17.345 14.165C17.48 14.555 17.48 15.08 17.21 15.47H17.18Z"
                                    fill="white"/>
                            </svg>

                        </i>
                    </Link>
                    <div className={clsx(styles.menuBlock, type && styles.black)}>
                        <i onClick={()=>(setShowNav(false))}>
                            <svg width="22" height="20" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M18.36 19.78L12 13.41L5.63997 19.78L4.21997 18.36L10.59 12L4.21997 5.63997L5.63997 4.21997L12 10.59L18.36 4.22997L19.77 5.63997L13.41 12L19.77 18.36L18.36 19.78Z"
                                    fill="white"/>
                            </svg>
                        </i>
                    </div>
                </div>
            </div>
            <div className={clsx("container", styles.mobile, type && styles.black)}>
                <div className={styles.block}>
                    {filteredLinks && filteredLinks.map((e, _uid) => (
                        <Link key={_uid}
                              href={createLink(e.link)} onClick={()=>(setShowNav(false))}>{e.label}</Link>
                    ))}
                </div>
                <div className={styles.socials}>
                    {datas?.socials && datas.socials.map((e, _uid) => (
                        <Link href={e.link.cached_url}
                              key={_uid} onClick={()=>(setShowNav(false))}>
                            {type ? (<Image src={e.blackImg.filename} width={'34'} height={'34'} alt={e.blackImg.alt}></Image>):(
                            <Image src={e.image.filename} width={'34'} height={'34'} alt={e.image.alt}></Image>
                                )}
                        </Link>
                    ))}
                </div>
                <div className={styles.contact}>
                    <Link href={'mailto:' + datas.label}
                          className={'flex gap-3 items-center hover:text-yellow-active '} onClick={()=>(setShowNav(false))}>
                        {type ? (
                            <Image src={datas.iconBlack.filename} width={'24'} height={'24'} alt={datas.iconBlack.alt}/>
                        ) : (
                            <Image src={datas.icon.filename} width={'24'} height={'24'} alt={datas.icon.alt}/>
                        )}

                        <span className={'font-gilroy font-bold text-sm'}>{datas.label}</span>
                    </Link>
                    <Link href={'https://wa.me/' + number} className="flex gap-3 hover:text-yellow-active" onClick={()=>(setShowNav(false))}>
                        {type ? (
                            <Image src={datas.ImageWpBlock.filename} width={'24'} height={'24'}
                                   alt={datas.ImageWpBlock.alt}/>
                        ): (
                            <Image src={datas.imageWhatsapp.filename} width={'24'} height={'24'}
                                   alt={datas.imageWhatsapp.alt}/>
                        )}

                        <span className={'font-gilroy font-bold text-xl'}>{datas.numberWhatsapp}</span>
                    </Link>
                </div>
                <div className={styles.contactUs}>
                    <Link
                        href={createForm(contactUs.link)}
                        className={styles.button} onClick={()=>(setShowNav(false))}>
                        {contactUs.label}
                    </Link>
                </div>
                <div className="flex justify-center gap-3 font-gilroy text-sm items-center font-bold">
                    <Link href={'/ru'} locale={'ru'} className={clsx(locale === 'ru' ? (type ? "text-green-active" : "text-yellow-active") : (type ? "hover:text-green-active" : "hover:text-yellow-active text-white"))} onClick={()=>(setShowNav(false))}>
                        RU
                    </Link>
                    <span className={styles.vertLine}></span>
                    <Link href={'/en'} locale={'en'} className={clsx(locale === 'en' ? (type ? "text-green-active" : "text-yellow-active") : (type ? "hover:text-green-active" : "hover:text-yellow-active text-white"))} onClick={()=>(setShowNav(false))}>
                        EN
                    </Link>
                    <span className={clsx(styles.vertLine, type && styles.black)}></span>
                    <Link href={'/id'} locale={'id'} className={clsx(locale === 'id' ? (type ? "text-green-active" : "text-yellow-active") : (type ? "hover:text-green-active" : "hover:text-yellow-active text-white"))} onClick={()=>(setShowNav(false))}>
                        ID
                    </Link>
                </div>
            </div>
        </section>
    );
};


export default MobileNav;