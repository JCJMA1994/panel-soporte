-- scripts/fix_recursion.sql

-- 1. Primero, eliminamos la política conflictiva que genera el bucle en "profiles"
DROP POLICY IF EXISTS "Los administradores pueden ver todos los perfiles" ON public.profiles;

-- 2. Aseguramos que la función "is_admin" sea a prueba de bucles.
-- Al usar SECURITY DEFINER con "SET search_path = public" y "LANGUAGE sql", 
-- forzamos a PostgreSQL a no disparar RLS (saltando las políticas) al evaluar esta condición.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'administrador'
  );
$$;

-- 3. Finalmente, recreamos la política. 
-- Como "is_admin()" ya no dispara el RLS, no habrá bucle infinito.
CREATE POLICY "Los administradores pueden ver todos los perfiles" 
  ON public.profiles FOR SELECT 
  USING (public.is_admin());
