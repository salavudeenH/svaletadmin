"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, Car, Users, LogOut, Tag, Euro, Star, Package, ShieldAlert, MapPin, Clock, Wallet, Bell, Menu, X } from "lucide-react";
import { logoutAction } from "./actions";

const links = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard, fullAdminOnly: true },
  { href: "/reservations", label: "Réservations", icon: CalendarClock },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/valets", label: "Voituriers", icon: Car },
  { href: "/creneaux", label: "Créneaux", icon: Clock, fullAdminOnly: true },
  { href: "/paiement", label: "Paiement", icon: Wallet, fullAdminOnly: true },
  { href: "/promocodes", label: "Codes promo", icon: Tag, fullAdminOnly: true },
  { href: "/tarifs", label: "Tarifs", icon: Euro, fullAdminOnly: true },
  { href: "/options", label: "Options", icon: Package, fullAdminOnly: true },
  { href: "/parkings", label: "Parkings", icon: MapPin, fullAdminOnly: true },
  { href: "/reviews", label: "Avis clients", icon: Star },
  { href: "/users", label: "Utilisateurs", icon: Users, fullAdminOnly: true },
  { href: "/securite", label: "Sécurité", icon: ShieldAlert, fullAdminOnly: true },
];

function NavLinks({ links, pathname, notifCount, onNavigate }) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              active ? "bg-brand text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {label}
            {href === "/notifications" && notifCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-medium rounded-full px-2 py-0.5">
                {notifCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ role, notifCount = 0 }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const visibleLinks = role === "manager" ? links.filter((l) => !l.fullAdminOnly) : links;

  return (
    <>
      {/* Barre du haut mobile/tablette */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-ink text-white px-4 py-3">
        <span className="font-bold">Svalet Admin</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="relative p-2 -mr-2 rounded-lg hover:bg-white/10"
        >
          <Menu size={22} />
          {notifCount > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-red-500 rounded-full w-2 h-2" />
          )}
        </button>
      </div>

      {/* Tiroir mobile/tablette */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-ink text-white flex flex-col">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <span className="text-lg font-bold">Svalet Admin</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                className="p-2 -mr-2 rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
            <NavLinks links={visibleLinks} pathname={pathname} notifCount={notifCount} onNavigate={() => setOpen(false)} />
            <form action={logoutAction} className="px-3 py-4 border-t border-white/10">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </form>
          </aside>
        </div>
      )}

      {/* Sidebar fixe desktop */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-ink text-white flex-col min-h-screen sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-white/10">
          <span className="text-lg font-bold">Svalet Admin</span>
        </div>
        <NavLinks links={visibleLinks} pathname={pathname} notifCount={notifCount} />
        <form action={logoutAction} className="px-3 py-4 border-t border-white/10">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </form>
      </aside>
    </>
  );
}
