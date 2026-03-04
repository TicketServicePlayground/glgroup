import React from "react";
import styles from "./ServicesList.module.scss";
import clsx from "clsx";
import { render } from "storyblok-rich-text-react-renderer";
import {storyblokEditable} from "@/lib/storyblokCompat";
import Image from "next/image";
import Link from "next/link";

const ServicesList = async ({ blok }) => {
    return (
        <section className={styles.ServicesList} {...storyblokEditable(blok)}>
            <div className={clsx("container", styles.content)}>
                <div className={styles.contentBlock}>
                    <h2>
                        {blok.title}
                    </h2>

                    <div className={styles.serviceslist}>
                        {blok.services?.map((service) => {
                            // обробка посилання
                            const linkItem = service?.link?.[0];
                            const linkData = linkItem?.link;
                            const label = linkItem?.label || "More";
                            const url = linkData?.cached_url || linkData?.url || "#";

                            // обробка зображення
                            const imgItem = service?.icon;

                            return (
                                <div key={service._uid} className={styles.serviceWraper}>
                                    <div className={styles.serviceDetail}>
                                        <div className={styles.serviceDetailTitle}>{service.title}</div>
                                        {url && (
                                            <Link href={url} className={clsx(styles.linkitem)}>
                                                {label}
                                            </Link>
                                        )}
                                    </div>

                                    {imgItem?.filename && (
                                        <div className={styles.serviceImg}>
                                            <Image
                                                src={imgItem.filename}
                                                alt={imgItem.alt || service.title}
                                                fill
                                                quality={100}
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesList;
