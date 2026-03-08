import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D3y13FJN.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_C2wX5bfF.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { C as Card, a as CardHeader, b as CardTitle, f as CardDescription, d as CardContent, I as Input, g as CardFooter, B as Button, s as supabase } from '../chunks/card_BFbSA1Em.mjs';
import { L as Label } from '../chunks/label_Dy9WebUW.mjs';
export { renderers } from '../renderers.mjs';

function AuthForm() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (isLoginView) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        const user = data.user;
        if (user) {
          const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", user.id).single();
          if (profileError) {
            console.error("Error al obtener el perfil del usuario:", profileError);
          }
          console.log("Rol obtenido desde la base de datos:", profile?.role);
          setMessage("¡Inicio de sesión exitoso! Redirigiendo...");
          setTimeout(() => {
            if (profile?.role === "administrador") {
              window.location.href = "/admin";
            } else {
              window.location.href = "/dashboard";
            }
          }, 500);
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        setMessage("¡Registro exitoso! Por favor, revisa tu correo para confirmar tu cuenta.");
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      setMessage(`Error: ${error.message}`);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-sm", children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: isLoginView ? "Iniciar Sesión" : "Crear Cuenta" }),
      /* @__PURE__ */ jsx(CardDescription, { children: isLoginView ? "Ingresa tus credenciales para acceder a tu panel." : "Ingresa tu correo y contraseña para registrarte." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs(CardContent, { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "email",
              type: "email",
              placeholder: "tu@email.com",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Contraseña" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "password",
              type: "password",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(CardFooter, { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx(Button, { className: "w-full", type: "submit", children: isLoginView ? "Ingresar" : "Registrarme" }),
        message && /* @__PURE__ */ jsx("p", { className: "text-sm text-center", children: message }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-center text-muted-foreground", children: [
          isLoginView ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "underline ml-1",
              onClick: (e) => {
                e.preventDefault();
                setIsLoginView(!isLoginView);
                setMessage("");
              },
              children: isLoginView ? "Regístrate" : "Inicia Sesión"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Acceso de Usuario | Soporte T\xE9cnico" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> ${renderComponent($$result2, "AuthForm", AuthForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/AuthForm", "client:component-export": "default" })} </main> ` })}`;
}, "D:/Proyectos/Android/panel-soporte/src/pages/login.astro", void 0);

const $$file = "D:/Proyectos/Android/panel-soporte/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Login,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
