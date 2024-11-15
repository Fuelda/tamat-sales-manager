import { MailContent } from "@/app/mails/page";
import ReactMarkdown from "react-markdown";
import * as React from "react";

interface EmailTemplateProps {
  contents: MailContent[];
  recipientName?: string;
}

// コンテンツ表示用のコンポーネント
export function ContentRenderer({ content }: { content: MailContent }) {
  switch (content.fieldId) {
    case "rich-editor":
      return <div dangerouslySetInnerHTML={{ __html: content.contents }} />;
    case "markdown":
      return <ReactMarkdown>{content.contents}</ReactMarkdown>;
    case "html":
      return <div dangerouslySetInnerHTML={{ __html: content.contents }} />;
    default:
      return <p>{content.contents}</p>;
  }
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  contents,
  recipientName,
}) => (
  <div className="content-style">
    {recipientName ? <p>{recipientName}様</p> : <p>〇〇様</p>}
    {contents.map((content) => (
      <div key={content.fieldId}>
        <ContentRenderer content={content} />
      </div>
    ))}
  </div>
);
