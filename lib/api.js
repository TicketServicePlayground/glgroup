const API_URL = process.env.API_URL || 'http://localhost:8081';
const SPACE = 'glgroup';

function parseBody(body) {
    if (!body) return {};
    if (typeof body === 'string') {
        try { return JSON.parse(body); } catch { return {}; }
    }
    return body;
}

function parseBreadcrumbs(body) {
    if (!body) return [];
    if (typeof body === 'string') {
        try {
            const parsed = JSON.parse(body);
            return Array.isArray(parsed) ? parsed : [];
        } catch { return []; }
    }
    return Array.isArray(body) ? body : [];
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
            textBlocks: parseBreadcrumbs(post.textBlocks),
            metaTitle: post.metaTitle || '',
            metaDescription: post.metaDescription || '',
            metaImage: post.metaImage ? { filename: post.metaImage } : null,
            metaImageAlt: post.metaImageAlt || '',
            breadcrumbs: parseBreadcrumbs(post.breadcrumbs),
        },
        slug: post.slug,
        name: post.title,
        full_slug: post.locale + '/blog/' + post.slug,
        published_at: post.publishedAt || post.createdAt,
        created_at: post.createdAt,
    };
}

function authorToStoryFormat(author) {
    return {
        content: {
            fullname: author.fullname || '',
            photo: { filename: author.photo || '', alt: author.photoAlt || '' },
            information: parseBody(author.information),
            informationLabel: author.informationLabel || '',
            postLabel: author.postLabel || '',
            socials: parseBreadcrumbs(author.socials),
            postLinks: parseBreadcrumbs(author.postLinks),
            metaTitle: author.fullname || '',
            metaDescription: '',
            metaImage: author.photo ? { filename: author.photo } : null,
            metaImageAlt: author.photoAlt || '',
            breadcrumbs: [],
        },
        slug: author.slug,
        name: author.fullname,
        full_slug: author.slug,
        published_at: author.updatedAt,
        created_at: author.createdAt,
    };
}

function showcaseItemToStoryFormat(item) {
    return {
        content: {
            img: { filename: item.img || '', alt: item.imgAlt || '' },
            title: item.title || '',
            description: item.description || '',
            textBlocks: parseBreadcrumbs(item.textBlocks),
            metaTitle: item.metaTitle || '',
            metaDescription: item.metaDescription || '',
            metaImage: item.metaImage ? { filename: item.metaImage } : null,
            metaImageAlt: item.metaImageAlt || '',
            breadcrumbs: parseBreadcrumbs(item.breadcrumbs),
        },
        slug: item.slug,
        name: item.title,
        full_slug: item.locale + '/showcase/' + item.slug,
        published_at: item.publishedAt || item.createdAt,
        created_at: item.createdAt,
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
            if (params.starts_with === 'showcase/') {
                const items = await backendFetch(`front/cms/showcase/${SPACE}`, { locale });
                if (!items) return null;
                return { data: { stories: items.map(showcaseItemToStoryFormat) } };
            }
            const pages = await backendFetch(
                `front/cms/pages/${SPACE}/by-prefix`,
                { prefix: params.starts_with, locale }
            );
            if (!pages) return null;
            return { data: { stories: pages.map(toStoryFormat) } };
        }

        // Single slug routing by prefix
        const cleanSlug = (slug || 'index').replace(/^\//, '');

        if (cleanSlug.startsWith('blog/')) {
            const postSlug = cleanSlug.slice('blog/'.length);
            const post = await backendFetch(`front/cms/blog/${SPACE}/by-slug`, { slug: postSlug, locale });
            if (!post) return null;
            return { data: { story: blogPostToStoryFormat(post) } };
        }

        if (cleanSlug.startsWith('authors/')) {
            const authorSlug = cleanSlug.slice('authors/'.length);
            const author = await backendFetch(`front/cms/authors/${SPACE}/by-slug`, { slug: authorSlug, locale });
            if (!author) return null;
            return { data: { story: authorToStoryFormat(author) } };
        }

        if (cleanSlug.startsWith('showcase/') && cleanSlug !== 'showcase/index') {
            const itemSlug = cleanSlug.slice('showcase/'.length);
            const item = await backendFetch(`front/cms/showcase/${SPACE}/by-slug`, { slug: itemSlug, locale });
            if (!item) return null;
            return { data: { story: showcaseItemToStoryFormat(item) } };
        }

        // Default: CMS pages table
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
