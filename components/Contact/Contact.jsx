import React from 'react';
import styles from './Contact.module.scss'
import Link from "next/link";
import GoogleMap from "@/components/Contact/GoogleMap";
import {storyblokEditable} from "@/lib/storyblokCompat";
const Contact = ({blok}) => {
    return (
        <section className={styles.block} {...storyblokEditable(blok)}>
            <div className="container">
                <h1>{blok.title}</h1>
                <div className={styles.contact}>
                    <div className={styles.textBlock}>
                        <div className={styles.address}>
                            <span><b>{blok.labelAddress} </b></span>
                            <span>{blok.address}</span>
                        </div>
                        <div className={styles.workTime}>
                            <span><b>{blok.workLabel}</b></span>
                            <span>{blok.workTime}</span>
                        </div>
                        <Link href={'https://wa.me/' + blok.wpNumber} className={styles.wp}>
                            {blok.wpLabel}
                        </Link>
                        <Link href={'mailto:' + blok.email} className={styles.email}>
                            <b>e-mail:</b> {blok.email}
                        </Link>
                    </div>
                    <div className={styles.map}>
                        <GoogleMap/>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default Contact;