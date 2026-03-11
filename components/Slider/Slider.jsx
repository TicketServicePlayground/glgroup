"use client";
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {Pagination, Navigation, Autoplay} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import clsx from "clsx";
import Image from "next/image";
import React, { useRef, useState } from 'react';
import styles from './slider.module.scss'
import Link from "next/link";


export default function Slider({items}) {
    const paginationRef = useRef(null);
    const arrowPrev = useRef(null);
    const arrowNext = useRef(null);
    const data = items[0];

    return (
        <div
            className={'h-[100vh] max-h-[785px] lg:min-h-[1016px] xl:max-h-[120vh]'}>
            <Swiper
                pagination={{
                    type: 'fraction',
                }}
                loop={true}
                autoplay={{
                    delay: 6000,
                    pauseOnMouseEnter: true,
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = arrowPrev.current;
                    swiper.params.navigation.nextEl = arrowNext.current;
                    swiper.params.pagination.el = paginationRef.current;
                }}
                modules={[Autoplay, Pagination, Navigation]}
                navigation={{
                    prevEl: arrowPrev.current,
                    nextEl: arrowNext.current,
                }}

                className="mySwiper"
            >
                {data.slide.map((e, _uid)=>(
                        <SwiperSlide key={_uid}>
                        <div className={clsx("absolute top-0 w-full", styles.content)}>
                            <div className="container text-white">
                                <div className={clsx(styles.line, 'mx-auto')}></div>
                                <div className={styles.textBlock}>
                                    <span className={styles.groupName}>{data?.label}</span>
                                    <div className={styles.header}>
                                        {e.title}
                                    </div>
                                    {e?.description && (
                                        <span className={'text-white text-sm md:text-xl font-medium text-center md:text-left  block md:w-[80%]'}>{e.description}</span>
                                    )}
                                    {(() => {
                                        const href = e?.link?.cached_url || e?.link?.url || '';
                                        if (!href) return null;
                                        return (
                                            <Link href={href} className={styles.button}>
                                                {e.button}
                                            </Link>
                                        );
                                    })()}

                                </div>

                            </div>
                        </div>

                        <Image src={e.image.filename}
                               fill
                               quality={80}
                               sizes="(max-width: 768px) 50vw,
                                 (max-width: 1200px) 50vw,
                                 39vw"
                               style={{
                                   objectFit: "cover",
                               }}
                               alt={e.image.alt}
                        />

                    </SwiperSlide>
                ))}
                <div className="absolute bottom-0 md:top-0 h-1/5 w-full md:h-full">
                    <div className="container flex flex-col flex-1 gap-y-24 gap-x-3 md:block md:relative w-full h-full ">
                        <div className={"heroArrow"}>
                            <div className="swiper-button-prev" ref={arrowPrev}></div>
                            <div className="swiper-button-next" ref={arrowNext}></div>
                        </div>

                        <div ref={paginationRef} className={"pagginations-swiper"}></div>
                    </div>
                </div>

            </Swiper>


        </div>
    )

}