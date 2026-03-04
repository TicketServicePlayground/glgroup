import React from 'react';
import styles from './ContactMap.module.scss';
import Image from "next/image";
import Link from "next/link";
import {storyblokEditable} from "@/lib/storyblokCompat";

const ContactMap = ({blok}) => {
    return (
        <section className={styles.contactMap} {...storyblokEditable(blok)}>
            <Image src={blok.background.filename} alt={"maps"}
                   fill
                   quality={100}
                   sizes="(max-width: 768px) 100vw,
                                 (max-width: 1200px) 100vw,
                                 100vw"
                   style={{
                       objectFit: "cover",
                   }}
            />
            <div className="container z-10 relative">
                <div className={styles.contact}>
                    <h2>
                        {blok.Title}
                    </h2>
                    <div className={styles.address}>
                        {blok.address}
                    </div>
                    <Link href={'https://wa.me/'+blok.wpNumber} className={styles.wp}>{blok.wpLabel}</Link>
                    <Link href={"mailto:"+blok.email} className={styles.email}><b>e-mail: </b>{blok.email}</Link>
                    <div className={styles.socials}>
                        {blok?.socials && blok.socials.map((e, _uid)=>(
                            <Link href={e.link.cached_url} className={styles.item} key={_uid}>
                                <Image src={e.image.filename} alt={e.image.alt} width={32} height={32}/>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactMap;
