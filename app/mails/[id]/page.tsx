import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, MailIcon } from "lucide-react";
import Link from "next/link";
import { client } from "@/lib/microcms";
import { Mail } from "../page";
import { NewsletterForm } from "../../../components/mails/NewsletterForm";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { ContentRenderer } from "@/components/mails/EmailTemplate";

// microCMSから特定のメールを取得する関数
async function getMail(id: string) {
  try {
    const mail = await client.get<Mail>({
      endpoint: "mails",
      contentId: id,
    });
    return mail;
  } catch (error) {
    notFound();
  }
}

// 静的生成のためのパラメータを生成
export async function generateStaticParams() {
  const data = await client.getList<Mail>({
    endpoint: "mails",
    queries: { limit: 100 },
  });

  return data.contents.map((mail) => ({
    id: mail.id,
  }));
}

export default async function NewsletterDetail({
  params,
}: {
  params: { id: string };
}) {
  const mail = await getMail(params.id);

  const { data: sentMail } = await supabase
    .from("sent_mails")
    .select("*")
    .eq("mail_id", params.id)
    .single();

  type SentMailCompanies = {
    companies: { id: string; name: string };
  };

  const { data: sentMailCompanies } = (await supabase
    .from("sent_mail_companies")
    .select("companies:company_id (id, name)")
    .eq("sent_mail_id", params.id)) as { data: SentMailCompanies[] };
  console.log(sentMailCompanies);

  const sentDate = sentMail
    ? new Date(sentMail.sent_at).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/mails">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Newsletters
          </Button>
        </Link>
      </div>

      <Card className={cn("mb-8", sentMail && "border-l-4 border-l-green-500")}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Send Newsletter</CardTitle>
              {sentMail ? (
                <div className="flex flex-col">
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    送信済み
                  </div>
                  <div className="text-sm text-muted-foreground">
                    送信日時: {sentDate}
                  </div>
                </div>
              ) : (
                <div className="flex items-center text-yellow-600 text-sm font-medium">
                  <MailIcon className="h-4 w-4 mr-1" />
                  未送信
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sentMail ? (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground font-medium mb-2">
                送信先企業一覧:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {sentMailCompanies?.map((sentMailCompany) => (
                  <Link
                    key={sentMailCompany.companies.id}
                    href={`/companies/${sentMailCompany.companies.id}`}
                    className="px-3 py-2 rounded-md bg-muted text-sm"
                  >
                    {sentMailCompany.companies.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <NewsletterForm
              mailId={mail.id}
              title={mail.title}
              contents={mail.contents}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{mail.title}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            作成日: {new Date(mail.publishedAt).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mail.contents.map((content) => (
              <div key={content.fieldId}>
                <ContentRenderer content={content} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
