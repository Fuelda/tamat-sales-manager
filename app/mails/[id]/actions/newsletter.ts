"use server";

import { resend } from "@/lib/resend";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

interface SendNewsletterParams {
  mailId: string;
  categoryIds: number[];
  title: string;
  contents: string;
}

export async function sendNewsletter({
  mailId,
  categoryIds,
  title,
  contents,
}: SendNewsletterParams) {
  try {
    // 選択されたカテゴリーに属する企業を取得
    const { data: targetCompanies, error: fetchError } = await supabase
      .from("companies")
      .select("name, contact, communication_channel")
      .in("business_type_id", categoryIds);

    if (fetchError) throw fetchError;

    const targetMailCompanies = targetCompanies.filter(
      (company) => company.communication_channel === "mail"
    );
    const targetCompaniesMail = targetMailCompanies.map(
      (company) => company.contact
    );

    console.log(targetCompaniesMail);

    // const { data: sentData, error: sendError } = await resend.emails.send({
    //   from: "masuda@tamat.jp",
    //   to: targetCompaniesMail,
    //   subject: title,
    //   html: contents,
    // });
    // if (sendError) throw sendError;

    // // Supabaseに送信記録を保存
    // const { error: insertError } = await supabase
    //   .from("sent_newsletters")
    //   .insert({
    //     mail_id: mailId,
    //     category_id: categoryId,
    //   });
    // if (insertError) throw insertError;

    // キャッシュの再検証
    revalidatePath("/mails", "layout");
    revalidatePath(`/mails/${mailId}`, "layout");
    return { success: true };
  } catch (error) {
    console.error("Newsletter sending failed:", error);
    return { success: false, error };
  }
}
