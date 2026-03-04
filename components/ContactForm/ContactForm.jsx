'use client'
import React, {Suspense, useEffect, useState} from 'react';
import styles from './ContactForm.module.scss'
import {render} from 'storyblok-rich-text-react-renderer';
import Link from "next/link";
import {storyblokEditable} from "@/lib/storyblokCompat";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useLocale} from "next-intl";
import UTMParamsProvider from "@/components/UTMParamsProvider/UTMParamsProvider";
import clsx from "clsx";
import Turnstile from "react-turnstile";
import {useUserStore} from "@/src/store/userStore";
import 'react-phone-number-input/style.css';
import PhoneInput from "react-phone-number-input";


const ContactForm = ({blok, modal, mobile}) => {
    const [captchaToken, setCaptchaToken] = useState("");
    const local = useLocale();
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
        <section className={styles.block} id={'form'} {...storyblokEditable(blok)}>
            <div className="container py-20 lg:py-24">
                <div className={clsx( modal ? "lg:flex-row" : "flex-col lg:items-center", "flex gap-20 lg:gap-12 xl:gap-16")}>
                    <div className={styles.leftBlock}>
                        <h2>{blok.titleLeft}</h2>
                        {sended === '' ? (
                            <form onSubmit={sendMail}>
                                <label htmlFor={"name"}>{blok.nameLabel}</label>
                                <input type="text" name={"name"}
                                       value={name}
                                       onChange={(e) => {
                                           setName(e.target.value)
                                       }}
                                       required={true}
                                />
                                {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
                                <div className="flex flex-col lg:flex-row gap-5 mb-8 justify-between lg:mb-12">
                                    <div className="min-w-[45%]">
                                        <label htmlFor={"phone"}>{blok.phoneLabel}</label>
                                        <PhoneInput  name={"phone"} onChange={setPhone} value={phone} required={true}/>
                                        {/*<input type="text" name={"phone"}*/}
                                        {/*       value={phone}*/}
                                        {/*       onChange={(e) => {*/}
                                        {/*           setPhone(e.target.value)*/}
                                        {/*       }}*/}
                                        {/*       required={true}*/}
                                        {/*/>*/}
                                        {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
                                    </div>
                                    <div className="min-w-[45%]">
                                        <label htmlFor={"email"}>{blok.emailLabel}</label>
                                        <input type="text" name={"email"}
                                               value={email}
                                               onChange={(e) => {
                                                   setEmail(e.target.value)
                                               }}
                                               required={true}
                                        />
                                        {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
                                    </div>

                                </div>
                                <div className="mb-8 lg:mb-12">
                                    <label htmlFor={"message"}>{blok.messageLabel}</label>
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
                                    {local === 'ru' ? 'Заявка успешно отправлена, с Вами свяжутся в ближайшее время.'
                                        : "The application has been successfully sent. You will be contacted shortly."}
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
                                17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z" fill="#FFDA2B"/>
                                </svg>
                                <div className={styles.errorText}>
                                    {local === "ru" ? "Не удалось отправить заявку пожалуйста попробуйте позже"
                                        : "Failed to submit request please try again later"}

                                </div>
                                <button onClick={()=>{
                                    setSended('');
                                }}>
                                    {local === 'ru' ? "Попробывать еще раз"
                                        : "Try again"}

                                </button>
                            </div>

                        )}

                    </div>
                    {!mobile && (
                        <div className={clsx(styles.rightBlock, modal && styles.modal)}>
                            {modal ? (<div className={styles.line}></div>) : ""}
                            <div className={styles.contacts}>
                                <span className={styles.title}>{blok.titleRight}</span>
                                <div className={styles.socials}>
                                    <Link href={blok.telegramLink} className={styles.soc}>
                                        <i>
                                            <svg width="70" height="60" viewBox="0 0 20.0156 16.7865"
                                                 fill="none"
                                                 xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path id="Vector"
                                                      d="M18.6646 0.110352L0.934601 6.94739C-0.275391 7.43335 -0.268402 8.1084 0.712616 8.40942L5.26462 9.82935L15.7966 3.18433C16.2946 2.88135 16.7496 3.04443 16.3756 3.37634L7.84262 11.0774L7.84061 11.0774L7.84262 11.0784L7.52859 15.7704C7.98862 15.7704 8.19162 15.5593 8.44962 15.3104L10.6606 13.1604L15.2596 16.5574C16.1076 17.0244 16.7166 16.7844 16.9276 15.7723L19.9466 1.54443C20.2556 0.30542 19.4736 -0.255615 18.6646 0.110352Z"
                                                      fill="#FFFFFF" fillOpacity="1.000000" fillRule="nonzero"/>
                                            </svg>
                                        </i>
                                        {modal ? (<span>{blok.telegramLabel}</span>) : ""}
                                    </Link>
                                    <Link href={blok.whatsappLink} className={styles.soc}>
                                        <i>
                                            <svg width="75" height="75" viewBox="0 0 20.9905 20.968"
                                                 fill="none" xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path id="Vector"
                                                      d="M19.4169 4.85803C16.2819 -0.00195312 9.86188 -1.44202 4.89685 1.573C0.0518799 4.58801 -1.50812 11.158 1.62689 16.0031L1.8819 16.3931L0.831848 20.323L4.76184 19.2731L5.15186 19.528C6.84686 20.443 8.69189 20.968 10.5219 20.968C12.4869 20.968 14.4518 20.443 16.1469 19.3931C20.9919 16.243 22.4319 9.80798 19.4169 4.828L19.4169 4.85803ZM16.6719 14.968C16.1469 15.748 15.4869 16.2731 14.5719 16.408C14.0469 16.408 13.3868 16.663 10.7769 15.6281C8.55688 14.578 6.71185 12.868 5.40686 10.903C4.62689 9.98804 4.22186 8.80298 4.10187 7.61804C4.10187 6.56799 4.49188 5.65295 5.15186 4.99304C5.40686 4.73804 5.67688 4.60303 5.93188 4.60303L6.59186 4.60303C6.84686 4.60303 7.11688 4.60303 7.25189 5.12805C7.5069 5.78796 8.16687 7.36304 8.16687 7.49805C8.30188 7.63306 8.24188 8.63806 7.64185 9.20801C7.31189 9.58301 7.25189 9.59802 7.38684 9.86804C7.91187 10.6481 8.5719 11.443 9.21686 12.103C9.99689 12.7631 10.7919 13.288 11.7068 13.678C11.9619 13.813 12.2319 13.813 12.3669 13.543C12.5019 13.288 13.1469 12.6281 13.4169 12.358C13.6719 12.103 13.8069 12.103 14.0768 12.223L16.1769 13.2731C16.4319 13.408 16.7018 13.528 16.8369 13.663C16.9719 14.053 16.9719 14.578 16.7018 14.968L16.6719 14.968Z"
                                                      fill="#FFFFFF" fillOpacity="1.000000" fillRule="nonzero"/>
                                            </svg>
                                        </i>
                                        {modal ? (<span>{blok.whatsappLabel}</span>) : ""}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) }

                </div>
            </div>
        </section>
    );
};

export default ContactForm;