import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { client } from "@/lib/microcms";

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

export default async function Mails() {
  const mails = await getMails();

  return (
    <main className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Mails</h1>
      </div>

      <div className="flex flex-col gap-6">
        {mails.map((mail: Mail) => (
          <Link href={`/mails/${mail.id}`} key={mail.id}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{mail.title}</CardTitle>
                <CardDescription>
                  {new Date(mail.publishedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {mail.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
