import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/authz";

export default async function RolesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth?callbackUrl=/roles");
  }
  if (!isAdmin(session.user.role)) {
    redirect("/");
  }
  return children;
}
