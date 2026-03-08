import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D3y13FJN.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_C2wX5bfF.mjs';
import { c as createSupabaseServerClient } from '../chunks/server_5i4tAfjZ.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { B as Button, s as supabase, c as cn, C as Card, a as CardHeader, b as CardTitle, d as CardContent, I as Input, e as buttonVariants } from '../chunks/card_BFbSA1Em.mjs';
import * as React from 'react';
import { useState } from 'react';
import { L as Label } from '../chunks/label_Dy9WebUW.mjs';
import { S as Select, f as SelectTrigger, g as SelectValue, h as SelectContent, i as SelectItem, T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from '../chunks/select_rgfq7xqF.mjs';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, Calendar as Calendar$1, Loader2 } from 'lucide-react';
import { getDefaultClassNames, DayPicker } from 'react-day-picker';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
export { renderers } from '../renderers.mjs';

function LogoutButton() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error);
    } else {
      window.location.href = "/login";
    }
  };
  return /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: handleLogout, children: "Cerrar Sesión" });
}

function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}

function TicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Media");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("Error: Debes iniciar sesión para crear un ticket.");
      setIsSubmitting(false);
      return;
    }
    const { error } = await supabase.from("tickets").insert({
      title,
      description,
      priority,
      client_id: user.id
      // Asociamos el ticket al usuario logueado
    });
    if (error) {
      setMessage(`Error al crear el ticket: ${error.message}`);
    } else {
      setMessage("¡Ticket creado exitosamente!");
      setTitle("");
      setDescription("");
      setPriority("Media");
      window.location.reload();
    }
    setIsSubmitting(false);
  };
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Crear Nuevo Ticket de Soporte" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "Título" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "title",
            value: title,
            onChange: (e) => setTitle(e.target.value),
            placeholder: "Ej: El monitor no enciende",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Descripción" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "description",
            value: description,
            onChange: (e) => setDescription(e.target.value),
            placeholder: "Describe el problema con más detalle..."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "priority", children: "Prioridad" }),
        /* @__PURE__ */ jsxs(Select, { onValueChange: setPriority, defaultValue: "Media", children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona una prioridad" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "Baja", children: "Baja" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Media", children: "Media" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "Alta", children: "Alta" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, children: isSubmitting ? "Enviando..." : "Enviar Ticket" }),
      message && /* @__PURE__ */ jsx("p", { className: "text-sm pt-2", children: message })
    ] }) })
  ] });
}

function TicketList({ tickets }) {
  if (!tickets || tickets.length === 0) {
    return /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Mis Tickets" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { children: "Aún no has creado ningún ticket." }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Mis Tickets" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Título" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Prioridad" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Estado" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Fecha" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: tickets.map((ticket) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: ticket.title }),
        /* @__PURE__ */ jsx(TableCell, { children: ticket.priority }),
        /* @__PURE__ */ jsx(TableCell, { children: ticket.status }),
        /* @__PURE__ */ jsx(TableCell, { children: new Date(ticket.created_at).toLocaleDateString() })
      ] }, ticket.id)) })
    ] }) })
  ] });
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      formatters: {
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-popover inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-md bg-accent",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsx(
            "div",
            {
              "data-slot": "calendar",
              ref: rootRef,
              className: cn(className2),
              ...props2
            }
          );
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsx(ChevronLeftIcon, { className: cn("size-4", className2), ...props2 });
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsx(
              ChevronRightIcon,
              {
                className: cn("size-4", className2),
                ...props2
              }
            );
          }
          return /* @__PURE__ */ jsx(ChevronDownIcon, { className: cn("size-4", className2), ...props2 });
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsx("td", { ...props2, children: /* @__PURE__ */ jsx("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }) });
        },
        ...components
      },
      ...props
    }
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsx(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}

function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    PopoverPrimitive.Content,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}

function AppointmentForm() {
  const [date, setDate] = useState(void 0);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      setMessage("Por favor, selecciona una fecha y una hora.");
      return;
    }
    setIsSubmitting(true);
    setMessage("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("Error: Debes iniciar sesión.");
      setIsSubmitting(false);
      return;
    }
    const [hours, minutes] = time.split(":");
    const appointmentDate = new Date(date);
    appointmentDate.setHours(parseInt(hours), parseInt(minutes));
    const { error } = await supabase.from("appointments").insert({
      appointment_date: appointmentDate.toISOString(),
      notes,
      client_id: user.id
    });
    if (error) {
      setMessage(`Error al solicitar la cita: ${error.message}`);
    } else {
      setMessage("¡Cita solicitada exitosamente! Nos pondremos en contacto para confirmar.");
      setDate(void 0);
      setTime("");
      setNotes("");
    }
    setIsSubmitting(false);
  };
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Solicitar una Cita" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { children: "Fecha" }),
        /* @__PURE__ */ jsxs(Popover, { children: [
          /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: `w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar$1, { className: "mr-2 h-4 w-4" }),
                date ? format(date, "PPP", { locale: es }) : /* @__PURE__ */ jsx("span", { children: "Selecciona una fecha" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(PopoverContent, { className: "w-auto p-0", children: /* @__PURE__ */ jsx(
            Calendar,
            {
              mode: "single",
              selected: date,
              onSelect: setDate,
              initialFocus: true,
              disabled: (day) => day < new Date((/* @__PURE__ */ new Date()).setDate((/* @__PURE__ */ new Date()).getDate() - 1))
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "time", children: "Hora" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "time",
            type: "time",
            value: time,
            onChange: (e) => setTime(e.target.value),
            className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "notes", children: "Notas Adicionales" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "notes",
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            placeholder: "Describe brevemente el motivo de la cita (opcional)"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: isSubmitting, children: [
        isSubmitting && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
        isSubmitting ? "Solicitando..." : "Solicitar Cita"
      ] }),
      message && /* @__PURE__ */ jsx("p", { className: "text-sm pt-2", children: message })
    ] }) })
  ] });
}

const $$Astro = createAstro();
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const supabase = createSupabaseServerClient(Astro2.cookies);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    console.log("[DASHBOARD.ASTRO] No user found in session, redirecting to /login");
    return Astro2.redirect("/login");
  }
  const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  console.log(`[DASHBOARD.ASTRO] User ID: ${user.id}, Profile:`, profile, `Error:`, error);
  if (profile?.role === "administrador") {
    console.log("[DASHBOARD.ASTRO] Profile is admin, redirecting to /admin");
    return Astro2.redirect("/admin");
  }
  let userTickets = [];
  const { data: tickets } = await supabase.from("tickets").select("id, created_at, title, status, priority").eq("client_id", user.id).order("created_at", { ascending: false });
  if (tickets) {
    userTickets = tickets;
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Mi Panel de Control" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-muted/40 min-h-screen p-4 sm:p-8"> <div class="max-w-7xl mx-auto space-y-8"> <header class="flex justify-between items-center"> <div> <h1 class="text-3xl font-bold">Panel de Cliente</h1> <p class="text-muted-foreground">
Bienvenido, <span class="font-semibold">${user?.email}</span> </p> </div> ${renderComponent($$result2, "LogoutButton", LogoutButton, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/LogoutButton", "client:component-export": "default" })} </header> <main class="grid lg:grid-cols-3 gap-8"> <div class="space-y-4"> ${renderComponent($$result2, "TicketForm", TicketForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/TicketForm", "client:component-export": "default" })} </div> <div class="space-y-4"> ${renderComponent($$result2, "TicketList", TicketList, { "tickets": userTickets })} </div> <div class="space-y-4"> ${renderComponent($$result2, "AppointmentForm", AppointmentForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/AppointmentForm", "client:component-export": "default" })} </div> </main> </div> </div> ` })}`;
}, "D:/Proyectos/Android/panel-soporte/src/pages/dashboard.astro", void 0);

const $$file = "D:/Proyectos/Android/panel-soporte/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Dashboard,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
