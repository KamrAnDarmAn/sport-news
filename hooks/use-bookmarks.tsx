'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export interface Bookmark {
    id: string;
    title: string;
    href: string;
    sport?: string;
    image?: string;
    excerpt?: string;
    savedAt: string;
}

interface Ctx {
    items: Bookmark[];
    has: (id: string) => boolean;
    toggle: (b: Omit<Bookmark, "savedAt">) => void;
    remove: (id: string) => void;
    clear: () => void;
}

const KEY = "pulse:bookmarks";
const C = createContext<Ctx | null>(null);

export const BookmarksProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<Bookmark[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(KEY);
            if (raw) setItems(JSON.parse(raw));
        } catch {
            /* ignore */
        }
    }, []);

    useEffect(() => {
        try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ }
    }, [items]);

    const has = useCallback((id: string) => items.some((b) => b.id === id), [items]);

    const toggle = useCallback((b: Omit<Bookmark, "savedAt">) => {
        setItems((prev) =>
            prev.some((x) => x.id === b.id)
                ? prev.filter((x) => x.id !== b.id)
                : [{ ...b, savedAt: new Date().toISOString() }, ...prev],
        );
    }, []);

    const remove = useCallback((id: string) => setItems((p) => p.filter((b) => b.id !== id)), []);
    const clear = useCallback(() => setItems([]), []);

    const value = useMemo(() => ({ items, has, toggle, remove, clear }), [items, has, toggle, remove, clear]);
    return <C.Provider value={value}>{children}</C.Provider>;
};

export const useBookmarks = () => {
    const ctx = useContext(C);

    if (!ctx) throw new Error("useBookmarks must be used inside BookmarksProvider");

    return ctx;
};
