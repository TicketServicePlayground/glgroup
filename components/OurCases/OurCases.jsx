"use client";
import React, {useEffect, useRef, useState} from 'react';
import styles from './OurCases.module.scss';
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {Pagination, Navigation, EffectFade} from 'swiper/modules';
import clsx from "clsx";
import {render} from "storyblok-rich-text-react-renderer";
import 'swiper/css';
import Link from "next/link";
import {storyblokEditable} from "@/lib/storyblokCompat";

const OurCases = ({blok}) => {
    const [activeTab, setActiveTab] = useState(0);
    const containerRef = useRef(null);

    const swiperRef = useRef(null);
    const handleClick = (index) => {
        setActiveTab(index);
        swiperRef.current.swiper.slideTo(index);
    };
    useEffect(() => {
        const scrollToActiveTab = () => {
            const activeElement = document.getElementById(`tab-${activeTab}`);
            const containerElement = document.getElementById('ourCases');

            if (activeElement && containerElement && window.innerWidth < 992) {
                const activeRect = activeElement.getBoundingClientRect();
                const containerRect = containerElement.getBoundingClientRect();

                const offset = activeRect.left - containerRect.left + containerElement.scrollLeft - (containerRect.width / 2) + (activeRect.width / 2);

                containerElement.scrollTo({
                    left: offset,
                    behavior: "smooth",
                })
            }
        };

        scrollToActiveTab();
    }, [activeTab]);
    useEffect(() => {
        const containerElement = document.getElementById('ourCases');

        const scrollElement = (element) => {
            const currentScroll = element.scrollLeft;
            element.scrollTo({
                left: currentScroll+200,
                behavior: "smooth",
            })
            setTimeout(() => {
                element.scrollTo({
                    left: currentScroll,
                    behavior: "smooth",
                })
                    // handleClick(0);
            }, 500); // Вернуть обратно через 0.5 секунд
        };

        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scrollElement(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });
        observer.observe(containerElement);
        return () => {
            observer.disconnect();
        };
    }, []);
    return (
        <section className={'pb-20 pt-10 lg:py-24'} id={'case'} {...storyblokEditable(blok)}>
            <div className="container" ref={containerRef} id={'container'}>
                <div className={styles.titleBlock}>
                    {blok?.subTitle && (
                        <div className={styles.subTitle}>{blok.subTitle}</div>
                    )}
                    <h2 className={"h2"}>{blok.title}</h2>
                </div>
                <div className={styles.sliders} >
                    <div className={clsx(styles.tabLines, blok.cases[0].onlyDesc && styles.big)} id={'ourCases'}>
                        {blok.cases.map((slide, index) => (
                            <div
                                id={`tab-${index}`}
                                key={index}
                                className={clsx(styles.tab, activeTab === index && styles.active)}
                                onClick={() => handleClick(index)}
                            >
                                {slide.name}
                            </div>
                        ))}
                    </div>
                    <Swiper
                        modules={[EffectFade]}
                        ref={swiperRef}
                        spaceBetween={50}
                        slidesPerView={1}
                        speed={1000}
                        fadeEffect={{crossFade: true}}
                        virtualTranslate={true}
                        onSlideChange={(swiper) => setActiveTab(swiper.activeIndex)}
                        effect={'fade'}
                        className="Cases"
                    >
                        {blok.cases.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <div className={clsx(styles.slider, slide.onlyDesc && styles.onlyDesc)}>
                                    <div className={styles.decsrBlock}>
                                        <span className={styles.label}>{slide.descriptLabel}</span>
                                        <div className={styles.text}>{render(slide.description)}</div>
                                    </div>
                                    {!slide.onlyDesc && (
                                        <>
                                            <div className={styles.solutionBlock}>
                                        <span className={styles.label}>
                                            <i>
                                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M25.0195 10.943C24.6345 10.5416 24.2375 10.127 24.1073 9.81313C23.9914 9.53312 23.9827 8.95672 23.975 8.44922C23.9586 7.35547 23.9378 5.99484 22.9709 5.02906C22.0041 4.06328 20.6445 4.04469 19.5508 4.025C19.0433 4.01734 18.4669 4.00859 18.1869 3.89266C17.873 3.7625 17.4584 3.36547 17.057 2.98047C16.2827 2.23781 15.318 1.3125 14 1.3125C12.682 1.3125 11.7173 2.23781 10.943 2.98047C10.5416 3.36547 10.127 3.7625 9.81313 3.89266C9.53312 4.00859 8.95672 4.01734 8.44922 4.025C7.35547 4.04688 5.99484 4.06219 5.03125 5.03125C4.06766 6.00031 4.04688 7.35547 4.025 8.44922C4.01734 8.95672 4.00859 9.53312 3.89266 9.81313C3.7625 10.127 3.36547 10.5416 2.98047 10.943C2.23781 11.7173 1.3125 12.6875 1.3125 14C1.3125 15.3125 2.23781 16.2827 2.98047 17.0625C3.36547 17.4639 3.7625 17.8784 3.89266 18.1923C4.00859 18.4723 4.01734 19.0487 4.025 19.5562C4.04141 20.65 4.06219 22.0106 5.02906 22.9764C5.99594 23.9422 7.35547 23.9608 8.44922 23.9805C8.95672 23.9881 9.53312 23.9969 9.81313 24.1128C10.127 24.243 10.5416 24.64 10.943 25.025C11.7173 25.7622 12.6875 26.6875 14 26.6875C15.3125 26.6875 16.2827 25.7622 17.057 25.0195C17.4584 24.6345 17.873 24.2375 18.1869 24.1073C18.4669 23.9914 19.0433 23.9827 19.5508 23.975C20.6445 23.9586 22.0052 23.9378 22.9709 22.9709C23.9367 22.0041 23.9553 20.6445 23.975 19.5508C23.9827 19.0433 23.9914 18.4669 24.1073 18.1869C24.2375 17.873 24.6345 17.4584 25.0195 17.057C25.7622 16.2827 26.6875 15.318 26.6875 14C26.6875 12.682 25.7622 11.7173 25.0195 10.943ZM23.1252 15.2403C22.598 15.7872 22.0008 16.4128 21.6825 17.1828C21.3741 17.9266 21.362 18.7316 21.3544 19.5114C21.3456 20.0977 21.3336 20.9016 21.1192 21.1148C20.9048 21.3281 20.102 21.3412 19.5158 21.35C18.7359 21.362 17.9309 21.3741 17.1872 21.6781C16.4216 21.9964 15.7948 22.5936 15.2447 23.1208C14.8509 23.4981 14.2625 24.0625 14 24.0625C13.7375 24.0625 13.1491 23.4981 12.7597 23.1252C12.2128 22.598 11.5872 22.0008 10.8172 21.6825C10.0734 21.3741 9.26844 21.362 8.48859 21.3544C7.90234 21.3456 7.09844 21.3336 6.88516 21.1192C6.67188 20.9048 6.65875 20.102 6.65 19.5158C6.63797 18.7359 6.62594 17.9309 6.32188 17.1872C6.00359 16.4216 5.40641 15.7948 4.87922 15.2447C4.50188 14.8509 3.9375 14.2625 3.9375 14C3.9375 13.7375 4.50187 13.1491 4.87484 12.7597C5.40203 12.2128 5.99922 11.5872 6.3175 10.8172C6.62594 10.0734 6.63797 9.26844 6.64562 8.48859C6.65875 7.90234 6.67188 7.09844 6.89062 6.89062C7.10938 6.68281 7.90781 6.66422 8.49406 6.65547C9.27391 6.64344 10.0789 6.63141 10.8227 6.32734C11.5883 6.00906 12.215 5.41187 12.7652 4.88469C13.1491 4.50187 13.7375 3.9375 14 3.9375C14.2625 3.9375 14.8509 4.50187 15.2403 4.87484C15.7872 5.40203 16.4128 5.99922 17.1828 6.3175C17.9266 6.62594 18.7316 6.63797 19.5114 6.64562C20.0977 6.65437 20.9016 6.66641 21.1148 6.88078C21.3281 7.09516 21.3412 7.89797 21.35 8.48422C21.362 9.26406 21.3741 10.0691 21.6781 10.8128C21.9964 11.5784 22.5936 12.2052 23.1208 12.7553C23.4937 13.1447 24.0581 13.7331 24.0581 13.9956C24.0581 14.2581 23.4981 14.8509 23.1252 15.2403ZM19.3036 10.4464C19.426 10.5683 19.523 10.7132 19.5893 10.8728C19.6555 11.0323 19.6896 11.2034 19.6896 11.3761C19.6896 11.5488 19.6555 11.7199 19.5893 11.8794C19.523 12.039 19.426 12.1838 19.3036 12.3058L13.1786 18.4308C13.0567 18.5531 12.9118 18.6502 12.7522 18.7165C12.5927 18.7827 12.4216 18.8168 12.2489 18.8168C12.0762 18.8168 11.9051 18.7827 11.7456 18.7165C11.586 18.6502 11.4412 18.5531 11.3192 18.4308L8.69422 15.8058C8.57213 15.6837 8.47529 15.5388 8.40921 15.3792C8.34314 15.2197 8.30913 15.0488 8.30913 14.8761C8.30913 14.7034 8.34314 14.5325 8.40921 14.373C8.47529 14.2134 8.57213 14.0685 8.69422 13.9464C8.81631 13.8243 8.96125 13.7275 9.12076 13.6614C9.28028 13.5953 9.45125 13.5613 9.62391 13.5613C9.79657 13.5613 9.96753 13.5953 10.127 13.6614C10.2866 13.7275 10.4315 13.8243 10.5536 13.9464L12.25 15.6406L17.4464 10.4431C17.5685 10.3213 17.7134 10.2248 17.8729 10.159C18.0323 10.0932 18.2032 10.0595 18.3757 10.0598C18.5482 10.0601 18.7189 10.0944 18.8781 10.1608C19.0373 10.2271 19.1819 10.3242 19.3036 10.4464Z"
                                                    fill="white"/>
                                                </svg>

                                            </i>
                                            {slide.solutionLabel}</span>
                                                <div className={styles.text}>{render(slide.solution)}</div>
                                            </div>
                                            <div className={styles.buttonBlock}>
                                                <Link
                                                    href={slide.link.cached_url}
                                                    className={styles.button}>{slide.linkLabel}</Link>
                                            </div>
                                        </>
                                    )}

                                </div>


                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};


export default OurCases;