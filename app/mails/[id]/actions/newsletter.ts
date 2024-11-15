"use server";

import { EmailTemplate } from "@/components/mails/EmailTemplate";
import { MailContent } from "@/app/mails/page";
import { resend } from "@/lib/resend";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

interface SendNewsletterParams {
  mailId: string;
  categoryIds: number[];
  title: string;
  contents: MailContent[];
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
      .select("id, name, contact, communication_channel")
      .in("business_type_id", categoryIds);

    if (fetchError) throw fetchError;

    const targetMailCompanies = targetCompanies.filter(
      (company) => company.communication_channel === "mail"
    );
    const targetCompaniesMail = targetMailCompanies.map(
      (company) => company.contact
    );

    console.log(targetCompaniesMail);

    const { error: sendError } = await resend.emails.send({
      from: "masuda@tamat.jp",
      to: targetCompaniesMail,
      subject: title,
      react: EmailTemplate({ contents: contents }),
    });
    if (sendError) throw sendError;

    // Supabaseに送信記録を保存
    const { error: insertError } = await supabase.from("sent_mails").insert({
      mail_id: mailId,
      sent_at: new Date(),
    });
    if (insertError) throw insertError;

    const companyRecords = targetMailCompanies.map((company) => ({
      company_id: company.id,
      sent_mail_id: mailId,
    }));

    const { error: companiesInsertError } = await supabase
      .from("sent_mail_companies")
      .insert(companyRecords);
    if (companiesInsertError) throw companiesInsertError;

    // キャッシュの再検証
    revalidatePath("/mails", "layout");
    revalidatePath(`/mails/${mailId}`, "layout");
    return { success: true };
  } catch (error) {
    console.error("Newsletter sending failed:", error);
    return { success: false, error };
  }
}
