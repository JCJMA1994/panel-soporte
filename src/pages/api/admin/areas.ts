export const prerender = false;

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    try {
        const { data: areas, error } = await supabaseAdmin
            .from("areas")
            .select("id, nombre")
            .order("nombre", { ascending: true });

        if (error) throw error;

        return new Response(JSON.stringify({ areas }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
