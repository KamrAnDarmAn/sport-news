'use client'
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SITE_NAME = "Pulse";
const SITE_URL = typeof window !== "undefined" ? window.location.origin : "https://pulse.app";
const DEFAULT_OG = `${SITE_URL}/og-default.jpg`;

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: "website" | "article";
    canonical?: string;
    noIndex?: boolean;
    /** JSON-LD object(s) to inject as <script type="application/ld+json"> */
    jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (!el) {
        el = document.createElement("meta");
        Object.entries(attrs).forEach(([k, v]) => k !== "content" && el!.setAttribute(k, v));
        document.head.appendChild(el);
    }
    el.setAttribute("content", attrs.content);
};

const upsertLink = (rel: string, href: string) => {
    let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
    }
    el.setAttribute("href", href);
};

const JSONLD_ID = "seo-jsonld";
const setJsonLd = (data?: Record<string, unknown> | Record<string, unknown>[]) => {
    document.querySelectorAll(`script[data-seo="${JSONLD_ID}"]`).forEach((n) => n.remove());
    if (!data) return;
    const arr = Array.isArray(data) ? data : [data];
    arr.forEach((d) => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.dataset.seo = JSONLD_ID;
        s.text = JSON.stringify(d);
        document.head.appendChild(s);
    });
};

export const SEO = ({
    title,
    description = "Pulse — trending sports news, club rankings, and in-depth articles across every game you love.",
    image = DEFAULT_OG,
    type = "website",
    canonical,
    noIndex = false,
    jsonLd,
}: SEOProps) => {
    const pathname = usePathname();
    const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Live Sports News, Rankings & Articles`;
    const url = canonical || `${SITE_URL}${pathname}`;

    useEffect(() => {
        document.title = fullTitle;
        upsertMeta('meta[name="description"]', { name: "description", content: description });
        upsertMeta('meta[name="robots"]', { name: "robots", content: noIndex ? "noindex,nofollow" : "index,follow" });

        // Open Graph
        upsertMeta('meta[property="og:title"]', { property: "og:title", content: fullTitle });
        upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
        upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
        upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
        upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
        upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });

        // Twitter
        upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
        upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: fullTitle });
        upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
        upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });

        // Canonical
        upsertLink("canonical", url);

        // JSON-LD
        setJsonLd(jsonLd);

        return () => setJsonLd(undefined);
    }, [fullTitle, description, image, type, url, noIndex, jsonLd]);

    return null;
};

export const breadcrumbJsonLd = (items: { name: string; href: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: `${SITE_URL}${it.href}`,
    })),
});

export const newsArticleJsonLd = (a: {
    title: string;
    description?: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
    authorName?: string;
    url: string;
}) => ({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.description,
    image: a.image ? [a.image] : undefined,
    datePublished: a.datePublished,
    dateModified: a.dateModified || a.datePublished,
    author: [{ "@type": "Person", name: a.authorName || "Pulse Editorial" }],
    publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
    },
    mainEntityOfPage: a.url,
});
