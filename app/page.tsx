import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/types/note";
import NoteCard from "@/components/note-card";
import NoteForm from "@/components/note-form";

export default async function Home() {
  const supabase = await createClient();
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
      <h1 className="text-3xl font-bold mb-6">Notes</h1>
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
