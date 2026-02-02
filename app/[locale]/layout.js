import { Inter, Roboto } from "next/font/google";
import localFont from "next/font/local";
import clsx from "clsx";
import StoryblokProvider from "@/components/StoryblokProvider/StoryblokProvider";
import {GoogleTagManager, GoogleAnalytics}  from '@next/third-parties/google'

import hero from '/components/Hero/Hero';
import slider from '/components/Slider/Slider';
import twoBlock from "/components/TwoBlock/TwoBlock";
import StoryblokBridgeLoader from "@storyblok/react/bridge-loader";
import Page from '/components/Page';
import {fetchData} from "@/lib/api";
import Header from "/components/header/header";
import Menu from "/components/menu/menu";
import title from "/components/UI/title";
import ImageBlock from "/components/UI/image";
import Text from "/components/UI/text";
import Button from "/components/UI/button";
import Grid from "/components/Grid/Grid";
import GridItem from "/components/Grid/GridItem";
import SectionNumber from "/components/SectionNumber/SectionNumber";
import BlockWithArrow from "/components/BlockWithArrow/BlockWithArrow";
import Footer from "/components/Footer/Footer";
import OurPartners from "/components/OurPartners/OurPartners";
import OurRecomendations from "/components/OurRecomendations/OurRecomendations";
import ContactForm from "/components/ContactForm/ContactForm";
import OurCases from "/components/OurCases/OurCases";
import MobileMenu from "/components/MobileMenu/MobileMenu";
import {getPathname} from "@nimpl/getters/get-pathname";
import Section from "/components/Section/Section";
import NavMenu from "@/components/NavMenu/NavMenu";
import TwoGrids from "@/components/TwoGrids/twoGrids";
import Steps from "@/components/Steps/Steps";
import ContactMap from "@/components/ContactMap/ContactMap";
import GridWithImage from "@/components/GridWithImage/GridWithImage";
import GridImg from "@/components/GridWithImage/GridImg";
import Contact from "@/components/Contact/Contact";
import FormContact from "@/components/FormContact/FormContact";
import CookieAlert from "@/components/CookieAlert/CookieAlert";
import HeroAboutUs from "@/components/HeroAboutUs/HeroAboutUs";
import OurAdvantages from "@/components/OurAdvantages/OurAdvantages";
import History from "@/components/History/History";
import {NextIntlClientProvider} from "next-intl";
import {getMessages, unstable_setRequestLocale} from 'next-intl/server';
import Script from "next/script";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import UTMParamsProvider from "@/components/UTMParamsProvider/UTMParamsProvider";
import React, {Suspense} from "react";
import {ModalSec} from "@/components/Modal/ModalSec";
import ForModal from "@/components/ContactForm/forModal";
import ButtonCTA from "@/components/ButtonCTA/ButtonCTA";



const {
  StoryblokClient,
  apiPlugin,
  getStoryblokApi: getStoryblokApiDefault,
  storyblokInit
} = require("@storyblok/react/rsc");

let storyblokApi;

const AppStoryblokInit = () => {
  storyblokInit({
    accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    components:{
      page: Page,
      hero: hero,
      sliderMain: slider,
      twoBlock: twoBlock,
      title: title,
      imageBlock: ImageBlock,
      textBlock: Text,
      buttonBlock: Button,
      grid: Grid,
      gridItem: GridItem,
      sectionNumber: SectionNumber,
      blockWithArrow: BlockWithArrow,
      ourPartners: OurPartners,
      ourRecomendations: OurRecomendations,
      contactForm: ContactForm,
      ourCases: OurCases,
      section: Section,
      twoGrids: TwoGrids,
      steps: Steps,
      contactMap: ContactMap,
      gridWithImage: GridWithImage,
      gridImg: GridImg,
      contact: Contact,
      fromContact: FormContact,
      HeroAboutUs: HeroAboutUs,
      ourAdvantages: OurAdvantages,
      history: History,
      buttonCTA: ButtonCTA,
    },
  });

  return getStoryblokApiDefault();
};
export const getStoryblokApi = () => {
  if (storyblokApi !== undefined) return storyblokApi;
  return AppStoryblokInit();
};

const inter = Inter({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"] });
const locales = ['ru', 'en'];

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

const Formular = localFont({
  src: [
    {
      path: '../../fonts/Formular.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../../fonts/Formular-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../fonts/Formular-BlackItalic.woff2',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../../fonts/Formular-Bold.woff2',
      weight: 'bold',
      style: 'normal',
    },
    {
      path: '../../fonts/Formular-Italic.woff2',
      weight: 'normal',
      style: 'italic',
    },
    {
      path: '../../fonts/Formular-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../fonts/Formular-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../fonts/Formular-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../fonts/Formular-Medium.woff2',
      weight: '500',
      style: 'normal',
    },

  ],
  variable: '--font-formular',
});

const Gilroy = localFont({
  src: [
    {
      path: '../../fonts/Gilroy-Regular.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../../fonts/Gilroy-ExtraboldItalic.woff2',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../../fonts/Gilroy-Bold.woff2',
      weight: 'bold',
      style: 'normal',
    },
    {
      path: '../../fonts/Gilroy-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../fonts/Gilroy-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../fonts/Gilroy-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../fonts/Gilroy-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../fonts/Gilroy-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../fonts/Gilroy-BlackItalic.woff2',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../../fonts/Gilroy-UltraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../fonts/Gilroy-RegularItalic.woff2',
      weight: 'normal',
      style: 'italic',
    },
    {
      path: '../../fonts/Gilroy-SemiboldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../fonts/Gilroy-HeavyItalic.woff2',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../../fonts/Gilroy-Extrabold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../fonts/Gilroy-BoldItalic.woff2',
      weight: 'bold',
      style: 'italic',
    },
    {
      path: '../../fonts/Gilroy-UltraLightItalic.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../fonts/Gilroy-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../fonts/Gilroy-Heavy.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../fonts/Gilroy-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../fonts/Gilroy-ThinItalic.woff2',
      weight: '100',
      style: 'italic',
    },
  ],
  variable: '--font-gilroy',
})

export const metadata = {
  title: "GLGroup - start your business in Indonesia",
  description: "Good Luck Group start your business in Indonesia",
  icons: {
    icon: '/img/logo.svg',
  },
  metadataBase: new URL(process.env.SITE_URL),
};
export const revalidate = 3600;
export default async function LocalLayout({ children, params}) {
 // console.log();
  unstable_setRequestLocale(params.locale);
  const global = await fetchData('global', {version: 'draft', language: params.locale})
  const contactForm = await fetchData('blog-contact', {version: 'draft', language: params.locale})

  const footer = {
    title: global.data.story?.content?.title,
    description: global.data.story?.content?.description,
    contactLabel: global.data.story?.content?.contactLabel,
    contactLink: global.data.story?.content?.contactLink,
    navigationLabel: global.data.story?.content?.navigationLabel,
    homeLinkLabel: global.data.story?.content?.homeLinkLabel,
    copyright: global.data.story?.content?.copyright,
    privacyLabel: global.data.story?.content?.privacyLabel,
    privacyLink: global.data.story?.content?.privacyLink,
    offerLabel: global.data.story?.content?.offerLabel,
    offerLink: global.data.story?.content?.offerLink,
    contactUsLabel: global.data.story?.content?.contactUsLabel,
    address: global.data.story?.content?.address,
    linksMenu: global.data.story?.content?.linksMenu,
  };
  const headMenu = global.data.story?.content.linkMenu[0];
  const menu = global.data.story?.content.linkMenu[1];

  return (
      <StoryblokProvider>
        <html lang={params.locale}>
          <body className={clsx(inter.className, Gilroy.variable, Formular.variable)}>
          <script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              async
              defer
          ></script>
          <GoogleTagManager gtmId={"GTM-W94Q2T3S"}/>
          <GoogleAnalytics gaId="G-F5H6Q18BRV" />
          <NextIntlClientProvider locale={params.locale}>
            <Suspense fallback={null}>
              <UTMParamsProvider />
            </Suspense>
            <NavMenu headMenu={headMenu} menu={menu} contact={contactForm}/>
            {children}
            <footer className={'bg-[#3B604E]'}>
              <Footer links={headMenu} sitename={menu?.siteName} footer={footer}/>
            </footer>
            <ScrollToTop />
            <CookieAlert data={global.data.story.content.CookieMessage} />
            <ForModal locale={params.locale} />
          </NextIntlClientProvider>
          <Script id={'clarity-script'} strategy={'afterInteractive'}  dangerouslySetInnerHTML={{
            __html: `        
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "mjo1zuxhv7");
            `
          }} />
          </body>
          <StoryblokBridgeLoader options={{resolveRelations: ["article.author"] }} />
        </html>
      </StoryblokProvider>
  );
}
