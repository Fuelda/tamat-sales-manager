"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function sendNewsletter(mailId: string, categoryId: number) {
  try {
    // 選択されたカテゴリーに属する企業を取得
    const { data: targetCompanies, error: fetchError } = await supabase
      .from("companies")
      .select("*")
      .eq("business_type_id", categoryId);

    if (fetchError) throw fetchError;

    const targetCompaniesContact = targetCompanies.map((company) => ({
      name: company.name,
      contact: company.contact,
      communicationChannel: company.communication_channel,
    }));
    const targetMailCompaniesContact = targetCompaniesContact.filter(
      (company) => company.communicationChannel === "mail"
    );
    // 対象企業のリストをログ出力
    console.log(targetMailCompaniesContact);

    // Supabaseに送信記録を保存
    // const { error } = await supabase.from("sent_newsletters").insert({
    //   mail_id: mailId,
    //   category_id: categoryId,
    // });

    // if (error) throw error;

    // キャッシュの再検証
    revalidatePath("/mails", "layout");
    revalidatePath(`/mails/${mailId}`, "layout");
    return { success: true };
  } catch (error) {
    console.error("Newsletter sending failed:", error);
    return { success: false, error };
  }
}
