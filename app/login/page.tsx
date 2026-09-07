import { login } from "./actions";
import SubmitButton from "@/components/submit-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-5 py-12">
      <div className="mb-8 text-center">
        <Image src="/cats/cover.png" alt="Orange and Tabby, two cheeky cats guarding a notebook" width={1536} height={1024} priority sizes="420px" className="mb-6 w-full rounded-3xl border-2 border-stone-800" />
        <p className="mb-2 text-sm font-bold text-orange-800">Orange and Tabby cat</p>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, human.</h1>
        <p className="mt-3 text-sm text-slate-500">Your notes are waiting. So are the cats.</p>
      </div>
      {error === "invalid_credentials" && (
        <p role="alert" className="mb-4 text-red-600">
          Could not sign in. Check your email and password, then try again.
        </p>
      )}
      <form
        action={login}
      className="surface space-y-5"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-1 block font-medium text-gray-900"
          >
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
          <label
            htmlFor="password"
            className="mb-1 block font-medium text-gray-900"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          className="field"
          />
        </div>
        <SubmitButton
          label="Sign in"
          pendingLabel="Signing in…"
          className="w-full"
        />
      </form>
      <p className="mt-6 text-center text-xs text-slate-500">Good ideas deserve a cozy place.</p>
    </main>
  );
}
