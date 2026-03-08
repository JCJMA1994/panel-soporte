import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D3y13FJN.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_C2wX5bfF.mjs';
import { c as createSupabaseServerClient } from '../chunks/server_5i4tAfjZ.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { Ticket, LayoutDashboard, Users, BookOpen, UserSquare2, Settings, LogOut, Search, Bell, Plus, Filter } from 'lucide-react';
import { c as cn, I as Input, B as Button, s as supabase, C as Card, a as CardHeader, b as CardTitle, d as CardContent } from '../chunks/card_BFbSA1Em.mjs';
import { useState } from 'react';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, S as Select, f as SelectTrigger, g as SelectValue, h as SelectContent, i as SelectItem } from '../chunks/select_rgfq7xqF.mjs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Ticket, label: "Tickets", href: "/admin", active: true },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: BookOpen, label: "Knowledge Base", href: "/admin/kb" }
];
const systemItems = [
  { icon: UserSquare2, label: "Technicians", href: "/admin/technicians" },
  { icon: Settings, label: "Settings", href: "/admin/settings" }
];
function AdminSidebar({ user }) {
  return /* @__PURE__ */ jsxs("aside", { className: "w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col pt-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 mb-8 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-[#1D7AFC] rounded-lg flex items-center justify-center text-white font-bold", children: /* @__PURE__ */ jsx(Ticket, { className: "h-5 w-5 rotate-[-45deg]" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-slate-900 font-bold leading-none", children: "SupportOS" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 font-medium", children: "Admin Console" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "flex-1 px-3 space-y-8", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "space-y-1", children: navItems.map((item) => /* @__PURE__ */ jsxs(
        "a",
        {
          href: item.href,
          className: cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            item.active ? "bg-[#EBF3FF] text-[#1D7AFC]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          ),
          children: [
            /* @__PURE__ */ jsx(item.icon, { className: cn("h-4 w-4", item.active ? "text-[#1D7AFC]" : "text-slate-400") }),
            item.label
          ]
        },
        item.label
      )) }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "px-3 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "System" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-1", children: systemItems.map((item) => /* @__PURE__ */ jsxs(
          "a",
          {
            href: item.href,
            className: "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors",
            children: [
              /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4 text-slate-400" }),
              item.label
            ]
          },
          item.label
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-slate-100 bg-slate-50/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xs uppercase", children: user?.email?.substring(0, 2) || "AD" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-900 truncate", children: "Alex Rivera" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 truncate", children: "Senior Lead" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "text-slate-400 hover:text-slate-600 transition-colors", children: /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }) })
    ] }) })
  ] });
}

function AdminHeader({ totalTickets = 1284 }) {
  return /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-slate-900", children: "Ticket Management" }),
      /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-full", children: [
        totalTickets.toLocaleString(),
        " Total"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-96", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Search by Ticket ID, Customer or Issue Summary...",
            className: "pl-10 bg-slate-50 border-none ring-offset-transparent focus-visible:ring-1 focus-visible:ring-slate-200 h-10 w-full"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "text-slate-500 hover:text-slate-900 overflow-visible relative", children: [
          /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsx("span", { className: "absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { className: "bg-[#1D7AFC] hover:bg-[#1565D8] text-white gap-2 px-4 shadow-sm h-10", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: "Create New Ticket" })
        ] })
      ] })
    ] })
  ] });
}

const statusColors = {
  "Abierto": "bg-orange-50 text-orange-600 border-orange-100",
  "En Proceso": "bg-blue-50 text-blue-600 border-blue-100",
  "Resuelto": "bg-green-50 text-green-600 border-green-100",
  "Cerrado": "bg-slate-50 text-slate-500 border-slate-100",
  "Open": "bg-orange-50 text-orange-600 border-orange-100",
  "In Progress": "bg-blue-50 text-blue-600 border-blue-100",
  "Resolved": "bg-green-50 text-green-600 border-green-100"
};
const priorityColors = {
  "Alta": "bg-red-50 text-red-600 border-red-100",
  "Media": "bg-blue-50 text-blue-600 border-blue-100",
  "Baja": "bg-slate-50 text-slate-500 border-slate-100",
  "Urgent": "bg-red-50 text-red-600 border-red-100",
  "High": "bg-orange-50 text-orange-600 border-orange-100",
  "Low": "bg-slate-50 text-slate-500 border-slate-100",
  "Medium": "bg-blue-50 text-blue-600 border-blue-100"
};
function AdminTicketManager({ initialTickets }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [updatingId, setUpdatingId] = useState(null);
  const handleStatusChange = async (ticketId, newStatus) => {
    setUpdatingId(ticketId);
    const { error } = await supabase.from("tickets").update({ status: newStatus }).eq("id", ticketId);
    if (error) {
      console.error("Error al actualizar el estado:", error);
    } else {
      setTickets(
        (currentTickets) => currentTickets.map(
          (ticket) => ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
    }
    setUpdatingId(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mt-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50", children: [
          "All Status ",
          /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50", children: [
          "All Priority ",
          /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50", children: [
          "All Technicians ",
          /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-2 bg-white border border-slate-200 rounded-lg text-slate-500 cursor-pointer hover:bg-slate-50", children: /* @__PURE__ */ jsx(Filter, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "bg-slate-50/30", children: /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-transparent border-slate-100", children: [
        /* @__PURE__ */ jsx(TableHead, { className: "w-[120px] font-bold text-slate-400 text-[10px] uppercase tracking-wider", children: "Ticket ID" }),
        /* @__PURE__ */ jsx(TableHead, { className: "font-bold text-slate-400 text-[10px] uppercase tracking-wider", children: "Customer" }),
        /* @__PURE__ */ jsx(TableHead, { className: "font-bold text-slate-400 text-[10px] uppercase tracking-wider", children: "Issue Summary" }),
        /* @__PURE__ */ jsx(TableHead, { className: "font-bold text-slate-400 text-[10px] uppercase tracking-wider", children: "Priority" }),
        /* @__PURE__ */ jsx(TableHead, { className: "font-bold text-slate-400 text-[10px] uppercase tracking-wider", children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { className: "font-bold text-slate-400 text-[10px] uppercase tracking-wider", children: "Technician" }),
        /* @__PURE__ */ jsx(TableHead, { className: "font-bold text-slate-400 text-[10px] uppercase tracking-wider", children: "Date Created" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: tickets.map((ticket) => /* @__PURE__ */ jsxs(TableRow, { className: "border-slate-100 hover:bg-slate-50/50", children: [
        /* @__PURE__ */ jsxs(TableCell, { className: "font-bold text-[#1D7AFC] text-sm", children: [
          "#",
          ticket.id
        ] }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600", children: ticket.profiles?.[0]?.full_name?.substring(0, 2).toUpperCase() || "CU" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-900 text-sm", children: ticket.profiles?.[0]?.full_name || ticket.profiles?.[0]?.email || "N/A" })
        ] }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "max-w-[200px] truncate text-slate-600 text-sm", children: ticket.title }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold border",
          priorityColors[ticket.priority] || "bg-slate-50 text-slate-600"
        ), children: ticket.priority }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(
          Select,
          {
            defaultValue: ticket.status,
            onValueChange: (newStatus) => handleStatusChange(ticket.id, newStatus),
            disabled: updatingId === ticket.id,
            children: [
              /* @__PURE__ */ jsxs(SelectTrigger, { className: cn(
                "h-7 w-fit gap-2 border-none font-bold text-[10px] px-2 rounded-full",
                statusColors[ticket.status] || "bg-slate-50 text-slate-600"
              ), children: [
                /* @__PURE__ */ jsx("div", { className: cn(
                  "w-1.5 h-1.5 rounded-full",
                  ticket.status === "Abierto" ? "bg-orange-500" : ticket.status === "En Proceso" ? "bg-blue-500" : ticket.status === "Resuelto" ? "bg-green-500" : "bg-slate-400"
                ) }),
                /* @__PURE__ */ jsx(SelectValue, {})
              ] }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "Abierto", children: "Open" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "En Proceso", children: "In Progress" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "Resuelto", children: "Resolved" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "Cerrado", children: "Closed" })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-slate-400 text-sm italic", children: "Unassigned" }),
        /* @__PURE__ */ jsx(TableCell, { className: "text-slate-500 text-sm font-medium", children: new Date(ticket.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) })
      ] }, ticket.id)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "Showing 1 to ",
        tickets.length,
        " of ",
        tickets.length,
        " tickets"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg opacity-50", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center bg-[#1D7AFC] text-white rounded-lg", children: "1" }),
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer", children: "2" }),
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer", children: "3" }),
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) })
      ] })
    ] })
  ] });
}
function ChevronDown(props) {
  return /* @__PURE__ */ jsx("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" }) });
}
function ChevronLeft(props) {
  return /* @__PURE__ */ jsx("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m15 18-6-6 6-6" }) });
}
function ChevronRight(props) {
  return /* @__PURE__ */ jsx("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m9 18 6-6-6-6" }) });
}

function AdminAppointmentList({ initialAppointments }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [updatingId, setUpdatingId] = useState(null);
  const handleStatusChange = async (apptId, newStatus, apptDetails) => {
    setUpdatingId(apptId);
    const { error } = await supabase.from("appointments").update({ status: newStatus }).eq("id", apptId);
    if (error) {
      console.error("Error al actualizar la cita:", error);
    } else {
      setAppointments((current) => current.map((appt) => appt.id === apptId ? { ...appt, status: newStatus } : appt));
      await supabase.functions.invoke("notify-appointment", {
        body: { type: "email", appointment: { ...apptDetails, status: newStatus } }
      });
    }
    setUpdatingId(null);
  };
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Citas Solicitadas" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Cliente" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Fecha y Hora" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Notas" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Estado" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: appointments.map((appt) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: appt.profiles?.[0]?.full_name || appt.profiles?.[0]?.email || "N/A" }),
        /* @__PURE__ */ jsx(TableCell, { children: format(new Date(appt.appointment_date), "Pp", { locale: es }) }),
        /* @__PURE__ */ jsx(TableCell, { children: appt.notes || "Sin notas" }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(
          Select,
          {
            defaultValue: appt.status,
            onValueChange: (newStatus) => handleStatusChange(appt.id, newStatus, appt),
            disabled: updatingId === appt.id,
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "Solicitada", children: "Solicitada" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "Confirmada", children: "Confirmada" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "Cancelada", children: "Cancelada" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "Reprogramar", children: "Reprogramar" })
              ] })
            ]
          }
        ) })
      ] }, appt.id)) })
    ] }) })
  ] });
}

const $$Astro = createAstro();
const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Admin;
  let errorMessage = "";
  let allTickets = [];
  let allAppointments = [];
  let profile = null;
  let user = null;
  try {
    const supabase = createSupabaseServerClient(Astro2.cookies);
    const { data: userData } = await supabase.auth.getUser();
    user = userData?.user;
    if (!user) {
      console.log("[ADMIN.ASTRO] No user found in session, redirecting to /login");
    } else {
      const { data: profileData, error: profileError } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      profile = profileData;
      console.log(`[ADMIN.ASTRO] User ID: ${user.id}, Profile:`, profile, `Error:`, profileError);
      if (!profile || profile.role !== "administrador") {
        console.log("[ADMIN.ASTRO] Profile is not admin, redirecting to /dashboard");
      } else {
        const { data: ticketsData } = await supabase.from("tickets").select(
          `
                id, created_at, title, status, priority,
                profiles ( full_name, email )
            `
        ).order("created_at", { ascending: false });
        allTickets = ticketsData || [];
        const { data: apptData } = await supabase.from("appointments").select(
          `
                id, appointment_date, notes, status,
                profiles ( full_name, email )
            `
        ).order("appointment_date", { ascending: true });
        let apptsToRender2 = allAppointments;
      }
    }
  } catch (error) {
    console.error("FATAL ERROR IN ADMIN.ASTRO:", error);
    errorMessage = error?.message || String(error);
  }
  if (!user && !errorMessage) {
    return Astro2.redirect("/login");
  }
  if (user && profile?.role !== "administrador" && !errorMessage) {
    return Astro2.redirect("/dashboard");
  }
  let ticketsToRender = allTickets || [];
  let apptsToRender = allAppointments || [];
  return renderTemplate`${errorMessage ? renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Error en Servidor" }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="flex items-center justify-center min-h-screen bg-slate-50"><div class="bg-white p-8 rounded-xl border border-red-200 shadow-md max-w-2xl w-full text-center"><div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">!</div><h1 class="text-2xl font-bold text-slate-800 mb-2">Error Crítico del Servidor</h1><p class="text-slate-500 mb-6">Ha ocurrido un error inesperado al procesar la solicitud en Vercel.</p><div class="bg-red-50 text-red-800 p-4 rounded-lg text-left overflow-auto font-mono text-sm">${errorMessage}</div></div></div>` })}` : renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Console | SupportOS" }, { "default": async ($$result2) => renderTemplate`<div class="flex min-h-screen bg-[#F8FAFC]"><!-- Sidebar -->${renderComponent($$result2, "AdminSidebar", AdminSidebar, { "user": user, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/AdminSidebar", "client:component-export": "default" })}<!-- Main Content Area --><div class="flex-1 flex flex-col min-w-0 overflow-hidden"><!-- Header -->${renderComponent($$result2, "AdminHeader", AdminHeader, { "totalTickets": allTickets?.length || 0, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/AdminHeader", "client:component-export": "default" })}<!-- Content --><main class="flex-1 overflow-y-auto p-8"><div class="max-w-[1600px] mx-auto space-y-8">${renderComponent($$result2, "AdminTicketManager", AdminTicketManager, { "initialTickets": ticketsToRender, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/AdminTicketManager", "client:component-export": "default" })}<section class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-bold text-slate-800">
Próximas Citas
</h2></div>${renderComponent($$result2, "AdminAppointmentList", AdminAppointmentList, { "initialAppointments": apptsToRender, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/AdminAppointmentList", "client:component-export": "default" })}</section></div></main></div></div>` })}`}`;
}, "D:/Proyectos/Android/panel-soporte/src/pages/admin.astro", void 0);

const $$file = "D:/Proyectos/Android/panel-soporte/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Admin,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
