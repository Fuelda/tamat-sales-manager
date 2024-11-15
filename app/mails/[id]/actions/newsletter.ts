"use server";

import { EmailTemplate } from "@/components/mails/EmailTemplate";
import { MailContent } from "@/app/mails/page";
import { resend } from "@/lib/resend";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { Company } from "@/types/company";

interface SendNewsletterParams {
  mailId: string;
  targetCompanies: Pick<Company, "id" | "contact" | "name">[];
  title: string;
  contents: MailContent[];
}

export async function sendNewsletter({
  mailId,
  targetCompanies,
  title,
  contents,
}: SendNewsletterParams) {
  try {
    // 各企業ごとにメールを送信
    for (const company of targetCompanies) {
      const { error: sendError } = await resend.emails.send({
        from: "masuda@tamat.jp",
        to: [company.contact], 
        subject: title,
        react: EmailTemplate({ contents: contents, recipientName: company.name }),
      });
      if (sendError) {
        console.error(`Failed to send email to ${company.name}:`, sendError);
        // エラーが発生しても続行
        continue;
      }
    }

    // Supabaseに送信記録を保存
    const { error: insertError } = await supabase.from("sent_mails").insert({
      mail_id: mailId,
      sent_at: new Date().toISOString(),
    });
    if (insertError) throw insertError;

    const companyRecords = targetCompanies.map((company) => ({
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
