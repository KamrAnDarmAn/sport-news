import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export interface Crumb { name: string; href: string; }

export const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
    <nav aria-label="Breadcrumb" className="container pt-6 ">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <li>
                <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground transition-smooth">
                    <Home className="w-3.5 h-3.5" /> Home
                </Link>
            </li>
            {items.map((c, i) => {
                const last = i === items.length - 1;
                return (
                    <li key={c.href} className="inline-flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3" />
                        {last ? (
                            <span aria-current="page" className="font-semibold text-foreground">{c.name}</span>
                        ) : (
                            <Link href={c.href} className="hover:text-foreground transition-smooth">{c.name}</Link>
                        )}
                    </li>
                );
            })}
        </ol>
    </nav>
);
