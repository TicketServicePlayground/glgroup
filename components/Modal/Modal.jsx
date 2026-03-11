'use client'
import React, {useEffect, useState} from 'react';
import clsx from "clsx";
import {useLocale} from "next-intl";
import styles from "./Modal.module.scss";
import ContactForm from "@/components/ContactForm/ContactForm";
const Modal = ({object, uid, type, contactForm}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const locale = useLocale();


    const createLink = (link) => {
        if(locale === 'ru'){
            return '/ru/'+link.cached_url;
        }else if(locale === 'en' && link.linktype !== 'story'){
            return '/en/'+link.cached_url;
        }else{
            return link.cached_url;
        }
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    useEffect(() => {
        if(isModalOpen){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        }
    }, [isModalOpen]);

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                key={uid}
                className={clsx(
                    !object.contact && type ? 'hover:bg-text-green-active' : 'hover:bg-text-yellow-active',
                    object.contact && !type && 'border-yellow-active text-yellow-active border rounded-3xl lg:px-2.5 lg:py-2 xl:px-3 xl:py-2.5 hover:bg-yellow-active hover:text-black',
                    object.contact && type && 'border-green-active text-green-active border rounded-3xl lg:px-2.5 lg:py-2 xl:px-3 xl:py-2.5 hover:bg-green-active hover:text-black'
                )}
            >
                {object.label}
            </button>
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={closeModal} key={uid+1}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <i className={styles.button} onClick={closeModal}>
                            <svg className={styles.customSvg} width="64px" height="64px" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                                        className={styles.circle}></path>
                                    <path d="M9 9L15 15M15 9L9 15" className={styles.cross} strokeLinecap="round"></path>
                                </g>
                            </svg>

                        </i>
                        <ContactForm blok={contactForm.data.story.content.body[0]} modal={true}/>
                    </div>
                </div>
            )}
        </>
    )

};

export default Modal;