import type { Role } from "@/generated/prisma/client";

export function canPublish(role: Role | undefined): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function isAdmin(role: Role | undefined): boolean {
  return role === "ADMIN";
}
