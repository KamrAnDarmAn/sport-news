"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/PageHeader";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SPORT_LIST } from "@/lib/sports-data";
import { Image as ImageIcon, Eye, Save, ShieldAlert, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { createStory, getStoryById, updateStory } from "@/lib/actions/story.actions";
import {
  CreateStoryFormSchema,
  type CreateStoryFormValues,
} from "@/lib/validations/story-validations";
import { canPublish } from "@/lib/authz";
import { MarkdownPreview } from "@/components/editor/MarkdownPreview";

const StoryEditor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[480px] rounded-md border border-border bg-muted/30 animate-pulse" />
  ),
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

const READ_WPM = 220;

const FORM_ID = "create-story-form";

const emptyDefaults: CreateStoryFormValues = {
  title: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  sport: "",
  type: "article",
};

export default function CreateArticle() {
  const { data: session } = useSession();
  const user = session?.user;
  const isEditor = user ? canPublish(session.user.role) : false;
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  /** Bumps after async load so MDXEditor remounts with `markdown` from the server (prop is only read on mount). */
  const [editorSession, setEditorSession] = useState(0);
  /** Avoid resetting the form on first paint when there is no `edit` query (defaults are already empty). */
  const hadLoadedEditRef = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const form = useForm<CreateStoryFormValues>({
    resolver: zodResolver(CreateStoryFormSchema),
    defaultValues: emptyDefaults,
  });

  const titleWatch = form.watch("title");
  const excerptWatch = form.watch("excerpt");
  const contentWatch = form.watch("content");

  const wordCount = useMemo(
    () => contentWatch.trim().split(/\s+/).filter(Boolean).length,
    [contentWatch],
  );
  const readingTime = Math.max(1, Math.round(wordCount / READ_WPM));
  const slugPreview = slugify(titleWatch) || "your-story-slug";

  if (!user) {
    redirect("/auth");
    return null;
  }
  if (!isEditor) {
    return (
      <div className="container py-20 max-w-xl">
        <SEO title="Editor — Access denied" noIndex />
        <Card className="p-8 text-center">
          <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Editors only</h2>
          <p className="text-muted-foreground">
            Sign in with an editor or admin account to publish posts.
          </p>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    if (!editId) {
      if (hadLoadedEditRef.current) {
        form.reset(emptyDefaults);
        setTags([]);
        setEditorSession((s) => s + 1);
      }
      hadLoadedEditRef.current = false;
      return;
    }

    let cancelled = false;
    (async () => {
      const res = await getStoryById(editId);
      if (cancelled || !res.success || !res.data) return;
      const d = res.data;
      form.reset({
        title: d.title,
        excerpt: d.excerpt ?? "",
        content: d.content ?? "",
        cover_image_url: d.coverUrl ?? "",
        sport: d.sport ?? "",
        type: d.type === "NEWS" ? "news" : "article",
      });
      const t = (d.topic ?? "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      setTags(t);
      setEditorSession((s) => s + 1);
      hadLoadedEditRef.current = true;
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load when `editId` changes; form.reset is stable
  }, [editId]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 6) setTags([...tags, t]);
    setTagInput("");
  };

  const processSubmit = async (data: CreateStoryFormValues, asDraft: boolean) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        published: !asDraft,
        topic: tags.length > 0 ? tags.join(", ") : undefined,
      };

      const result = editId
        ? await updateStory({ id: editId, ...payload, published: !asDraft })
        : await createStory(payload);

      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }

      toast.success(asDraft ? "Draft saved" : editId ? "Updated!" : "Published!");
      router.replace(asDraft ? "/dashboard" : `/article/${result.data.slug}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to publish";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SEO title="Write a story" noIndex />
      <Breadcrumbs
        items={[
          { name: "Editorial", href: "/editorial" },
          { name: editId ? "Edit" : "New", href: "/create" },
        ]}
      />
      <PageHeader
        eyebrow="Editor"
        title={editId ? "Edit Story" : "Publish a Story"}
        subtitle="Craft news flashes or long-form articles for the Pulse audience."
      />

      <section className="container max-w-6xl py-10 mx-auto">
        <form
          id={FORM_ID}
          onSubmit={form.handleSubmit((vals) => processSubmit(vals, false))}
          className="grid lg:grid-cols-[1fr_320px] gap-6"
        >
          <div className="space-y-5 min-w-0">
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

            <Card className="overflow-hidden">
              <Tabs value={tab} onValueChange={(v) => setTab(v as "write" | "preview")}>
                <div className="flex items-center justify-end border-b border-border bg-muted/30 px-3 py-2">
                  <TabsList className="h-8">
                    <TabsTrigger value="write" className="text-xs gap-1">
                      <Sparkles className="w-3 h-3" /> Write
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="text-xs gap-1">
                      <Eye className="w-3 h-3" /> Preview
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="write" className="m-0 border-t border-border">
                  <Controller
                    name="content"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="gap-0">
                        <StoryEditor
                          key={`${editId ?? "new"}-${editorSession}`}
                          markdown={field.value}
                          onChange={(md) => field.onChange(md)}
                          placeholder="Tell the story… Headings, lists, links, images, and code blocks live in the toolbar."
                          className="rounded-none border-0 shadow-none"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </TabsContent>
                <TabsContent value="preview" className="m-0 p-6 min-h-[480px] border-t border-border">
                  <MarkdownPreview source={contentWatch} />
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
