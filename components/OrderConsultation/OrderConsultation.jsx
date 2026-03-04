// OrderConsultation.jsx (SERVER COMPONENT)
import React from "react";
import styles from "./OrderConsultation.module.scss";
import clsx from "clsx";
import { render } from "storyblok-rich-text-react-renderer";
import {storyblokEditable} from "@/lib/storyblokCompat";
import Image from "next/image";
import { fetchData } from "@/lib/api";
import { headers } from "next/headers";
import Modal from "@/components/Modal/Modal"; // ✅ підключаємо твій клієнтський Modal

const OrderConsultation = async ({ blok }) => {
    const locale = headers().get("x-next-intl-locale") || "en";

    // ⚙️ Отримуємо форму з Storyblok
    const contactForm = await fetchData("blog-contact", {
        version: "draft",
        language: locale,
    });

    return (
        <section className={styles.OrderConsultation} {...storyblokEditable(blok)}>
            <div className={clsx("container", styles.content)}>
                <div className={styles.contentBlock}>
                    <div className={styles.logo}>
                        <img src={`/img/logo.svg`} alt="logo" />
                    </div>

                    <div className={styles.description}>
                        {render(blok.description)}
                    </div>

                    <div className={styles.paper}>
                        <img src={`/img/paper.png`} alt="paper" />
                    </div>

                    <div className={styles.contact}>
                        {blok.button?.map((btn) => (
                            <Modal
                                key={btn._uid}
                                object={btn}
                                uid={btn._uid}
                                type="consult"
                                contactForm={contactForm}
                                className={styles.bookcall}
                            />
                        ))}

                        <div className={styles.socials}>
                            {blok?.social?.map((e, _uid) => (
                                <a href={e.link.cached_url} className={styles.item} key={_uid}>
                                    <Image src={e.image.filename} width={22} height={22} alt="social icon" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderConsultation;
