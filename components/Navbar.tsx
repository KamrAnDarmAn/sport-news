'use client';

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";

import { Menu, X, Flame, LogOut, PenLine, LogIn, Bookmark, LayoutDashboard } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";
// import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/GlobalSearch";
import { signOutUser } from "@/lib/actions/auth.actions";
import { useSession } from "next-auth/react";
import { canPublish } from "@/lib/authz";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user ? session.user.role === 'ADMIN' : false;
  const bookmarks = []

  const signOut = () => {
    signOutUser();
  }



  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border ">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-smooth">
            <Flame className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-black tracking-tight">PULSE<span className="text-gradient-primary">.</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 mx-auto">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                cn(
                  "px-4 py-2 text-sm font-semibold rounded-full transition-smooth relative",
                  pathname === l.href
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
          <GlobalSearch />
          <Button asChild size="sm" variant="ghost" className="gap-1.5 relative">
            <Link href="/bookmarks" aria-label="Bookmarks">
              <Bookmark className="w-4 h-4" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-black flex items-center justify-center">
                  {bookmarks.length}
                </span>
              )}
            </Link>
          </Button>
          {user && (
            <Button asChild size="sm" variant="ghost" className="gap-1.5" aria-label="Dashboard">
              <Link href="/dashboard"><LayoutDashboard className="w-4 h-4" /></Link>
            </Button>
          )}
          {canPublish(session?.user.role) && (
            <>
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <Link href="/editorial">Editorial</Link>
              </Button>
              {/* <Button asChild size="sm" variant="outline" className="gap-1.5">
                <Link href="/create"><PenLine className="w-4 h-4" />Write</Link>
              </Button> */}
            </>
          )}
          {user ? (
            <Button size="sm" variant="destructive" onClick={async () => { await signOut(); router.replace("/"); }} className="gap-1.5 cursor-pointer  ">
              <LogOut className="w-4 h-4" />
              {/* Sign out */}
            </Button>
          ) : (
            <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow gap-1.5">
              <Link href="/auth"><LogIn className="w-4 h-4" />Sign in</Link>
            </Button>
          )}
        </div>

        <div className="lg:hidden flex items-center gap-1">
          <GlobalSearch />
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>


      {open && (
        <nav className="lg:hidden border-t border-border bg-card animate-fade-in px-4">
          <div className="container py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={
                  cn(
                    "px-4 py-3 rounded-lg text-sm font-semibold transition-smooth",
                    pathname === l.href ? "bg-gradient-primary text-primary-foreground" : "hover:bg-muted"
                  )
                }
              >
                {l.name}
              </Link>
            ))}
            <div className="border-t border-border pt-2 mt-2 flex flex-col gap-1">
              {user && <Link href="/dashboard" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold hover:bg-muted">📊 Dashboard</Link>}
              <Link href="/bookmarks" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold hover:bg-muted">🔖 Bookmarks {bookmarks.length > 0 && <span className="ml-1 text-xs text-primary">({bookmarks.length})</span>}</Link>
              {canPublish(session?.user.role) && <Link href="/editorial" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold hover:bg-muted">📋 Editorial</Link>}
              {canPublish(session?.user.role) && <Link href="/roles" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold hover:bg-muted">🛡️ Roles</Link>}
              {canPublish(session?.user.role) && <Link href="/create" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold hover:bg-muted">✍️ Write a post</Link>}
              {user ? (
                <button onClick={async () => { await signOut(); setOpen(false); /* router.push('/') */ }} className="text-left px-4 py-3 rounded-lg text-sm font-semibold hover:bg-muted">Sign out</button>
              ) : (
                <Link href="/auth" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold bg-gradient-primary text-primary-foreground">Sign in</Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};
