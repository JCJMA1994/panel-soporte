// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null;

const getSupabaseBrowserClient = () => {
    if (client) return client;
    
    // We provide fallbacks during SSR to avoid crashing the server if missing
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
        console.warn(" Missing Supabase credentials in client.ts!");
    }
    
    client = createBrowserClient(supabaseUrl, supabaseKey);
    return client;
}

// Proxies method calls to the lazy client so existing code like `supabase.from()` still works without modification
export const supabase = new Proxy({} as any, {
    get: (target, prop) => {
        return getSupabaseBrowserClient()[prop as keyof ReturnType<typeof createBrowserClient>];
    }
});