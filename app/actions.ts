"use server";
import { createClient } from "@/lib/supabase/server";

export async function createNote(formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof title !== "string" || typeof content !== "string") {
    return;
  }

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("notes").insert({
    title: trimmedTitle,
    content: trimmedContent,
  });

  if (error) {
    console.error("Failed to create note:", error.message);
    return;
  }

  console.log("Note created successfully");
}
