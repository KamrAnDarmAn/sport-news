"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  createComment,
  deleteComment,
  type CommentListItem,
} from "@/lib/actions/comment.actions";
import { useSession } from "next-auth/react";

type Props = {
  storyId: string;
  initialComments: CommentListItem[];
};

export function CommentsSection({ storyId, initialComments }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      [...initialComments].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [initialComments],
  );

  const submit = () => {
    const body = text.trim();
    if (!body) return;
    startTransition(async () => {
      const res = await createComment(storyId, body);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setText("");
      toast.success("Comment posted");
      router.refresh();
    });
  };

  const remove = (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteComment(id);
      setDeletingId(null);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Comment removed");
      router.refresh();
    });
  };

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold">Comments</h2>
        <span className="text-sm text-muted-foreground">({sorted.length})</span>
      </div>

      {status === "authenticated" ? (
        <Card className="p-4 mb-8 border-border/60">
          <Textarea
            placeholder="Share your take…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            maxLength={2000}
            className="resize-none mb-3 bg-background/50"
          />
          <div className="flex justify-between items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {2000 - text.length} characters left
            </span>
            <Button
              type="button"
              className="bg-gradient-primary text-primary-foreground"
              disabled={pending || !text.trim()}
              onClick={submit}
            >
              {pending ? "Posting…" : "Post comment"}
            </Button>
          </div>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground mb-8">
          Sign in to join the conversation.
        </p>
      )}

      <ul className="space-y-4">
        {sorted.length === 0 ? (
          <li className="text-sm text-muted-foreground">No comments yet.</li>
        ) : (
          sorted.map((c) => (
            <li key={c.id}>
              <Card className="p-4 border-border/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-sm">{c.author.fullName}</div>
                    <div className="text-xs text-muted-foreground mb-2">{c.timeAgo}</div>
                    <p className="text-sm whitespace-pre-wrap text-foreground/90">
                      {c.content}
                    </p>
                  </div>
                  {(c.isOwn || session?.user?.role === "ADMIN") && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      disabled={deletingId === c.id && pending}
                      onClick={() => remove(c.id)}
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
