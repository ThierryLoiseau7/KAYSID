"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/",                        icon: Home,        label: "Akèy"    },
  { href: "/listings",                icon: Search,      label: "Chèche"  },
  { href: "/dashboard/new-listing",   icon: PlusCircle,  label: "Poste",  accent: true },
  { href: "/dashboard/favorites",     icon: Heart,       label: "Favori"  },
  { href: "/dashboard",               icon: User,        label: "Pwofil"  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {TABS.map(({ href, icon: Icon, label, accent }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-0",
                accent
                  ? "text-white bg-sunset-500 hover:bg-sunset-600 shadow-sm px-4"
                  : active
                  ? "text-caribbean-700"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <Icon className={cn("w-5 h-5", accent && "text-white")} />
              <span className={cn("text-[10px] font-medium leading-none", accent && "text-white")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
