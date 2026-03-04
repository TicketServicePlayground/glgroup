import { fetchData } from "@/lib/api";

export async function fetchBlog(page) {
    let sbParams = {
        version: "published",
        starts_with: 'blog/',
        page: page,
        per_page: 9
    };

    return await fetchData('', sbParams);
}
