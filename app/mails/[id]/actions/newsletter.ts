"use server";

import { EmailTemplate } from "@/components/mails/EmailTemplate";
import { MailContent } from "@/app/mails/page";
import { resend } from "@/lib/resend";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { Company } from "@/types/company";
import { slack } from "@/lib/slack";

interface SendMailParams {
  mailId: string;
  targetCompanies: Pick<Company, "id" | "contact" | "name">[];
  title: string;
  contents: MailContent[];
}

interface SendSlackParams {
  mailId: string;
  // targetCompanies: Pick<Company, "id" | "contact" | "name">[];
  channel: string;
  contents: MailContent[];
}

export async function sendNewsletter({
  mailId,
  targetCompanies,
  title,
  contents,
}: SendMailParams) {
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

export async function sendSlackMessage({ contents, channel, mailId }: SendSlackParams) {
  try {
    const contentsText = contents.map((content) => content.contents).join("\n");
    const result = await slack.chat.postMessage({
      channel: channel,
      text: contentsText,
    });

    if (!result.ok) {
      console.error("Slack message sending failed:", result);
      return { success: false, error: result.error };
    }

    // Supabaseに送信記録を保存
    const { error: insertError } = await supabase.from("sent_mails").insert({
      mail_id: mailId,
      sent_at: new Date().toISOString(),
      type: 'slack'  // メールと区別するためのtype
    });
    if (insertError) throw insertError;

    // キャッシュの再検証
    revalidatePath(`/mails/${mailId}`, "layout");
    
    return { success: true };
  } catch (error) {
    console.error("Slack message sending failed:", error);
    return { success: false, error };
  }
}
