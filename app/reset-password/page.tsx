"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updatePassword } from "./actions";
import SubmitButton from "@/components/submit-button";

const initialState = {
  success: false,
  message: "",
};

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    updatePassword,
    initialState,
  );
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-5 py-12">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-bold text-orange-800">
          Orange and Tabby cat
        </p>

        <h1 className="text-3xl font-bold">Set a new password.</h1>

        <p className="mt-3 text-sm text-stone-600">
          A fresh password for your cozy corner.
        </p>
      </div>

      <form action={formAction} className="surface space-y-5">
        <div>
          <label htmlFor="password" className="mb-1 block font-medium">
            New password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            readOnly={isPending || state.success}
            className="field"
          />

          <p className="mt-1 text-xs text-stone-600">
            Use at least 8 characters.
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block font-medium">
            Confirm new password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            readOnly={isPending || state.success}
            className="field"
          />
        </div>

        <p
          aria-live="polite"
          className={`text-sm ${
            state.success ? "text-green-700" : "text-red-600"
          }`}
        >
          {isPending ? "" : state.message}
        </p>

        {!state.success && (
          <SubmitButton
            label="Update password"
            pendingLabel="Updating…"
            className="w-full"
          />
        )}

        {state.success && (
          <Link href="/" className="button button-primary w-full">
            Back to notes
          </Link>
        )}
      </form>

      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="font-bold text-orange-800 underline">
          Back to sign in
        </Link>
      </p>
    </main>
  );
}
