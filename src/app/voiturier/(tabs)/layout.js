"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Clock, PiggyBank, Settings } from "lucide-react";

const tabs = [
  { href: "/voiturier", label: "Courses", icon: Car },
  { href: "/voiturier/creneaux", label: "Mes créneaux", icon: Clock },
  { href: "/voiturier/cagnotte", label: "Cagnotte", icon: PiggyBank },
  { href: "/voiturier/parametres", label: "Paramètres", icon: Settings },
];

export default function VoiturierTabsLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {children}

      <nav
        className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex z-20"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/voiturier" ? pathname === "/voiturier" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 pt-2.5 pb-2 text-xs font-medium ${
                active ? "text-brand" : "text-gray-400"
              }`}
            >
              <span className={`flex items-center justify-center w-10 h-7 rounded-full ${active ? "bg-brand-light" : ""}`}>
                <Icon size={20} />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
