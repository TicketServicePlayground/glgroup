import React from 'react';
import ServerDynamicComponent from "@/components/ServerDynamicComponent";
import {storyblokEditable} from "@/lib/storyblokCompat";

export default function PageServer({blok}) {
    return (
        <main {...storyblokEditable(blok)}>
            {blok.body.map((nestedBlok) => (
                <ServerDynamicComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
        </main>
    );
}
