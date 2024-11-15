import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { client } from "@/lib/microcms";
import { supabase } from "@/lib/supabase";

export type Mail = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  contents: MailContent[];
};

export type MailContent = {
  fieldId: "rich-editor" | "markdown" | "html";
  contents: string;
};

// microCMSのSDKを使用してデータを取得する関数
async function getMails() {
  const data = await client.getList<Mail>({
    endpoint: "mails",
    queries: { limit: 100 },
  });

  return data.contents;
}

// 送信済みメールのIDを取得する関数を追加
async function getSentMailIds() {
  const { data: sentMails } = await supabase
    .from("sent_mails")
    .select("mail_id");

  return new Set(sentMails?.map((mail) => mail.mail_id) || []);
}

export default async function Mails() {
  const [mails, sentMailIds] = await Promise.all([
    getMails(),
    getSentMailIds(),
  ]);

  return (
    <main className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Mails</h1>
      </div>

      <div className="flex flex-col gap-6">
        {mails.map((mail: Mail) => {
          const isSent = sentMailIds.has(mail.id);
          return (
            <Link href={`/mails/${mail.id}`} key={mail.id}>
              <Card
                className={`
                  hover:shadow-lg 
                  transition-all 
                  cursor-pointer
                  ${isSent ? "bg-muted border-muted-foreground/20" : ""}
                  ${isSent ? "relative overflow-hidden" : ""}
                `}
              >
                {isSent && (
                  <div className="absolute top-0 right-0 w-20 h-20">
                    <div className="absolute transform rotate-45 bg-green-600 text-white text-xs font-semibold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                      送信済み
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CardTitle>{mail.title}</CardTitle>
                    {isSent && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        送信済み
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    {new Date(mail.publishedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p
                    className={`text-sm ${
                      isSent
                        ? "text-muted-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {mail.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
