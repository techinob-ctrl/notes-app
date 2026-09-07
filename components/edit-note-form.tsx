"use client";

import { useActionState, useState } from "react";
import { updateNote } from "@/app/actions";
import SubmitButton from "@/components/submit-button";
import Link from "next/link";

interface EditNoteFormProps {
  note: {
    id: string;
    title: string;
    content: string;
  };
}

const initialState = {
  success: false,
  message: "",
};

export default function EditNoteForm({ note }: EditNoteFormProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const [state, formAction, isPending] = useActionState(
    updateNote,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="surface space-y-5"
    >
      <input type="hidden" name="id" value={note.id} />

      <div>
        <label
          htmlFor="title"
          className="mb-1 block font-medium text-gray-900"
        >
          Title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          readOnly={isPending}
          required
          maxLength={100}
          className="field"
        />

        <p className="mt-1 text-sm text-gray-500">
          {title.length}/100
        </p>
      </div>

      <div>
        <label
          htmlFor="content"
          className="mb-1 block font-medium text-gray-900"
        >
          Content
        </label>

        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          readOnly={isPending}
          rows={6}
          maxLength={5000}
          className="field"
        />

        <p className="mt-1 text-sm text-gray-500">
          {content.length}/5000
        </p>
      </div>

      <p
        aria-live="polite"
        className={state.success ? "text-green-700" : "text-red-600"}
      >
        {isPending ? "" : state.message}
      </p>

      <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-5">
        <SubmitButton
          label="Save changes"
          pendingLabel="Saving…"
        />

        <Link href="/" className="text-gray-600 underline">
          Back to notes
        </Link>
      </div>
    </form>
  );
}
