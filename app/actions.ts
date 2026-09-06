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
    return { success: false, message: "ข้อมูลไม่ถูกต้อง" };
  }

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle) {
    return { success: false, message: "กรุณากรอกชื่อโน้ต" };
  }
  if (trimmedTitle.length > 100) {
    return {
      success: false,
      message: "ชื่อโน้ตต้องไม่เกิน 100 ตัวอักษร",
    };
  }

  if (trimmedContent.length > 5000) {
    return {
      success: false,
      message: "เนื้อหาต้องไม่เกิน 5,000 ตัวอักษร",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "กรุณาเข้าสู่ระบบก่อน" };
  }

  const { error } = await supabase.from("notes").insert({
    title: trimmedTitle,
    content: trimmedContent,
    user_id: user.id,
  });

  if (error) {
    console.error("Failed to create note:", error.message);
    return { success: false, message: "บันทึกไม่สำเร็จ กรุณาลองใหม่" };
  }

  revalidatePath("/");

  return { success: true, message: "บันทึกโน้ตแล้ว" };
}
