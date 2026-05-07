'use client'
import { useState } from "react";
import { Menu, X, Flame } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  const path = usePathname();

  return (
    <header className="sticky px-4 top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-smooth">
            <Flame className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-black tracking-tight">PULSE<span className="text-gradient-primary">.</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                cn(
                  "px-4 py-2 text-sm font-semibold rounded-full transition-smooth relative",
                  path === l.href
                    ? "text-primary-foreground bg-gradient-primary shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              {l.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border bg-card animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 rounded-lg text-sm font-semibold transition-smooth",
                    isActive ? "bg-gradient-primary text-primary-foreground" : "hover:bg-muted"
                  )
                }
              >
                {l.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
