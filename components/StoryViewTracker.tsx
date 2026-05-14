"use client";

import { useEffect, useRef } from "react";
import { recordStoryView } from "@/lib/actions/view.actions";

export function StoryViewTracker({ storyId }: { storyId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (!storyId || sent.current) return;
    sent.current = true;
    void recordStoryView(storyId);
  }, [storyId]);

  return null;
}
