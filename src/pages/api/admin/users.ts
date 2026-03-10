export const prerender = false;

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
    try {
        // 1. Obtener todos los perfiles
        const { data: profiles, error: profilesError } = await supabaseAdmin
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (profilesError) throw profilesError;

        // Idealmente también traeríamos datos de auth.users si quisiéramos más detalles,
        // pero con profiles tenemos la info principal (email, full_name, role).

        return new Response(JSON.stringify({ users: profiles }), {
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

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { email, password, role, first_name, last_name, dni, area } = body;

        if (!email || !password || !role) {
            return new Response(JSON.stringify({ error: "Faltan datos requeridos (email, password o role)." }), { status: 400 });
        }

        if (!dni || !/^\d{8}$/.test(dni)) {
            return new Response(JSON.stringify({ error: "El DNI debe contener exactamente 8 números." }), { status: 400 });
        }

        // Verificar si el DNI ya existe
        const { data: existingUser, error: dniError } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("dni", dni)
            .limit(1);

        if (dniError) {
            return new Response(JSON.stringify({ error: "Error al verificar el DNI." }), { status: 500 });
        }

        if (existingUser && existingUser.length > 0) {
            return new Response(JSON.stringify({ error: "El DNI ingresado ya está registrado en el sistema." }), { status: 400 });
        }

        // 1. Crear el usuario en Auth usando supabaseAdmin superior
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true, // Auto confirmar correo
            user_metadata: { first_name, last_name, dni, area }
        });

        if (authError) throw authError;

        if (authData.user) {
            // 2. Insertar o actualizar su perfil (el trigger ya debe haberlo creado como 'cliente', 
            // pero lo actualizaremos inmediatamente al rol que queremos.
            const { error: profileError } = await supabaseAdmin
                .from("profiles")
                .upsert({
                    id: authData.user.id,
                    email: email,
                    role: role,
                    first_name: first_name,
                    last_name: last_name,
                    dni: dni,
                    area: area,
                    full_name: `${first_name} ${last_name}`.trim()
                });

            if (profileError) {
                // Si falla actualizar perfil, podríamos eliminarlo en auth para limpiar
                await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
                throw profileError;
            }
        }

        return new Response(JSON.stringify({ success: true, user: authData.user }), {
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

export const DELETE: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('id');

        if (!userId) {
            return new Response(JSON.stringify({ error: "Se requiere un ID de usuario." }), { status: 400 });
        }

        // La tabla profiles borrará su fila por el ON DELETE CASCADE
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
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
