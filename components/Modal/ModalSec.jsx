"use client";

import { useModalContact } from "/src/store/modalContactStore";

import ContactForm from "@/components/ContactForm/ContactForm";
import styles from "@/components/Modal/Modal.module.scss";
import React from "react";

export function ModalSec({contactForm}) {
    const { isOpen, close, data } = useModalContact();

    if (!isOpen || !contactForm?.data?.story?.content?.body?.[0]) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={close}
            />
            <div className={"relative z-40"}>
                <div onClick={close} className={"absolute top-2 right-2 cursor-pointer"}>
                    <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                                stroke={"#FFDA2B"}
                                strokeWidth={2}></path>
                            <path d="M9 9L15 15M15 9L9 15" stroke={"#FFDA2B"}
                                  strokeWidth={2} strokeLinecap="round"></path>
                        </g>
                    </svg>
                </div>
                <ContactForm blok={contactForm.data.story.content.body[0]} modal={true} mobile={data?.source === 'header-logo' ? true : false} />
            </div>
        </div>
    );
}
