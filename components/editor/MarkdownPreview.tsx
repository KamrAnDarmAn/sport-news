"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  source: string;
  emptyMessage?: string;
};

/**
 * Client-side markdown preview (create flow). Server story pages use {@link Preview} instead.
 */
export function MarkdownPreview({
  source,
  emptyMessage = "Nothing to preview yet.",
}: Props) {
  const trimmed = source.trim();
  if (!trimmed) {
    return (
      <div className="text-center text-muted-foreground py-16">{emptyMessage}</div>
    );
  }

  return (
    <article className="prose prose-invert max-w-none prose-p:text-foreground/90 prose-headings:text-foreground prose-a:text-primary prose-pre:bg-muted/80 prose-code:text-foreground prose-blockquote:border-primary prose-strong:text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{trimmed}</ReactMarkdown>
    </article>
  );
}
