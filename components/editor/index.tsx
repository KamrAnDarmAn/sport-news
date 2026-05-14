"use client";

import type { ForwardedRef, ReactNode } from "react";
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  CodeToggle,
  InsertCodeBlock,
  codeBlockPlugin,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  ListsToggle,
  linkDialogPlugin,
  CreateLink,
  InsertImage,
  InsertTable,
  tablePlugin,
  imagePlugin,
  codeMirrorPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  Separator,
  InsertThematicBreak,
  diffSourcePlugin,
  thematicBreakPlugin,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import "@mdxeditor/editor/style.css";
import "./dark-editor.css";

export type { MDXEditorMethods };

export type StoryEditorProps = {
  markdown: string;
  onChange: (markdown: string) => void;
  editorRef?: ForwardedRef<MDXEditorMethods | null>;
  className?: string;
  contentEditableClassName?: string;
  placeholder?: ReactNode;
};

export default function StoryEditor({
  markdown,
  onChange,
  editorRef,
  className,
  contentEditableClassName,
  placeholder,
}: StoryEditorProps) {
  const { resolvedTheme } = useTheme();
  const themeExtension = resolvedTheme === "light" ? [] : [basicDark];

  return (
    <MDXEditor
      key={resolvedTheme ?? "dark"}
      markdown={markdown}
      ref={editorRef}
      onChange={(md) => onChange(md)}
      placeholder={placeholder}
      className={cn(
        "dark-editor min-h-[480px] w-full rounded-none border-0 bg-background",
        className,
      )}
      contentEditableClassName={cn(
        "prose prose-invert max-w-none px-4 py-3 font-sans text-sm leading-relaxed focus:outline-none",
        contentEditableClassName,
      )}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            css: "CSS",
            txt: "Plain text",
            sql: "SQL",
            html: "HTML",
            sass: "Sass",
            scss: "SCSS",
            bash: "Bash",
            json: "JSON",
            js: "JavaScript",
            ts: "TypeScript",
            "": "Unspecified",
            tsx: "TypeScript (React)",
            jsx: "JavaScript (React)",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: themeExtension,
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <Separator />
                      <BoldItalicUnderlineToggles />
                      <CodeToggle />
                      <Separator />
                      <ListsToggle />
                      <Separator />
                      <CreateLink />
                      <InsertImage />
                      <Separator />
                      <InsertTable />
                      <InsertThematicBreak />
                      <Separator />
                      <InsertCodeBlock />
                    </>
                  ),
                },
              ]}
            />
          ),
        }),
      ]}
    />
  );
}
