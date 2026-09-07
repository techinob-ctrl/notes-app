"use client";

import { deleteNote } from "@/app/actions";
import SubmitButton from "@/components/submit-button";
import { useActionState } from "react";

interface DeleteNoteFormProps {
  noteId: string;
}

export default function DeleteNoteForm({ noteId }: DeleteNoteFormProps) {
  const [state, formAction, isPending] = useActionState(deleteNote, {
    message: "",
  });
  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        const confirmed = window.confirm("Delete this note? This cannot be undone.");

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={noteId} />

      <SubmitButton label="Delete" pendingLabel="Deleting…" variant="danger" />
      <p role="alert" className="mt-2 text-sm text-red-600">
        {isPending ? "" : state.message}
      </p>
    </form>
  );
}
