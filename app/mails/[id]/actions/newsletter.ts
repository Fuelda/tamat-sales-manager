"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function sendNewsletter(mailId: string, categoryId: number) {
  try {
    // ダミーの送信処理（実際のメール送信処理はここに実装）
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Supabaseに送信記録を保存
    const { error } = await supabase.from("sent_newsletters").insert({
      mail_id: mailId,
      category_id: categoryId,
    });

    if (error) throw error;

    // キャッシュの再検証
    revalidatePath("/mails");
    return { success: true };
  } catch (error) {
    console.error("Newsletter sending failed:", error);
    return { success: false, error };
  }
}
