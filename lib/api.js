const API_URL = process.env.API_URL || 'http://localhost:8081';
const SPACE = 'glgroup';

function parseBody(body) {
    if (!body) return {};
    if (typeof body === 'string') {
        try { return JSON.parse(body); } catch { return {}; }
    }
    return body;
}

function toStoryFormat(page) {
    const content = parseBody(page.body);
    return {
        content,
        slug: page.slug,
        name: page.slug,
        full_slug: page.slug,
        published_at: page.updatedAt,
        created_at: page.createdAt,
    };
}

function blogPostToStoryFormat(post) {
    return {
        content: {
            img: { filename: post.img || '', alt: post.imgAlt || '' },
            title: post.title || '',
            description: post.description || '',
            showAuthor: post.showAuthor || false,
            Author: { cached_url: post.authorSlug || '', linktype: 'story' },
            authorLabel: post.authorLabel || '',
            textBlocks: parseBody(post.textBlocks),
        },
        slug: post.slug,
        name: post.title,
        full_slug: post.slug,
        published_at: post.publishedAt || post.createdAt,
        created_at: post.createdAt,
    };
}

async function backendFetch(path, params = {}) {
    const url = new URL(`${API_URL}/${path}`);
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) {
            url.searchParams.set(k, String(v));
        }
    }
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Backend ${res.status}: ${res.statusText}`);
    }
    return await res.json();
}

export async function fetchData(slug, params = {}) {
    try {
        const locale = params.language === 'default' ? 'ru' : (params.language || 'en');

        // List query (empty slug with starts_with)
        if ((!slug || slug === '') && params.starts_with) {
            // Blog posts are in a dedicated table
            if (params.starts_with === 'blog/') {
                const category = params.category || params.filter_query?.Category?.in || undefined;
                const result = await backendFetch(
                    `front/cms/blog/${SPACE}`,
                    { locale, page: params.page || 1, perPage: params.per_page || 9, category }
                );
                if (!result) return null;
                return {
                    data: { stories: result.posts.map(blogPostToStoryFormat) },
                    total: result.total,
                };
            }
            const pages = await backendFetch(
                `front/cms/pages/${SPACE}/by-prefix`,
                { prefix: params.starts_with, locale }
            );
            if (!pages) return null;
            return { data: { stories: pages.map(toStoryFormat) } };
        }

        // Single page query
        const cleanSlug = (slug || 'index').replace(/^\//, '');
        const page = await backendFetch(
            `front/cms/pages/${SPACE}/by-slug`,
            { slug: cleanSlug, locale }
        );
        if (!page) return null;
        return { data: { story: toStoryFormat(page) } };
    } catch (error) {
        console.error('fetchData error:', error);
        return null;
    }
}

export async function getCurrencies(locale) {
    try {
        const entries = await backendFetch(
            `front/cms/datasources/${SPACE}/currency`,
            { locale }
        );
        if (!entries) return null;
        // Wrap in Storyblok-compatible format
        return {
            data: {
                datasource_entries: entries.map(e => ({
                    name: e.name,
                    value: e.value,
                    dimension_value: e.value,
                }))
            }
        };
    } catch (error) {
        console.error('getCurrencies error:', error);
        return null;
    }
}
