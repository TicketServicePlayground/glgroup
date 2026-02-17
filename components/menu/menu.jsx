import React from 'react';
import Link from "next/link";
import clsx from "clsx";
import {useLocale} from "next-intl";
import Modal from "@/components/Modal/Modal";

export default function Menu ({menu, type, contactFrom}) {
    const locale = useLocale();

    return (
        <div className={clsx('container hidden lg:flex justify-end mt-6', type ? 'text-black' : 'text-white')}>
            <div className={'flex lg:gap-5 xl:gap-10 py-2.5 items-center font-gilroy font-bold text-base xl:text-lg'}>
                {menu?.links && menu.links.map((e, _uid)=>(

                    !e.contact ?
                            <Link href={e.link} key={_uid} className={clsx(!e.contact && type ? 'hover:bg-text-green-active' :'hover:bg-text-yellow-active', e.contact && !type && 'border-yellow-active text-yellow-active border rounded-3xl lg:px-2.5 lg:py-2 xl:px-3 xl:py-2.5 hover:bg-yellow-active hover:text-black', e.contact && type && 'border-green-active text-green-active border rounded-3xl lg:px-2.5 lg:py-2 xl:px-3 xl:py-2.5 hover:bg-green-active hover:text-black')}>
                                {e.label}
                            </Link>
                        :
                        <React.Fragment key={_uid}>
                            <Modal  object={e} uid={_uid} type={type} contactForm={contactFrom}/>
                        </React.Fragment>


                   ))}
            </div>
        </div>

    );
};
