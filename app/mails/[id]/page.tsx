import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, MailIcon } from "lucide-react";
import Link from "next/link";
import { client } from "@/lib/microcms";
import ReactMarkdown from "react-markdown";
import { Mail, MailContent } from "../page";
import { NewsletterForm } from "../../../components/mails/NewsletterForm";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

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

// コンテンツ表示用のコンポーネント
function ContentRenderer({ content }: { content: MailContent }) {
  switch (content.fieldId) {
    case "rich-editor":
      return (
        <div
          dangerouslySetInnerHTML={{ __html: content.contents }}
          className="content-style"
        />
      );
    case "markdown":
      return (
        <ReactMarkdown className="content-style">
          {content.contents}
        </ReactMarkdown>
      );
    case "html":
      return (
        <div
          dangerouslySetInnerHTML={{ __html: content.contents }}
          className="content-style"
        />
      );
    default:
      return <p>{content.contents}</p>;
  }
}

export default async function NewsletterDetail({
  params,
}: {
  params: { id: string };
}) {
  const mail = await getMail(params.id);

  const { data: sentMail } = await supabase
    .from("sent_newsletters")
    .select("*")
    .eq("mail_id", params.id)
    .order("sent_at", { ascending: false })
    .limit(1);

  const isSent = sentMail && sentMail.length > 0;
  const sentDate = isSent
    ? new Date(sentMail[0].sent_at).toLocaleString("ja-JP", {
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

      <Card className={cn("mb-8", isSent && "border-l-4 border-l-green-500")}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Send Newsletter</CardTitle>
              {isSent ? (
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
          <NewsletterForm
            mailId={mail.id}
            title={mail.title}
            contents={mail.contents[0].contents}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{mail.title}</CardTitle>
            {isSent && (
              <div className="flex flex-col items-end">
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  送信済み
                </div>
                <div className="text-sm text-muted-foreground">{sentDate}</div>
              </div>
            )}
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
