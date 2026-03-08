const API_URL = process.env.API_URL || 'http://localhost:8081';
const SPACE = 'glgroup';

export async function getCategory(locale) {
    try {
        const datasource = locale === 'ru' ? 'category' : 'categoryen';

        const url = new URL(`${API_URL}/front/cms/datasources/${SPACE}/${datasource}`);
        url.searchParams.set('locale', locale);

        const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
        if (!res.ok) return { data: { datasource_entries: [] } };
        const entries = await res.json();
        return {
            data: {
                datasource_entries: entries.map(e => ({
                    name: e.name,
                    value: e.value,
                    dimension_value: e.value,
                }))
            }
        };
    } catch {
        return { data: { datasource_entries: [] } };
    }
}
