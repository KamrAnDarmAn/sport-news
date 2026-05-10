"use server";

import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { RegisterSchema } from "../validations/user-validations";

export type RegisterResult =
  | { success: true }
  | { success: false; error: string };

export async function registerUser(input: unknown): Promise<RegisterResult> {
  const validate = RegisterSchema.safeParse(input);
  if (!validate.success) {
    return { success: false, error: validate.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, password, displayName } = validate.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        fullName: displayName,
        password: hashedPassword,
      },
    });
    return { success: true };
  } catch (err: unknown) {
    const code =
      typeof err === "object" && err !== null && "code" in err
        ? String((err as { code?: string }).code)
        : "";
    if (code === "P2002") {
      return { success: false, error: "An account with this email already exists." };
    }
    console.error("Error registering user:", err);
    return { success: false, error: "Could not create account. Try again." };
  }
}
