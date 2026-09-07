import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditNoteForm from "@/components/edit-note-form";
import Link from "next/link";

interface EditNotePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: note, error } = await supabase
    .from("notes")
    .select("id, title, content")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load note:", error.message);
    return <main className="p-6">Could not load your note. Please try again.</main>;
  }

  if (!note) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <Link href="/" className="mb-7 inline-block text-sm font-medium text-orange-800 hover:underline">← Back to notes</Link>
      <h1 className="text-3xl font-bold tracking-tight">Edit note</h1>
      <p className="mt-2 mb-7 text-sm text-slate-500">A little polish for your next big idea.</p>
      <EditNoteForm note={note} />
    </main>
  );
}
