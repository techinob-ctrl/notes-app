"use server";

import { createClient } from "@/lib/supabase/server";

export interface ResetPasswordState {
  success: boolean;
  message: string;
}

export async function updatePassword(
  _previousState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return {
      success: false,
      message: "Please fill in both password fields.",
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

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message:
        "Your session is unavailable. Please request a new reset link.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("Password update failed:", error.code);

    return {
      success: false,
      message:
        "Could not update your password. Try a different password or request a new reset link.",
    };
  }

  return {
    success: true,
    message: "Your password has been updated.",
  };
}