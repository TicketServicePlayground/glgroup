'use client';
import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {render} from "storyblok-rich-text-react-renderer";
import styles from "./CookieAlert.module.scss"
const CookieAlert = ({data}) => {
    const [alertCookie, setAlertCookie] = useState(!!data);
    function setOff(){
        Cookies.set("Cookies", true);
        setAlertCookie(false);
    }
    useEffect(() => {
        if(Cookies.get('Cookies')){
            setAlertCookie(false);
        }

    }, [alertCookie]);
    return (
        <>
            {alertCookie ? (
                <section className={styles.cookies}>
                    <div className="container">
                        <div className={styles.block}>
                            <div className={styles.text}>
                                {render(data)}
                            </div>
                            <button type={"button"} className={styles.button} onClick={() => {
                                setOff()
                            }}>
                                Ok
                            </button>
                        </div>
                    </div>
                </section>
            ) : ''
            }
        </>


        );
};


export default CookieAlert;