"use server";
import { createClient } from "@/lib/supabase/server";

export interface ForgotPasswordState {
  success: boolean;
  message: string;
}

export async function requestPasswordReset(
  _previousState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = formData.get("email");

  if (typeof email !== "string") {
    return {
      success: false,
      message: "Please enter your email address.",
    };
  }

  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return {
      success: false,
      message: "Please enter your email address.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return {
      success: false,
      message: "Password reset is temporarily unavailable.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
    redirectTo: new URL("/auth/reset-password", siteUrl).toString(),
  });

  if (error) {
    console.error("Password reset request failed:", error.code);

    return {
      success: false,
      message: "Could not process the request. Please try again later.",
    };
  }

  return {
    success: true,
    message:
      "If an account exists for this email, you will receive a password reset link. Open it in the same browser and browser profile.",
  };
}
