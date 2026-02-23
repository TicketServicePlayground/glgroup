import { createClient } from "@supabase/supabase-js";

let _supabase;

export function getSupabase() {
    if (!_supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error("Missing Supabase environment variables");
        }

        _supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
    return _supabase;
}

export const supabase = new Proxy({}, {
    get(_, prop) {
        return getSupabase()[prop];
    }
});
