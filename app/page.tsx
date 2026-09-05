import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/types/note";
import NoteCard from "@/components/note-card";
import NoteForm from "@/components/note-form";
import { logout } from "@/app/login/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, content, created_at, updated_at")
    .order("created_at", { ascending: false });
  if (error) {
    return <main>Failed to load notes: {error.message}</main>;
  }

  const notes: Note[] = data ?? [];
  return (
    <main className="max-w-5xl mx-auto px-4 py-10 w-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Notes</h1>

        <form action={logout}>
          <button
            type="submit"
            className="rounded-md border px-4 py-2 hover:bg-gray-100 hover:text-gray-900"
          >
            Log out
          </button>
        </form>
      </div>
      <NoteForm />
      {notes.length === 0 ? (
        <p>No notes yet</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </main>
  );
}
