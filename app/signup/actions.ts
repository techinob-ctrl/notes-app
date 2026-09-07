"use server";
import { createClient } from "@/lib/supabase/server";

export interface SignupState {
  success: boolean;
  message: string;
}

export async function signup(
  _previousState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return {
      success: false,
      message: "Please fill in all fields.",
    };
  }

  const trimmedEmail = email.trim();

  if (!trimmedEmail || !password || !confirmPassword) {
    return {
      success: false,
      message: "Please fill in all fields.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password must contain at least 8 characters.",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return {
      success: false,
      message: "Sign-up is temporarily unavailable.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: {
      emailRedirectTo: new URL("/auth/confirm", siteUrl).toString(),
    },
  });

  if (error) {
    console.error("Sign-up failed:", error.code, error.message);

    return {
      success: false,
      message: "Could not sign up. Please try again later.",
    };
  }

  return {
    success: true,
    message:
      "Check your inbox for a confirmation email. If you already have an account, try signing in.",
  };
}
