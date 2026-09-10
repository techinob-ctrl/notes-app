"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "./actions";
import SubmitButton from "@/components/submit-button";

const initialState = {
  success: false,
  message: "",
};

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState,
  );
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-5 py-12">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-bold text-orange-800">
          Orange and Tabby cat
        </p>

        <h1 className="text-3xl font-bold">Forgot your password?</h1>

        <p className="mt-3 text-sm text-stone-600">
          It happens, human. Enter your email to request a password reset.
        </p>
      </div>

      <form action={formAction} className="surface space-y-5">
        <div>
          <label htmlFor="email" className="mb-1 block font-medium">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
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

        <SubmitButton
          label="Send reset link"
          pendingLabel="Sending…"
          className="w-full"
        />
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        Remember your password?{" "}
        <Link href="/login" className="font-bold text-orange-800 underline">
          Back to sign in
        </Link>
      </p>
    </main>
  );
}
