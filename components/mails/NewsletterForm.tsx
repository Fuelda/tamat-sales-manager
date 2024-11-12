"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { sendNewsletter } from "../../app/mails/[id]/actions/newsletter";
import { supabase } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import { MailContent } from "@/app/mails/page";

interface BusinessType {
  id: number;
  name: string;
}

interface NewsletterFormProps {
  mailId: string;
  title: string;
  contents: MailContent[];
}

export function NewsletterForm({
  mailId,
  title,
  contents,
}: NewsletterFormProps) {
  const [sending, setSending] = useState(false);
  const [categories, setCategories] = useState<BusinessType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  useEffect(() => {
    async function fetchBusinessTypes() {
      const { data, error } = await supabase
        .from("business_types")
        .select("id, name");

      if (error) {
        console.error("Error fetching business types:", error);
        return;
      }

      setCategories(data);
    }

    fetchBusinessTypes();
  }, []);

  async function handleSubmit(formData: FormData) {
    setSending(true);
    try {
      const result = await sendNewsletter({
        mailId,
        categoryIds: selectedCategories,
        title,
        contents,
      });
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
        <label className="text-sm font-medium">対象カテゴリー</label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => {
                  setSelectedCategories((prev) =>
                    checked
                      ? [...prev, category.id]
                      : prev.filter((id) => id !== category.id)
                  );
                }}
              />
              <label
                htmlFor={`category-${category.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button disabled={sending} className="w-full gap-2">
        <Send className="h-4 w-4" />
        {sending ? "Sending..." : "Send Newsletter"}
      </Button>
    </form>
  );
}
