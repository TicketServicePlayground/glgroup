import React from 'react';
import styles from './AuthorPage.module.scss'
import {render} from "storyblok-rich-text-react-renderer";
import Link from "next/link";
import Image from "next/image";
import {storyblokEditable} from "@/lib/storyblokCompat";

const AuthorPage = ({blok}) => {
    return (
        <section className={styles.authorPage} {...storyblokEditable(blok)}>
            <div className="container">
                <div className={styles.container}>
                    <div className={styles.profile}>
                        <div className={styles.imgBlock}>
                            <Image src={blok.photo.filename} alt={blok.photo.alt}
                                fill
                                sizes="(max-width: 768px) 50vw,
                                 (max-width: 1200px) 25vw,
                                 25vw"
                                style={{
                                     objectFit: "cover",
                                }}
                                quality={100}
                            />
                        </div>
                        <div className={styles.aboutBlock}>
                            <h1 className={'h2'}>{blok.fullname}</h1>
                            <div className={styles.information}>
                                <span className={styles.label}>{blok.informationLabel}</span>
                                <div className={styles.text}>
                                    {render(blok.information)}
                                </div>
                            </div>
                            <div className={styles.socials}>
                                {blok?.socials && blok.socials.map((e, _uid) => (
                                    <Link href={e.link.cached_url} className={styles.item} key={_uid}>
                                        <Image src={e.image.filename} alt={e.image.alt} width={29} height={29}/>
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>
                    <div className={styles.posts}>
                        <div className={styles.label}>{blok.postLabel}</div>
                        <div className={styles.postLinks}>
                            {blok?.postLinks && blok.postLinks.map((e, _uid)=>(
                                <Link href={e.link.linktype === 'story' ? '/'+e.link.cached_url : e.link.cached_url}
                                      key={_uid}
                                    className={styles.link}
                                >
                                    {e.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};


export default AuthorPage;