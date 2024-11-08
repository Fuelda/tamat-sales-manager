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
import { useState, useEffect } from "react";
import { sendNewsletter } from "../../app/mails/[id]/actions/newsletter";
import { supabase } from "@/lib/supabase";

interface BusinessType {
  id: number;
  name: string;
}

interface NewsletterFormProps {
  mailId: string;
}

export function NewsletterForm({ mailId }: NewsletterFormProps) {
  const [sending, setSending] = useState(false);
  const [categories, setCategories] = useState<BusinessType[]>([]);

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
