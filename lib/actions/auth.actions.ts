"use server";

import bcrypt from "bcryptjs";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

import { SignInSchema, SignUpSchema } from "../validations";

interface ActionResponse {
  success: boolean;
  error?: any;
  data?: any;
  message: string;
}

export async function signUpWithCredentials(
  params: unknown,
): Promise<ActionResponse> {
  const validationResult = SignUpSchema.safeParse(params);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error,
      message: "Validation failed",
    };
  }

  const { displayName, email, password } = validationResult.data;

  try {
    // 1. Wrap all database operations in a transaction
    await prisma.$transaction(async (tx) => {
      // Use 'tx' instead of 'prisma' inside this block

      const user = await tx.user.findUnique({
        where: { email },
      });

      if (user) {
        return {
          success: false,
          error: "Email is already in use",
          message: "User with this email already exists",
        };
      }

      // 2. Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 12);

      // 3. Create the user and associated account in a single transaction
      await tx.user.create({
        data: {
          fullName: displayName,
          email,
          accounts: {
            create: {
              provider: "credentials",
              providerAccountId: email,
              password: hashedPassword,
            },
          },
        },
      });
    });
    // 4. Sign in (Only call after the DB transaction is guaranteed to succeed)
    await signIn("credentials", { email, password, redirect: false });
    return {
      success: true,
      message: "User registered and signed in successfully",
      data: { email, fullName: displayName },
    };
  } catch (error) {
    // Prisma automatically rolls back if an error is thrown inside $transaction
    return {
      success: false,
      message: "Unexpected Error.",
      error: error,
    };
  }
}

export async function signInWithCredentials(params: {
  email: string;
  password: string;
}): Promise<ActionResponse> {
  const validationResult = SignInSchema.safeParse(params);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Validation field",
      error: validationResult.error?.cause,
    };
  }

  const { email, password } = validationResult.data!;

  try {
    const existingAccount = await prisma.account.findFirst({
      where: {
        provider: "credentials",
        providerAccountId: email,
      },
    });

    if (!existingAccount || !existingAccount.password) {
      return {
        success: false,
        message: "Invalide credentials",
      };
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password,
    );

    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalide credentials",
      };
    }

    await signIn("credentials", { email, password, redirect: false });

    return { success: true, message: "Successfully Sign in" };
  } catch (error) {
    return {
      success: false,
      message: "Unexpected Error.",
      error: error,
    };
  }
}

export async function signOutUser() {
  await signOut();
}
