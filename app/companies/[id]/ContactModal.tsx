"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { leadStatuses } from "@/constants/leadStatuses";

interface ContactModalProps {
  companyId: string;
  onContactAdded: () => void;
}

export default function ContactModal({
  companyId,
  onContactAdded,
}: ContactModalProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("initial");
  const [contactDate, setContactDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content || !status || !contactDate) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_history").insert([
        {
          company_id: companyId,
          content,
          status,
          contact_date: new Date(contactDate).toISOString(),
        },
      ]);

      if (error) throw error;

      setContent("");
      setStatus("initial");
      setContactDate(new Date().toISOString().split("T")[0]);
      setOpen(false);
      onContactAdded();
    } catch (error) {
      console.error("連絡履歴の追加中にエラーが発生しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>新規連絡を追加</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新規連絡を追加</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="contactDate">日付</Label>
            <Input
              type="date"
              id="contactDate"
              value={contactDate}
              onChange={(e) => setContactDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">内容</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="連絡内容を入力してください"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">ステータス</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="ステータスを選択" />
              </SelectTrigger>
              <SelectContent>
                {leadStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "送信中..." : "保存"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
