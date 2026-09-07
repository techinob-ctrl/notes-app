"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "./actions";
import SubmitButton from "@/components/submit-button";

const initialState = {
  success: false,
  message: "",
};

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState);
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-5 py-12">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-bold text-orange-800">
          Orange and Tabby cat
        </p>
        <h1 className="text-3xl font-bold">Join the cat club.</h1>
        <p className="mt-3 text-sm text-stone-600">
          Create an account. Bring your brightest ideas.
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

        <div>
          <label htmlFor="password" className="mb-1 block font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className="field"
          />
          <p className="mt-1 text-xs text-stone-600">
            Use at least 8 characters.
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block font-medium">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className="field"
          />
        </div>

        <p aria-live="polite" className="text-sm text-stone-700">
          {isPending ? "" : state.message}
        </p>

        <SubmitButton
          label="Create account"
          pendingLabel="Creating account…"
          className="w-full"
        />
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-orange-800 underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
