import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/types/note";
import NoteCard from "@/components/note-card";
import NoteForm from "@/components/note-form";
import { logout } from "@/app/login/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CatCover from "@/components/cat-cover";

interface HomeProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q } = await searchParams;
  const search = typeof q === "string" ? q.trim() : "";
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }
  let query = supabase
    .from("notes")
    .select("id, title, content, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (search) {
    const escapedSearch = search.replace(/[\\%_]/g, "\\$&");
    query = query.ilike("title", `%${escapedSearch}%`);
  }

  const { data, error } = await query;
  if (error) {
    return <main>Failed to load notes: {error.message}</main>;
  }

  const notes: Note[] = data ?? [];
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-10">
      <header className="mb-10 flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 text-base font-extrabold leading-tight tracking-tight sm:text-xl">
          <Image src="/cats/icon.png" alt="" width={56} height={56} className="shrink-0 rounded-2xl" />
          <span>Orange and Tabby cat<span className="mt-1 hidden text-xs font-normal tracking-normal text-stone-500 sm:block">Your thoughts. Their territory.</span></span>
        </Link>

        <form action={logout}>
          <button
            type="submit"
            className="button button-secondary"
          >
            Log out
          </button>
        </form>
      </header>
      <CatCover />
      <div className="grid items-start gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="min-w-0">
        <NoteForm />
      </aside>
      <section className="min-w-0" aria-label="Your notes">
      <form action="/" method="get" className="mb-5 flex flex-wrap gap-2">
        <label htmlFor="search" className="sr-only">
          Search notes
        </label>
        <input
          id="search"
          name="q"
          type="search"
          key={search}
          defaultValue={search}
          placeholder="Sniff out a note title…"
          className="field min-w-0 flex-1 basis-40"
        />
        <button
          type="submit"
          className="button button-primary"
        >
          Search
        </button>
        {search && (
          <Link href="/" className="shrink-0 self-center text-sm underline">
            Clear search
          </Link>
        )}
      </form>
      <p className="mb-4 text-sm text-gray-500">
        {search
          ? `${notes.length} results for “${search}”`
          : `${notes.length} notes in your collection`}
      </p>
      {notes.length === 0 ? (
        <div className="surface py-14 text-center">
          <Image src="/cats/icon.png" alt="" width={80} height={80} className="mx-auto mb-4" />
          <h2 className="font-semibold">{search ? "No notes sniffed out." : "A fresh page. A little mischief."}</h2>
          <p className="mt-2 text-sm text-slate-500">{search ? "Try another word or clear your search." : "Add your first note. The cats are all ears."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
      </section>
      </div>
      <footer className="mt-12 border-t border-slate-200 pt-5 text-xs text-slate-500">Orange and Tabby cat · Made for notes. Managed by cats.</footer>
    </main>
  );
}
