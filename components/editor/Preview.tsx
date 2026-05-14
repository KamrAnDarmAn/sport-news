import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

type Props = {
  content: string;
  className?: string;
};

/**
 * Server-rendered markdown/MDX for published stories (aligned with editor output).
 */
export function Preview({ content, className }: Props) {
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

  return (
    <section
      className={cn(
        "markdown max-w-none break-words prose prose-invert max-w-none prose-p:text-foreground/90 prose-headings:text-foreground prose-a:text-primary prose-pre:bg-muted/80 prose-code:text-foreground prose-blockquote:border-primary prose-strong:text-foreground",
        className,
      )}
    >
      <MDXRemote
        source={formattedContent}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSanitize],
          },
        }}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark-200"
            />
          ),
        }}
      />
    </section>
  );
}
