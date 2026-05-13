'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pager } from "@/components/Pager";

interface Props {
    page: number;
    totalPages: number;
    paramName?: string;
}

export function SearchParamsPager({ page, totalPages, paramName = "page" }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const safeTotal = Math.max(1, totalPages);
    const current = Math.min(Math.max(1, page), safeTotal);

    return (
        <Pager
            page={current}
            total={safeTotal}
            onChange={(p) => {
                const next = new URLSearchParams(searchParams.toString());
                if (p <= 1) next.delete(paramName);
                else next.set(paramName, String(p));
                const q = next.toString();
                router.push(q ? `${pathname}?${q}` : pathname);
            }}
        />
    );
}
