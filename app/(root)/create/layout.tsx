import React from "react";
import { auth } from "@/auth";
import { canPublish } from "@/lib/authz";
import { redirect } from "next/navigation";

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
