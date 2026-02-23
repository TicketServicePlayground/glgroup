import qs from 'qs'

export async function fetchStrapi({
  path,
  method = "GET",
  query,
  body,
  revalidate = 60,
}) {
    const apiKey = process.env.STRAPI_ACCESS_TOKEN;
    const baseUrl = process.env.STRAPI_URL;

    if (!baseUrl) {
        console.warn("STRAPI_URL not defined, skipping fetch");
        return { data: null };
    }

    let queryString = query ? `?${qs.stringify(query, {encodeValuesOnly: true})}` : "";

    const url = `${baseUrl}${path}${queryString}`;
    console.log(url);

    const res = await fetch(url, {
        method,
        headers: {
            'Content-type': 'application/json',
            ...(apiKey ? {Authorization: `Bearer ${apiKey}`} : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        next: {revalidate},
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Strapi error ${res.status}: ${errorText}`);
    }

    return res.json();

}