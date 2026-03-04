const API_URL = process.env.API_URL || 'http://localhost:8081';
const SPACE = 'glgroup';

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const lang = searchParams.get('lang');
    const query = searchParams.get('query');
    const locale = lang === 'ru' ? 'ru' : (lang || 'en');

    const url = new URL(`${API_URL}/front/cms/pages/${SPACE}/by-prefix`);
    url.searchParams.set('prefix', 'blog/');
    url.searchParams.set('locale', locale);

    const res = await fetch(url.toString());
    if (!res.ok) {
        return Response.json([], { status: res.status });
    }
    const pages = await res.json();

    // Convert to story format and filter by search query
    const searchLower = (query || '').toLowerCase();
    const stories = pages
        .map(p => {
            let content = p.body;
            if (typeof content === 'string') {
                try { content = JSON.parse(content); } catch { content = {}; }
            }
            return {
                content,
                slug: p.slug,
                name: p.slug,
                full_slug: p.slug,
                published_at: p.updatedAt,
                created_at: p.createdAt,
            };
        })
        .filter(s => {
            if (!searchLower) return true;
            const title = (s.content.title || '').toLowerCase();
            return title.includes(searchLower);
        });

    // Client-side pagination
    const perPage = 9;
    const pageNum = parseInt(page) || 1;
    const start = (pageNum - 1) * perPage;
    const paginated = stories.slice(start, start + perPage);

    return Response.json(paginated);
}
