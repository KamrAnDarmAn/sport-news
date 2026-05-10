import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { canPublish } from "@/lib/authz";

export default async function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth?callbackUrl=/create");
  }
  if (!canPublish(session.user.role)) {
    redirect("/");
  }
  return children;
}
