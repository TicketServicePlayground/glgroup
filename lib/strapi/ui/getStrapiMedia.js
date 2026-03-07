export function getStrapiMedia(url){
    if(!url) return null;
    if(url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
}