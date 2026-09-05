import type { Note } from "@/types/note";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">{note.title}</h2>
      <p className="mt-2 whitespace-pre-wrap text-gray-600">{note.content}</p>
      <time
        dateTime={note.created_at}
        className="mt-4 block text-sm text-gray-400"
      >
        สร้างเมื่อ {new Date(note.created_at).toLocaleDateString("th-TH")}
      </time>
    </article>
  );
}
