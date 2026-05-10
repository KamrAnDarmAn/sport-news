"use client";
import { useState } from "react";
import { z } from "zod";
// import { supabase } from "@/integrations/supabase/client";
// import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";

const schema = z.object({
    title: z.string().trim().min(3).max(200),
    excerpt: z.string().trim().max(300).optional(),
    content: z.string().trim().min(20).max(50000),
    cover_image_url: z.string().trim().url().max(500).optional().or(z.literal("")),
    sport: z.string().trim().max(50).optional(),
    type: z.enum(["news", "article"]),
});

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

export default function CreateArticle() {
    const [form, setForm] = useState({ title: "", excerpt: "", content: "", cover_image_url: "", sport: "", type: "article" as "news" | "article" });
    const [saving, setSaving] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsed = schema.safeParse(form);
        if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
        setSaving(true);
        try {
            // TODO implement creattion of post.
        } catch (err: any) {
            toast.error(err.message || "Failed to publish");
        } finally { setSaving(false); }
    };

    return (
        <div>
            <PageHeader eyebrow="Editor" title="Publish a Story" subtitle="Craft news flashes or long-form articles for the Pulse audience." />
            <section className="container max-w-3xl py-12 mx-auto">
                <Card className="p-6 md:p-8">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Type</Label>
                                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                                    <option value="article">Article (long-form)</option>
                                    <option value="news">News (short)</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Sport</Label>
                                <Input value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value })} placeholder="football, tennis…" maxLength={50} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Title</Label>
                            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Madrid stuns Barcelona…" maxLength={200} required />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Cover image URL (optional)</Label>
                            <Input type="url" value={form.cover_image_url} onChange={e => setForm({ ...form, cover_image_url: e.target.value })} placeholder="https://…" maxLength={500} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Excerpt</Label>
                            <Textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} maxLength={300} rows={2} placeholder="One-sentence hook" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Content</Label>
                            <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={14} required minLength={20} maxLength={50000} placeholder="Tell the story…" />
                        </div>
                        <Button type="submit" disabled={saving} className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow rounded-md">
                            {saving ? "Publishing…" : "Publish post"}
                        </Button>
                    </form>
                </Card>
            </section>
        </div>
    );
}
