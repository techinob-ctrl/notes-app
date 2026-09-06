import { login } from "./actions";
import SubmitButton from "@/components/submit-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Log in</h1>
      {error === "invalid_credentials" && (
        <p role="alert" className="mb-4 text-red-600">
          เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน แล้วลองอีกครั้ง
        </p>
      )}
      <form
        action={login}
        className="space-y-4 rounded-lg border border-gray-200 bg-white p-5"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <SubmitButton
          label="Log in"
          pendingLabel="กำลังเข้าสู่ระบบ…"
          className="w-full"
        />
      </form>
    </main>
  );
}
