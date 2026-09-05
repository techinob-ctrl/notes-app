import { createNote } from "@/app/actions";

export default function NoteForm() {
  return (
    <form
      action={createNote}
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
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
        />
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
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Add note
      </button>
    </form>
  );
}
