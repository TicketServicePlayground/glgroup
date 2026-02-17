import React from 'react';
import styles from './header.module.scss';
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import {useLocale} from "next-intl";
import Langs from "@/components/Langs/Langs";
import {fetchData} from "@/lib/api";


const Header = ({links, type, menu}) => {
    const itemLinks = links?.links;
    const socials = links?.socials;
    const mail = links?.label;
    const mailIcon = links?.icon;
    const mailIconBlack = links?.iconBlack;
    const whatsappIcon = links?.imageWhatsapp;
    const wpiconBlack = links?.ImageWpBlock;
    const number = links?.whatsappNumber;
    const locale = useLocale();

    const filteredLinks = itemLinks.filter((e) => {
        return !(locale === 'id' && e.link.includes('blog'));
    })

    return (
        <div className={clsx('py-5', styles.header, type && (styles.black), type ? 'text-black' : 'text-white')}>


            <div className={'container flex justify-between h-full'}>
                <div className={'flex gap-2 xl:gap-2.5 items-center'}>
                    <Link href={`/${locale}`} className="flex items-center lg:gap-2 xl:gap-4">
                        <Image src={'/img/logo.svg'} alt={"Logo"}
                               width={59}
                               height={59}
                               style={{width: "59px"}}
                        />
                        <span
                            className={'h-fit max-w-[100px] xl:max-w-[136px] font-extrabold text-base xl:text-xl uppercase'}>{menu.siteName}</span>
                    </Link>
                    <span
                        className={'w-fit font-gilroy text-sm lg:text-desc lowercase lg:max-w-[119px] xl:max-w-[139px] leading-4 lg:leading-3.5'}>{menu.siteDescription}</span>
                </div>
                <div className={'flex gap-4 xl:gap-10 font-gilroy text-base font-normal items-center'}>
                    {filteredLinks && filteredLinks.map((e, _uid) => (
                        <Link href={e.link} key={_uid}
                              className={'hover:text-yellow-active'}>

                            {e.label}</Link>
                    ))}
                </div>
                <div className={'flex gap-5 xl:gap-10'}>
                    <div className={clsx('flex items-center gap-3 xl:gap-4', type && styles.imgBlack)}>
                        {socials && socials.map((e, _uid) => (
                            <Link href={e.link} key={_uid}>
                                {/*{e.nameSoc === "facebook" && (*/}
                                {/*    <i className={clsx(type ? styles.blackIcon : styles.whiteIcon)}>*/}
                                {/*        <svg width="19" height="19" viewBox="0 0 20 20" fill="none"*/}
                                {/*             xmlns="http://www.w3.org/2000/svg">*/}
                                {/*            <path*/}
                                {/*                d="M20 10C20 4.48 15.52 0 10 0C4.48 0 0 4.48 0 10C0 14.84 3.44 18.87 8 19.8V13H6V10H8V7.5C8 5.57 9.57 4 11.5 4H14V7H12C11.45 7 11 7.45 11 8V10H14V13H11V19.95C16.05 19.45 20 15.19 20 10Z"*/}
                                {/*                fill="#121212"/>*/}
                                {/*        </svg>*/}
                                {/*    </i>*/}
                                {/*)}*/}
                                {/*{e.nameSoc === "instagram" && (*/}
                                {/*    <i className={clsx(type ? styles.blackIcon : styles.whiteIcon)}>*/}
                                {/*        <svg width="20" height="20" viewBox="0 0 34 34" fill="none"*/}
                                {/*             xmlns="http://www.w3.org/2000/svg">*/}
                                {/*            <path fillRule="evenodd" clipRule="evenodd"*/}
                                {/*                  d="M8.23269 1.91113C6.55588 1.91113 4.94772 2.57708 3.76181 3.76253C2.5759 4.94799 1.90934 6.5559 1.90869 8.2327V25.0967C1.90869 26.7739 2.57497 28.3825 3.76095 29.5684C4.94693 30.7544 6.55546 31.4207 8.23269 31.4207H25.0967C26.7735 31.4201 28.3814 30.7535 29.5669 29.5676C30.7523 28.3817 31.4183 26.7735 31.4183 25.0967V8.2327C31.4176 6.55632 30.7514 4.94877 29.566 3.76339C28.3806 2.578 26.7731 1.91178 25.0967 1.91113H8.23269ZM26.9157 8.24242C26.9157 8.72549 26.7238 9.18878 26.3822 9.53036C26.0406 9.87195 25.5773 10.0638 25.0943 10.0638C24.6112 10.0638 24.1479 9.87195 23.8063 9.53036C23.4647 9.18878 23.2728 8.72549 23.2728 8.24242C23.2728 7.75935 23.4647 7.29606 23.8063 6.95447C24.1479 6.61289 24.6112 6.42099 25.0943 6.42099C25.5773 6.42099 26.0406 6.61289 26.3822 6.95447C26.7238 7.29606 26.9157 7.75935 26.9157 8.24242ZM16.6671 11.6133C15.3274 11.6133 14.0425 12.1455 13.0952 13.0928C12.1479 14.0401 11.6157 15.325 11.6157 16.6647C11.6157 18.0044 12.1479 19.2893 13.0952 20.2366C14.0425 21.1839 15.3274 21.7161 16.6671 21.7161C18.0068 21.7161 19.2917 21.1839 20.239 20.2366C21.1863 19.2893 21.7185 18.0044 21.7185 16.6647C21.7185 15.325 21.1863 14.0401 20.239 13.0928C19.2917 12.1455 18.0068 11.6133 16.6671 11.6133ZM9.18469 16.6647C9.18469 14.6809 9.97276 12.7783 11.3755 11.3755C12.7783 9.97277 14.6809 9.1847 16.6647 9.1847C18.6485 9.1847 20.5511 9.97277 21.9538 11.3755C23.3566 12.7783 24.1447 14.6809 24.1447 16.6647C24.1447 18.6485 23.3566 20.5511 21.9538 21.9539C20.5511 23.3566 18.6485 24.1447 16.6647 24.1447C14.6809 24.1447 12.7783 23.3566 11.3755 21.9539C9.97276 20.5511 9.18469 18.6485 9.18469 16.6647Z"*/}
                                {/*                  fill="#121212"/>*/}
                                {/*        </svg>*/}
                                {/*    </i>*/}
                                {/*)}*/}
                                {e.name === "telegram" && (
                                    <i className={clsx(type ? styles.blackIcon : styles.whiteIcon)}>
                                        <svg width="21" height="18" viewBox="0 0 21 18" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M18.6646 0.716942L0.934606 7.55394C-0.275394 8.03994 -0.268393 8.71494 0.712607 9.01594L5.26461 10.4359L15.7966 3.79094C16.2946 3.48794 16.7496 3.65094 16.3756 3.98294L7.84261 11.6839H7.84061L7.84261 11.6849L7.52861 16.3769C7.98861 16.3769 8.19161 16.1659 8.44961 15.9169L10.6606 13.7669L15.2596 17.1639C16.1076 17.6309 16.7166 17.3909 16.9276 16.3789L19.9466 2.15094C20.2556 0.911942 19.4736 0.350942 18.6646 0.716942Z"
                                                fill="#121212"/>
                                        </svg>
                                    </i>
                                )}

                            </Link>
                        ))}
                        <Link href={'https://wa.me/' + number}>
                            <i className={clsx(type ? styles.blackIcon : styles.whiteIcon)}>
                                <svg width="20" height="20" viewBox="0 0 22 22" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19.9247 5.35997C16.7897 0.499965 10.3697 -0.940034 5.40468 2.07497C0.559684 5.08997 -1.00032 11.66 2.13468 16.505L2.38968 16.895L1.33968 20.825L5.26968 19.775L5.65968 20.03C7.35468 20.945 9.19968 21.47 11.0297 21.47C12.9947 21.47 14.9597 20.945 16.6547 19.895C21.4997 16.745 22.9397 10.31 19.9247 5.32997V5.35997ZM17.1797 15.47C16.6547 16.25 15.9947 16.775 15.0797 16.91C14.5547 16.91 13.8947 17.165 11.2847 16.13C9.06468 15.08 7.21968 13.37 5.91468 11.405C5.13468 10.49 4.72968 9.30497 4.60968 8.11997C4.60968 7.06997 4.99968 6.15497 5.65968 5.49497C5.91468 5.23997 6.18468 5.10497 6.43968 5.10497H7.09968C7.35468 5.10497 7.62468 5.10497 7.75968 5.62997C8.01468 6.28997 8.67468 7.86497 8.67468 7.99997C8.80968 8.13497 8.74968 9.13997 8.14968 9.70997C7.81968 10.085 7.75968 10.1 7.89468 10.37C8.41968 11.15 9.07968 11.945 9.72468 12.605C10.5047 13.265 11.2997 13.79 12.2147 14.18C12.4697 14.315 12.7397 14.315 12.8747 14.045C13.0097 13.79 13.6547 13.13 13.9247 12.86C14.1797 12.605 14.3147 12.605 14.5847 12.725L16.6847 13.775C16.9397 13.91 17.2097 14.03 17.3447 14.165C17.4797 14.555 17.4797 15.08 17.2097 15.47H17.1797Z"
                                        fill="#FFFFFF"/>
                                </svg>
                            </i>

                        </Link>
                    </div>
                    {/*<Link href={'mailto:' + mail}*/}
                    {/*      className={'flex lg:gap-2 xl:gap-3 items-center hover:text-yellow-active '}>*/}
                    {/*    <i className={clsx(type ? styles.blackIcon : styles.whiteIcon)}>*/}
                    {/*        <svg width="24.000000" height="24.000000" viewBox="0 0 24 24" fill="none"*/}
                    {/*             xmlns="http://www.w3.org/2000/svg">*/}
                    {/*            <path id="Vector"*/}
                    {/*                  d="M22 7.53503L22 17C22.0001 17.7653 21.7077 18.5016 21.1827 19.0583C20.6577 19.615 19.9399 19.9502 19.176 19.995L19 20L5 20C4.2348 20.0001 3.49847 19.7078 2.94174 19.1827C2.38498 18.6578 2.0499 17.9399 2.005 17.176L2 17L2 7.53503L11.445 13.832L11.561 13.8981C11.6977 13.9648 11.8478 13.9995 12 13.9995C12.1522 13.9995 12.3023 13.9648 12.439 13.8981L12.555 13.832L22 7.53503Z"*/}
                    {/*                  fill="#FFFFFF" fillOpacity="1.000000" fillRule="nonzero"/>*/}
                    {/*            <path id="Vector"*/}
                    {/*                  d="M19.0001 4C20.0801 4 21.0271 4.56995 21.5551 5.427L12.0001 11.797L2.44507 5.427C2.6958 5.01978 3.04028 4.67834 3.44977 4.4314C3.85928 4.18433 4.3219 4.03882 4.79907 4.00696L5.00006 4L19.0001 4Z"*/}
                    {/*                  fill="#FFFFFF" fillOpacity="1.000000" fillRule="nonzero"/>*/}
                    {/*        </svg>*/}
                    {/*    </i>*/}
                    {/*</Link>*/}

                    <Langs locale={locale} type={type}/>
                </div>
            </div>
        </div>
    );
};


export default Header;