"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";
import { useState } from "react";
import { sendNewsletter } from "../../app/mails/[id]/actions/newsletter";

const categories = [
  { id: 1, name: "Enterprise" },
  { id: 2, name: "Small Business" },
  { id: 3, name: "Startup" },
  { id: 4, name: "Non-Profit" },
];

interface NewsletterFormProps {
  mailId: string;
}

export function NewsletterForm({ mailId }: NewsletterFormProps) {
  const [sending, setSending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSending(true);
    try {
      const categoryId = parseInt(formData.get("category") as string);
      const result = await sendNewsletter(mailId, categoryId);
      if (!result.success) {
        throw new Error("Failed to send newsletter");
      }
      // 成功メッセージの表示などの処理
    } catch (error) {
      console.error(error);
      // エラーメッセージの表示などの処理
    } finally {
      setSending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Target Category</label>
        <Select name="category">
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button disabled={sending} className="w-full gap-2">
        <Send className="h-4 w-4" />
        {sending ? "Sending..." : "Send Newsletter"}
      </Button>
    </form>
  );
}
