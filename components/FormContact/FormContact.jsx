'use client'
import React, {Suspense, useEffect, useState} from 'react';
import styles from './FormContact.module.scss';
import {render} from "storyblok-rich-text-react-renderer";
import {storyblokEditable} from "@/lib/storyblokCompat";
import {usePathname} from "next/navigation";
import { useUserStore } from '@/src/store/userStore';
import UTMParamsProvider from "@/components/UTMParamsProvider/UTMParamsProvider";
import Turnstile from "react-turnstile";
import 'react-phone-number-input/style.css';
import PhoneInput from "react-phone-number-input";


const FormContact = ({blok, modal=false}) => {
    const [captchaToken, setCaptchaToken] = useState("");
    const [name, setName] = useState('');
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sended, setSended] = useState('');
    const [disable, setDisable] = useState(false);
    const [errors, setErrors] = useState({});
    const [utm, setUtm] = useState({});
    const [sessionId, setSessionId] = useState('');
    const [acceptLang, setAcceptLang] = useState('');
    const [localeVersion, setLocaleVersion] = useState('');
    const [referrer, setReferrer] = useState('');
    const [isReturning, setIsReturning] = useState('');
    const setFormContext = useUserStore(state => state.setFormContext);
    const [id, setId] = useState('');
    const pathname = usePathname()


    useEffect(()=>{
        setId(blok.id)
    }, [pathname])

    useEffect(() => {
        const state = useUserStore.getState();
        setUtm(state.utm);
        setSessionId(state.sessionId);
        setLocaleVersion(state.locale);
        setAcceptLang(state.acceptLang);
        setReferrer(state.referrer);
        setIsReturning(state.isReturning);
    }, []);

    const validateFields = () => {
        const newErrors = {};

        if (!name.trim() && local==='ru') {
            newErrors.name = 'Введите ваше имя';
        }else if(!name.trim() && local==='en'){
            newErrors.name = 'Enter your name';
        }
        if (!phone.trim() && local==='ru') {
            newErrors.phone = 'Введите ваш номер телефона';
        } else if(!phone.trim() && local==='en'){
            newErrors.phone = 'Enter your phone number';
        }else if (!/^\+?\d{10,15}$/.test(phone) && local==='ru') {
            newErrors.phone = 'Введите корректный номер телефона';
        }else if (!/^\+?\d{10,15}$/.test(phone) && local==='en') {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!email.trim() && local==='ru') {
            newErrors.email = 'Введите ваш email';
        } else if (!email.trim() && local==='en') {
            newErrors.email = 'Enter your email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && local==='ru') {
            newErrors.email = 'Введите корректный email';
        }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && local==='en') {
            newErrors.email = 'Please enter a valid email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const sendMail = async (e) => {
        e.preventDefault();

        setFormContext({
            formPage: typeof window !== 'undefined' ? window.location.href : pathname,
            fromModal: Boolean(modal),
        });

        if (!validateFields()) {
            return;
        }

        setDisable(true)
        const response = await fetch('/api/contactForm', {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name,
                phone,
                email,
                id,
                message,
                token: captchaToken,
                session_id: sessionId,
                version: localeVersion,
                form_page: typeof window !== 'undefined' ? window.location.href : pathname,
                from_modal: Boolean(modal),
                acceptLang: acceptLang,
                referrer: referrer,
                isReturning: isReturning,
                ...utm
            })
        })
        const res = await response.json();

        if(res.status === 500 || res.status === 400) {
            setSended(false);
        }else{
            setSended(true)
        }
        setDisable(false)
        //console.log(res)

    }
    return (
        <section className={styles.formContact} {...storyblokEditable(blok)}>
            <div className="container">
                <div className={styles.contactBlock}>
                    <h2>{blok.title}</h2>
                    {sended === '' ? (
                        <form onSubmit={sendMail}>
                            <label htmlFor={"name"}>{blok.nameLabel}</label>
                            <input type="text" name={"name"}
                                   value={name}
                                   onChange={(e) => {
                                       setName(e.target.value)
                                   }}
                            />
                            <div className={styles.parts}>
                                <div className="">
                                    <label htmlFor={"phone"}>{blok.phoneLabel}</label>
                                    <PhoneInput  name={"phone"} onChange={setPhone} value={phone} required={true}/>
                                    {/*<input type="text" name={"phone"}*/}
                                    {/*       value={phone}*/}
                                    {/*       onChange={(e) => {*/}
                                    {/*           setPhone(e.target.value)*/}
                                    {/*       }}*/}
                                    {/*/>*/}
                                </div>
                                <div className="">
                                    <label htmlFor={"email"}>{blok.emailLabel}</label>
                                    <input type="text" name={"email"}
                                           value={email}
                                           onChange={(e) => {
                                               setEmail(e.target.value)
                                           }}
                                    />
                                </div>

                            </div>

                            <div className="">
                                <label htmlFor={"message"}>{blok.massageLabel}</label>
                                <input type={'text'} name={"message"}
                                       value={message}
                                       onChange={(e) => {
                                           setMessage(e.target.value)
                                       }}
                                />
                            </div>
                            <div className={"flex mb-2"}>
                                <Turnstile
                                    sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                                    onSuccess={(token) => setCaptchaToken(token)}
                                />
                            </div>
                            <div className="flex flex-col lg:flex-row gap-7 xl:gap-11">
                                <button type={'submit'} disabled={disable}>{blok.buttonLabel}</button>
                                <div className={styles.text}>{render(blok.text)}</div>
                            </div>

                        </form>
                    ) : sended === true ? (
                        <div className={styles.success}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"
                                 width="100px" height="100px">
                                <path d="M 25 2 C 12.317 2 2 12.317 2 25 C 2 37.683 12.317 48 25 48 C 37.683 48 48
                                37.683 48 25 C 48 20.44 46.660281 16.189328 44.363281 12.611328 L 42.994141 14.228516
                                C 44.889141 17.382516 46 21.06 46 25 C 46 36.579 36.579 46 25 46 C 13.421 46 4 36.579
                                4 25 C 4 13.421 13.421 4 25 4 C 30.443 4 35.393906 6.0997656 39.128906 9.5097656 L
                                40.4375 7.9648438 C 36.3525 4.2598437 30.935 2 25 2 z M 43.236328 7.7539062 L 23.914062
                                30.554688 L 15.78125 22.96875 L 14.417969 24.431641 L 24.083984 33.447266 L 44.763672
                                9.046875 L 43.236328 7.7539062 z" fill="#FFDA2B"/>
                            </svg>
                            <div className={styles.successText}>
                                Заявка успешно отправлена, с Вами свяжутся в ближайшее время.
                            </div>
                        </div>

                    ) : (
                        <div className={styles.error}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="100px"
                                 height="100px">
                                <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C
                                37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534
                                4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25
                                C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969
                                16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234
                                15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969
                                32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969
                                33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031
                                17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z" fill="black"/>
                            </svg>
                            <div className={styles.errorText}>
                                Не удалось отправить заявку, пожалуйста попробуйте позже
                            </div>
                            <button onClick={()=>{
                                setSended('');
                            }}>
                                Попробывать еще раз
                            </button>
                        </div>

                    )}


                </div>
            </div>
        </section>
    );
};


export default FormContact;