export function getStrapiMedia(url){
    if(!url) return null;

    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
}