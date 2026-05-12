"use client";

import { useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/PageHeader";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SPORT_LIST } from "@/lib/sports-data";
import {
  Bold,
  Italic,
  Quote,
  List,
  Heading2,
  Link2,
  Image as ImageIcon,
  Code,
  Eye,
  Save,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createStory } from "@/lib/actions/story.actions";
import {
  CreateStoryFormSchema,
  type CreateStoryFormValues,
} from "@/lib/validations/story-validations";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

const READ_WPM = 220;

// Tiny markdown-ish renderer for preview
const renderMarkdown = (md: string) => {
  const escape = (s: string) =>
    s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
  const html = escape(md)
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-black mt-6 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-black mt-6 mb-3">$1</h1>')
    .replace(
      /^&gt; (.+)$/gm,
      '<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">$1</blockquote>'
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted text-xs">$1</code>')
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a class="text-primary underline" href="$2" target="_blank" rel="noreferrer">$1</a>'
    )
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc">$1</li>')
    .replace(/\n\n/g, "</p><p class=\"my-3\">");
  return `<p class="my-3">${html}</p>`;
};

const FORM_ID = "create-story-form";

export default function CreateArticle() {
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user ? session.user.role === "ADMIN" : false;
  const loading = false;
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const router = useRouter();

  const form = useForm<CreateStoryFormValues>({
    resolver: zodResolver(CreateStoryFormSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      cover_image_url: "",
      sport: "",
      type: "article",
    },
  });

  const titleWatch = form.watch("title");
  const excerptWatch = form.watch("excerpt");
  const contentWatch = form.watch("content");

  const wordCount = useMemo(
    () => contentWatch.trim().split(/\s+/).filter(Boolean).length,
    [contentWatch]
  );
  const readingTime = Math.max(1, Math.round(wordCount / READ_WPM));
  const slugPreview = slugify(titleWatch) || "your-story-slug";

  if (loading)
    return <div className="container py-20 text-muted-foreground">Loading…</div>;
  if (!user) {
    redirect("/auth");
    return null;
  }
  if (!isAdmin) {
    return (
      <div className="container py-20 max-w-xl">
        <SEO title="Editor — Access denied" noIndex />
        <Card className="p-8 text-center">
          <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Editors only</h2>
          <p className="text-muted-foreground">
            Only editors with admin privileges can publish posts. Ask an admin to grant you the role.
          </p>
        </Card>
      </div>
    );
  }

  const wrap = (before: string, after = before, placeholder = "text") => {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = form.getValues("content");
    const sel = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + sel + after + value.slice(end);
    form.setValue("content", next, { shouldDirty: true, shouldValidate: true });
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + sel.length;
    });
  };

  const insertLine = (prefix: string) => {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const before = form.getValues("content").slice(0, start);
    const after = form.getValues("content").slice(start);
    const lineStart = before.lastIndexOf("\n") + 1;
    const full = form.getValues("content");
    const next = full.slice(0, lineStart) + prefix + full.slice(lineStart);
    form.setValue("content", next, { shouldDirty: true, shouldValidate: true });
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + prefix.length;
    });
    void after;
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 6) setTags([...tags, t]);
    setTagInput("");
  };

  const processSubmit = async (data: CreateStoryFormValues, asDraft: boolean) => {
    setSaving(true);
    try {
      const result = await createStory({
        ...data,
        published: !asDraft,
        topic: tags.length > 0 ? tags.join(", ") : undefined,
      });

      console.log('RESULT: ', result)

      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }

      toast.success(asDraft ? "Draft saved" : "Published!");
      router.replace(asDraft ? "/dashboard" : `/articlessc/${result.data.slug}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to publish";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const toolbarBtns = [
    { icon: Heading2, label: "Heading", action: () => insertLine("## ") },
    { icon: Bold, label: "Bold", action: () => wrap("**", "**", "bold text") },
    { icon: Italic, label: "Italic", action: () => wrap("*", "*", "italic text") },
    { icon: Quote, label: "Quote", action: () => insertLine("> ") },
    { icon: List, label: "List", action: () => insertLine("- ") },
    { icon: Link2, label: "Link", action: () => wrap("[", "](https://)", "link text") },
    { icon: Code, label: "Code", action: () => wrap("`", "`", "code") },
    {
      icon: ImageIcon,
      label: "Image",
      action: () => wrap("![alt](", ")", "https://image.url"),
    },
  ];

  return (
    <div>
      <SEO title="Write a story" noIndex />
      <Breadcrumbs
        items={[{ name: "Editorial", href: "/editorial" }, { name: "New", href: "/create" }]}
      />
      <PageHeader
        eyebrow="Editor"
        title="Publish a Story"
        subtitle="Craft news flashes or long-form articles for the Pulse audience."
      />

      <section className="container max-w-6xl py-10 mx-auto">
        <form
          id={FORM_ID}
          onSubmit={form.handleSubmit((vals) => processSubmit(vals, false))}
          className="grid lg:grid-cols-[1fr_320px] gap-6"
        >
          {/* Main column */}
          <div className="space-y-5 min-w-0">
            {/* Title + slug */}
            <Card className="p-5 space-y-3">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-0">
                    <Input
                      {...field}
                      placeholder="Your headline goes here…"
                      maxLength={200}
                      required
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="text-2xl md:text-3xl font-black border-0 px-0 h-auto py-2 focus-visible:ring-0 shadow-none bg-transparent"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <div className="text-xs text-muted-foreground font-mono truncate">
                /article/{slugPreview}
              </div>
              <Controller
                name="excerpt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-0">
                    <Textarea
                      {...field}
                      maxLength={300}
                      rows={2}
                      placeholder="One-sentence hook for the social card and previews"
                      aria-invalid={fieldState.invalid}
                      className="border-0 px-0 resize-none focus-visible:ring-0 shadow-none bg-transparent text-base"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <div className="text-[10px] text-muted-foreground tabular-nums text-right">
                {(excerptWatch ?? "").length}/300
              </div>
            </Card>

            {/* Toolbar + editor */}
            <Card className="overflow-hidden">
              <Tabs value={tab} onValueChange={(v) => setTab(v as "write" | "preview")}>
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2 gap-2">
                  <div className="flex flex-wrap items-center gap-0.5">
                    {toolbarBtns.map((b) => (
                      <Button
                        key={b.label}
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={b.action}
                        title={b.label}
                        aria-label={b.label}
                        className="w-8 h-8"
                        disabled={tab === "preview"}
                      >
                        <b.icon className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                  <TabsList className="h-8">
                    <TabsTrigger value="write" className="text-xs gap-1">
                      <Sparkles className="w-3 h-3" /> Write
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="text-xs gap-1">
                      <Eye className="w-3 h-3" /> Preview
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="write" className="m-0">
                  <Controller
                    name="content"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      const { ref, ...fieldProps } = field;
                      return (
                        <Field data-invalid={fieldState.invalid} className="gap-0">
                          <Textarea
                            {...fieldProps}
                            ref={(node) => {
                              contentRef.current = node;
                              ref(node);
                            }}
                            rows={20}
                            required
                            minLength={20}
                            maxLength={50000}
                            placeholder="Tell the story… use **bold**, *italic*, ## heading, > quote, - list, [link](url)"
                            aria-invalid={fieldState.invalid}
                            className="border-0 rounded-none focus-visible:ring-0 shadow-none font-mono text-sm leading-relaxed min-h-[480px] resize-y"
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      );
                    }}
                  />
                </TabsContent>
                <TabsContent value="preview" className="m-0 p-6 min-h-[480px]">
                  {contentWatch ? (
                    <article
                      className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(contentWatch) }}
                    />
                  ) : (
                    <div className="text-center text-muted-foreground py-16">
                      Nothing to preview yet.
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground tabular-nums">
                <span>
                  {wordCount} words · ~{readingTime} min read
                </span>
                <span>{contentWatch.length}/50000</span>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <Card className="p-5 space-y-4">
              <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                Publish
              </div>
              <Button
                type="submit"
                form={FORM_ID}
                disabled={saving}
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow gap-1.5"
              >
                {saving ? "Publishing…" : "Publish now"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={form.handleSubmit((vals) => processSubmit(vals, true))}
                className="w-full gap-1.5"
              >
                <Save className="w-4 h-4" /> Save as draft
              </Button>
            </Card>

            <Card className="p-5 space-y-4">
              <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                Metadata
              </div>
              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1.5">
                    <FieldLabel>Type</FieldLabel>
                    <select
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value as CreateStoryFormValues["type"])
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      aria-invalid={fieldState.invalid}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="article">Article (long-form)</option>
                      <option value="news">News (short)</option>
                    </select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="sport"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1.5">
                    <FieldLabel>Sport</FieldLabel>
                    <select
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      aria-invalid={fieldState.invalid}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">— choose —</option>
                      {SPORT_LIST.map((s) => (
                        <option key={s.slug} value={s.name}>
                          {s.icon} {s.name}
                        </option>
                      ))}
                    </select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <div className="space-y-1.5">
                <FieldLabel>Tags</FieldLabel>
                <div className="flex gap-1.5 items-center ">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tag…"
                    className="h-9"
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => setTags(tags.filter((x) => x !== t))}
                          className="hover:text-destructive"
                          aria-label={`Remove ${t}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                Cover image
              </div>
              <Controller
                name="cover_image_url"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-0 space-y-3">
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://…"
                      maxLength={500}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    {field.value ? (
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={field.value}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-xs">
                        <ImageIcon className="w-5 h-5 mr-1" /> Cover preview
                      </div>
                    )}
                  </Field>
                )}
              />
            </Card>
          </aside>
        </form>
      </section>
    </div>
  );
}
