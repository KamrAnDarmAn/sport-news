'use client'
import { useState } from "react";
// import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, Flame, LogOut, PenLine, LogIn } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";
// import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./theme-toggle";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const path = usePathname()
  const isAdmin = false;
  const user = null;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border ">
      <div className="container flex h-16 items-center justify-between mx-auto">
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

        <div className="hidden lg:flex items-center gap-2">
          {isAdmin && (
            <Button asChild size="sm" variant="outline" className="gap-1.5">
              <Link href="/create"><PenLine className="w-4 h-4" />Write</Link>
            </Button>
          )}
          {user ? (
            <Button size="sm" variant="ghost" onClick={async () => { }} className="gap-1.5">
              <LogOut className="w-4 h-4" />Sign out
            </Button>
          ) : (
            <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow gap-1.5">
              <Link href="/auth"><LogIn className="w-4 h-4" />Sign in</Link>
            </Button>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>


      {open && (
        <nav className="lg:hidden border-t border-border bg-card animate-fade-in ">
          <div className="container py-4 flex flex-col gap-1 mx-auto">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={
                  cn(
                    "px-4 py-3 rounded-lg text-sm font-semibold transition-smooth",
                    path === l.href ? "bg-gradient-primary text-primary-foreground" : "hover:bg-muted"
                  )
                }
              >
                {l.name}
              </Link>
            ))}
            <div className="border-t border-border pt-2 mt-2 flex flex-col gap-1">
              {isAdmin && <Link href="/create" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold hover:bg-muted">✍️ Write a post</Link>}
              {user ? (
                <button onClick={async () => { }} className="text-left px-4 py-3 rounded-lg text-sm font-semibold hover:bg-muted">Sign out</button>
              ) : (
                <Link href="/auth" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold bg-gradient-primary text-primary-foreground">Sign in</Link>
              )}
            </div>
          </div>
        </nav>
      )}
      {/* <ModeToggle /> */}
    </header>
  );
};
