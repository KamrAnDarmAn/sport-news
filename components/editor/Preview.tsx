import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

export const Preview = ({ content }: { content: string }) => {
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

  return (
    <section className="markdown prose grid break-words">
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
};
