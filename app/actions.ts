"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Please log in before creating a note");
    return;
  }
  const { error } = await supabase.from("notes").insert({
    title: trimmedTitle,
    content: trimmedContent,
    user_id: user.id,
  });

  if (error) {
    console.error("Failed to create note:", error.message);
    return;
  }

  revalidatePath("/");
}
