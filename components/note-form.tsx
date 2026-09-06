"use client";

import { useActionState, useState } from "react";
import { createNote } from "@/app/actions";
import SubmitButton from "@/components/submit-button";

const initialState = {
  success: false,
  message: "",
};

export default function NoteForm() {
  const [title, setTitle] = useState("");

  const [state, formAction, isPending] = useActionState(
    async (previousState: typeof initialState, formData: FormData) => {
      const result = await createNote(previousState, formData);

      if (result.success) {
        setTitle("");
      }

      return result;
    },
    initialState,
  );

  return (
    <form
      action={formAction}
      className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-white p-5"
    >
      <div>
        <label htmlFor="title" className="mb-1 block font-medium text-gray-900">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={100}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
        />
        <p className="mt-1 text-sm text-gray-500">{title.length}/100</p>
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
          rows={4}
          maxLength={5000}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
        />
      </div>

      <p
        aria-live="polite"
        className={state.success ? "text-green-700" : "text-red-600"}
      >
        {isPending ? "" : state.message}
      </p>

      <SubmitButton label="Add note" pendingLabel="กำลังบันทึก…" />
    </form>
  );
}
