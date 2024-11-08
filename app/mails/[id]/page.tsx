import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { client } from "@/lib/microcms";
import ReactMarkdown from "react-markdown";
import { Mail, MailContent } from "../page";

const categories = [
  { id: 1, name: "Enterprise" },
  { id: 2, name: "Small Business" },
  { id: 3, name: "Startup" },
  { id: 4, name: "Non-Profit" },
];

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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Send Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full gap-2">
              <Send className="h-4 w-4" />
              Send Newsletter
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{mail.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {new Date(mail.publishedAt).toLocaleDateString()}
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
