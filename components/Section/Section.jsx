import React from 'react';
import {storyblokEditable} from "@/lib/storyblokCompat";
import DynamicComponent from "@/components/DynamicComponent";

const Section = ({blok}) => {
    return (
        <section {...storyblokEditable(blok)}>
            <div className="container pb-20 lg:pb-24">
                {blok?.content && blok.content.map((e, _uid)=>(
                    <DynamicComponent blok={e} key={_uid}/>
                ))}
            </div>
        </section>
    );
};


export default Section;