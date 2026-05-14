import { Preview } from "./Preview";

type Props = {
  content: string | null | undefined;
};

/**
 * Renders stored story markdown/MDX on the server (articles & news detail).
 */
export function StoryBody({ content }: Props) {
  const raw = content?.trim();
  if (!raw) return null;
  return <Preview content={raw} />;
}
