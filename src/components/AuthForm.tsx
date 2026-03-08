// src/components/AuthForm.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthForm() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(''); // Limpiar mensajes anteriores

        try {
            if (isLoginView) {
                // Lógica de Inicio de Sesión
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                // --- MEJORA DE REDIRECCIÓN ---
                // Usamos el usuario que ya nos devolvió el login
                const user = data.user;
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single();

                    setMessage('¡Inicio de sesión exitoso! Redirigiendo...');

                    setTimeout(() => {
                        if (profile?.role === 'administrador') {
                            window.location.href = '/admin';
                        } else {
                            window.location.href = '/dashboard';
                        }
                    }, 500);
                }
            } else {
                // Lógica de Registro
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('¡Registro exitoso! Por favor, revisa tu correo para confirmar tu cuenta.');
            }
        } catch (error: any) {
            console.error("Error en la autenticación:", error);
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">{isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}</CardTitle>
                    <CardDescription>
                        {isLoginView
                            ? 'Ingresa tus credenciales para acceder a tu panel.'
                            : 'Ingresa tu correo y contraseña para registrarte.'}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" type="submit">
                            {isLoginView ? 'Ingresar' : 'Registrarme'}
                        </Button>
                        {message && <p className="text-sm text-center">{message}</p>}
                        <p className="text-sm text-center text-muted-foreground">
                            {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                            <a
                                href="#"
                                className="underline ml-1"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsLoginView(!isLoginView);
                                    setMessage('');
                                }}
                            >
                                {isLoginView ? 'Regístrate' : 'Inicia Sesión'}
                            </a>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}