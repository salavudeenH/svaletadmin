"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Clock, PiggyBank, Settings, AlertTriangle } from "lucide-react";

const baseTabs = [
  { href: "/voiturier", label: "Courses", icon: Car },
  { href: "/voiturier/creneaux", label: "Mes créneaux", icon: Clock },
  { href: "/voiturier/bloquantes", label: "Bloquantes", icon: AlertTriangle },
  { href: "/voiturier/cagnotte", label: "Cagnotte", icon: PiggyBank },
  { href: "/voiturier/parametres", label: "Paramètres", icon: Settings },
];

export default function TabsNav({ bloquantesCount = 0 }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex z-20"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {baseTabs.map(({ href, label, icon: Icon }) => {
        const active = href === "/voiturier" ? pathname === "/voiturier" : pathname.startsWith(href);
        const showBadge = href === "/voiturier/bloquantes" && bloquantesCount > 0;
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 pt-2.5 pb-2 text-xs font-medium ${
              active ? "text-brand" : "text-gray-400"
            }`}
          >
            <span className={`relative flex items-center justify-center w-10 h-7 rounded-full ${active ? "bg-brand-light" : ""}`}>
              <Icon size={20} />
              {showBadge && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {bloquantesCount}
                </span>
              )}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
