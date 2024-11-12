import { MailContent } from "@/app/mails/page";
import ReactMarkdown from "react-markdown";
import * as React from "react";

interface EmailTemplateProps {
  contents: MailContent[];
}

// コンテンツ表示用のコンポーネント
export function ContentRenderer({ content }: { content: MailContent }) {
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

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  contents,
}) => (
  <div className="space-y-4">
    {contents.map((content) => (
      <div key={content.fieldId}>
        <ContentRenderer content={content} />
      </div>
    ))}
  </div>
);
