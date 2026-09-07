"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface NoteFormState {
  success: boolean;
  message: string;
}

export async function createNote(
  _previousState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof title !== "string" || typeof content !== "string") {
    return { success: false, message: "Invalid form data." };
  }

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle) {
    return { success: false, message: "Please enter a title." };
  }
  if (trimmedTitle.length > 100) {
    return {
      success: false,
      message: "Title must be 100 characters or fewer.",
    };
  }

  if (trimmedContent.length > 5000) {
    return {
      success: false,
      message: "Content must be 5,000 characters or fewer.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "Please sign in first." };
  }

  const { error } = await supabase.from("notes").insert({
    title: trimmedTitle,
    content: trimmedContent,
    user_id: user.id,
  });

  if (error) {
    console.error("Failed to create note:", error.message);
    return { success: false, message: "Could not save your note. Please try again." };
  }

  revalidatePath("/");

  return { success: true, message: "Note saved. Cat approved!" };
}

export async function deleteNote(
  _previousState: { message: string },
  formData: FormData,
): Promise<{ message: string }> {
  const id = formData.get("id");

  if (typeof id !== "string" || !id.trim()) {
    return { message: "Missing note ID." };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { message: "Please sign in first." };
  }

  const { data, error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    console.error("Failed to delete note:", error.message);
    return { message: "Could not delete your note. Please try again." };
  }

  if (!data?.length) {
    return { message: "Note not found, or you do not have permission to delete it." };
  }

  revalidatePath("/");
  return { message: "" };
}

export async function updateNote(
  _previousState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const id = formData.get("id");
  const title = formData.get("title");
  const content = formData.get("content");

  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof content !== "string" ||
    !id.trim()
  ) {
    return { success: false, message: "Invalid form data." };
  }

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle) {
    return { success: false, message: "Please enter a title." };
  }

  if (trimmedTitle.length > 100 || trimmedContent.length > 5000) {
    return {
      success: false,
      message: "Keep the title under 101 characters and content under 5,001 characters.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "Please sign in first." };
  }

  const { data, error } = await supabase
    .from("notes")
    .update({
      title: trimmedTitle,
      content: trimmedContent,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    console.error("Failed to update note:", error.message);
    return { success: false, message: "Could not update your note. Please try again." };
  }

  if (!data?.length) {
    return { success: false, message: "Note not found, or you do not have permission to edit it." };
  }

  revalidatePath("/");
  revalidatePath(`/notes/${id}/edit`);

  return { success: true, message: "Changes saved. Nice work, human." };
}
