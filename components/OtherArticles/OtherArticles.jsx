"use client";
import React, {useRef} from 'react';
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import PosePreview from "@/components/PostPreview/PosePreview";
import styles from "./OtherArticles.module.scss";
import {storyblokEditable} from "@/lib/storyblokCompat";
import {useLocale} from "next-intl";
import clsx from "clsx";



export default function OtherArticles ({posts, showcase}) {
    const arrowPrev = useRef(null);
    const arrowNext = useRef(null);
    const local = useLocale();

    return (
        <section>
           <div className={styles.block}>
               <h2 className={clsx(styles.title, "h3")}>
                   {!showcase && (local === 'ru' ? 'Другие статьи' : 'Other articles')}
                   {showcase && (local === 'ru' ? 'Другие бизнесы' : 'Other businesses')}
               </h2>
               <div className="flex overflow-x-scroll md:overflow-auto md:flex-col gap-4">
                   {posts.map((e, _uid) => (
                       <PosePreview blok={e} key={_uid} other={true} locale={local}/>
                   ))}
               </div>

               {/*<Swiper*/}
               {/*    pagination={{*/}
               {/*        type: 'fraction',*/}
               {/*    }}*/}
               {/*    slidesPerView={1.2}*/}
               {/*    spaceBetween={45}*/}
               {/*    onBeforeInit={(swiper) => {*/}
               {/*        swiper.params.navigation.prevEl = arrowPrev.current;*/}
               {/*        swiper.params.navigation.nextEl = arrowNext.current;*/}
               {/*    }}*/}
               {/*    modules={[Navigation]}*/}
               {/*    navigation={{*/}
               {/*        prevEl: arrowPrev.current,*/}
               {/*        nextEl: arrowNext.current,*/}
               {/*    }}*/}
               {/*    breakpoints={{*/}
               {/*        320: {*/}
               {/*            slidesPerView: 1.2,*/}
               {/*            spaceBetween: 20*/}
               {/*        },*/}
               {/*        550: {*/}
               {/*            slidesPerView: 1.7,*/}
               {/*            spaceBetween: 20*/}
               {/*        },*/}
               {/*        768: {*/}
               {/*            slidesPerView: 2,*/}
               {/*            spaceBetween: 20*/}
               {/*        },*/}
               {/*        1024: {*/}
               {/*            slidesPerView:3,*/}
               {/*            spaceBetween: 45*/}
               {/*        }*/}
               {/*    }}*/}

               {/*    className="otherArticles"*/}
               {/*>*/}
               {/*    {posts.map((e, _uid) => (*/}
               {/*        <SwiperSlide key={_uid}>*/}
               {/*            <PosePreview blok={e} key={_uid} other={true} locale={local}/>*/}
               {/*        </SwiperSlide>*/}
               {/*    ))}*/}

               {/*    <div*/}
               {/*        className="absolute top-0 right-0 min-w-[151px] min-h-[58px]">*/}
               {/*        <div className={"otherArrows"}>*/}
               {/*            <div className="swiper-button-prev" ref={arrowPrev}></div>*/}
               {/*            <div className="swiper-button-next" ref={arrowNext}></div>*/}
               {/*        </div>*/}
               {/*    </div>*/}
               {/*</Swiper>*/}
           </div>
        </section>
    );
};
