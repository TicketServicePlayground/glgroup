import React from 'react';
import {storyblokEditable} from "@/lib/storyblokCompat";
import {render} from 'storyblok-rich-text-react-renderer';
import parse from 'html-react-parser';
import styles from './UI.module.scss';
const Text = ({blok}) => {

    return (
        <div className={styles.text}  {...storyblokEditable(blok)} >
            {render(blok.richText)}
        </div>
    );
};


export default Text;