
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Radar, Network, History, LayoutDashboard, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Scam Detector", href: "/scams", icon: Radar },
  { name: "Currency Analyzer", href: "/currency", icon: Shield },
  { name: "Fraud Network", href: "/network", icon: Network },
  { name: "Activity", href: "/history", icon: History },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-16 flex items-center px-6 justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <Shield className="text-white w-6 h-6" />
        </div>
        <span className="headline text-xl font-bold tracking-tight text-white">
          RAKSHA <span className="text-primary">AI</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search cases..." 
            className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-48"
          />
        </div>
        <div className="w-8 h-8 rounded-full bg-secondary border border-white/10 flex items-center justify-center text-xs font-bold text-primary">
          AD
        </div>
      </div>
    </nav>
  );
}
