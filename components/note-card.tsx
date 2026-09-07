import type { Note } from "@/types/note";
import DeleteNoteForm from "@/components/delete-note-form";
import Link from "next/link";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <article className="surface flex min-w-0 flex-col border-t-4 border-t-orange-300">
      <h2 className="text-lg font-semibold leading-relaxed text-slate-900 wrap-anywhere">{note.title}</h2>
      <p className="mt-3 mb-5 flex-1 whitespace-pre-wrap text-sm leading-7 text-slate-600 wrap-anywhere">{note.content || "Just a title. Very mysterious."}</p>
      <time
        dateTime={note.created_at}
        className="block text-xs text-slate-500"
      >
        Created{" "}
        {new Date(note.created_at).toLocaleDateString("en-US", {
          timeZone: "America/New_York",
        })}
      </time>
      {note.updated_at !== note.created_at && (
        <time
          dateTime={note.updated_at}
          className="mt-1 block text-xs text-slate-500"
        >
          Updated{" "}
          {new Date(note.updated_at).toLocaleDateString("en-US", {
            timeZone: "America/New_York",
          })}
        </time>
      )}
      <div className="mt-5 flex items-start gap-2 border-t border-slate-100 pt-4">
        <Link
          href={`/notes/${note.id}/edit`}
          className="button shrink-0 bg-yellow-500 text-black hover:bg-yellow-600"
        >
          Edit
        </Link>
        <DeleteNoteForm noteId={note.id} />
      </div>
    </article>
  );
}
