import Link from "next/link";

export default function ResetPasswordErrorPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-5 py-12">
      <section className="surface space-y-5 text-center">
        <h1 className="text-2xl font-bold">
          This reset link could not be used.
        </h1>

        <p className="text-sm text-stone-600">
          The link may have expired or already been used. Request a new
          link and open it in the same browser and browser profile.
        </p>

        <Link
          href="/forgot-password"
          className="button button-primary"
        >
          Request a new link
        </Link>
      </section>
    </main>
  );
}