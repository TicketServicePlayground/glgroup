import { Inter } from "next/font/google";
import localFont from "next/font/local";
import clsx from "clsx";
import {GoogleTagManager, GoogleAnalytics}  from '@next/third-parties/google'

import {fetchData} from "@/lib/api";
import Footer from "/components/Footer/Footer";
import NavMenu from "@/components/NavMenu/NavMenu";
import CookieAlert from "@/components/CookieAlert/CookieAlert";
import {NextIntlClientProvider} from "next-intl";
import {unstable_setRequestLocale} from 'next-intl/server';
import Script from "next/script";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import UTMParamsProvider from "@/components/UTMParamsProvider/UTMParamsProvider";
import React, {Suspense} from "react";
import ForModal from "@/components/ContactForm/forModal";

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
  metadataBase: new URL(process.env.SITE_URL || 'https://localhost:3000'),
};
export const dynamic = 'force-dynamic';
export default async function LocalLayout({ children, params}) {
 // console.log();
  unstable_setRequestLocale(params.locale);
  const allowedLocales = ["ru", "en", "id"];

  const locale = allowedLocales.includes(params.locale)
      ? params.locale
      : "en";

  const [global, contactForm] = await Promise.all([
    fetchData('global', { language: locale }),
    fetchData('blog-contact', { language: locale }),
  ]);

  const globalContent = global?.data?.story?.content || {};
  const topMenu = globalContent.linkMenu?.[0] || {};
  const secondMenu = globalContent.linkMenu?.[1] || {};

  function resolveLink(link) {
    if (!link) return '';
    if (typeof link === 'string') return link;
    return link.cached_url || link.url || '';
  }

  function mapLinks(links = []) {
    return links.map(item => ({
      label: item.label,
      link: resolveLink(item.link),
      contact: item.contact || false,
    }));
  }

  const headMenu = {
    links: mapLinks(topMenu.links),
    socials: (topMenu.socials || []).map(s => ({
      name: s.nameSoc,
      link: resolveLink(s.link),
    })),
    whatsappNumber: topMenu.whatsappNumber || '',
    whatsappLabel: topMenu.numberWhatsapp || '',
    imageWhatsapp: { url: topMenu.imageWhatsapp?.filename || '', alternativeText: '' },
    icon: { url: topMenu.iconBlack?.filename || '', alternativeText: '' },
    mail: topMenu.label || '',
  };

  const menu = {
    siteName: secondMenu.siteName || '',
    siteDescription: secondMenu.siteDescription || '',
    links: mapLinks(secondMenu.links),
  };

  const footer = {
    title: globalContent.title || '',
    description: globalContent.description || '',
    contactLabel: globalContent.contactLabel || '',
    contactLink: resolveLink(globalContent.contactLink),
    navigationLabel: globalContent.navigationLabel || '',
    homeLinkLabel: globalContent.homeLinkLabel || '',
    copyright: globalContent.copyright || '',
    privacyLabel: globalContent.privacyLabel || '',
    privacyLink: resolveLink(globalContent.privacyLink),
    offerLabel: globalContent.offerLabel || '',
    offerLink: resolveLink(globalContent.offerLink),
    contactUsLabel: globalContent.contactUsLabel || '',
    address: globalContent.address || '',
    linksMenu: mapLinks(globalContent.linksMenu),
  };


  return (
        <html lang={locale}>
          <body className={clsx(inter.className, Gilroy.variable, Formular.variable)}>
          <script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              async
              defer
          ></script>
          <GoogleTagManager gtmId={"GTM-W94Q2T3S"}/>
          <GoogleAnalytics gaId="G-F5H6Q18BRV" />
          <NextIntlClientProvider locale={locale}>
            <Suspense fallback={null}>
              <UTMParamsProvider />
            </Suspense>
            <NavMenu headMenu={headMenu} menu={menu} contact={contactForm}/>
            {children}
            <footer className={'bg-[#3B604E]'}>
              <Footer links={headMenu} sitename={menu?.siteName} footer={footer}/>
            </footer>
            <ScrollToTop />
            <CookieAlert data={global?.data?.story?.content?.CookieMessage} />
            <ForModal locale={locale} />
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
        </html>
  );
}
