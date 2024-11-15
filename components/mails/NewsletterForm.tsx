"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { sendNewsletter } from "@/app/mails/[id]/actions/newsletter";
import { MailContent } from "@/app/mails/page";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { BusinessType, Company } from "@/types/company";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [targetCompanies, setTargetCompanies] = useState<
    Pick<Company, "id" | "contact" | "name">[]
  >([]);
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    fetchBusinessTypes();
  }, []);

  useEffect(() => {
    if (selectedTypes.length > 0) {
      fetchTargetCompanies();
    } else {
      setTargetCompanies([]);
    }
  }, [selectedTypes]);

  const fetchBusinessTypes = async () => {
    const { data, error } = await supabase
      .from("business_types")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Error fetching business types:", error);
      return;
    }

    setBusinessTypes(data);
  };

  const fetchTargetCompanies = async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("id, contact, name")
      .in("business_type_id", selectedTypes)
      .eq("communication_channel", "mail");

    if (error) {
      console.error("Error fetching target companies:", error);
      return;
    }
    setTargetCompanies(data);
  };

  const handleTypeChange = (typeId: number) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleRemoveCompany = (companyId: string) => {
    setTargetCompanies((prev) =>
      prev.filter((company) => company.id !== companyId)
    );
  };

  const handleSubmit = async () => {
    if (targetCompanies.length === 0) {
      toast({
        title: "エラー",
        description: "送信先企業が選択されていません",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmedSubmit = async () => {
    const result = await sendNewsletter({
      mailId,
      targetCompanies,
      title,
      contents,
    });

    if (result.success) {
      toast({
        title: "送信成功",
        description: "ニュースレターが正常に送信されました",
      });
    } else {
      toast({
        title: "送信エラー",
        description: "ニュースレターの送信に失敗しました",
        variant: "destructive",
      });
    }
    setShowConfirmDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">カテゴリーを選択</h3>
        <div className="flex flex-wrap gap-6">
          {businessTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type.id}`}
                checked={selectedTypes.includes(type.id)}
                onCheckedChange={() => handleTypeChange(type.id)}
              />
              <Label htmlFor={`type-${type.id}`}>{type.name}</Label>
            </div>
          ))}
        </div>
      </div>

      {targetCompanies.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {targetCompanies.map((company) => (
              <Button
                key={company.id}
                variant="outline"
                className="justify-between"
                onClick={() => handleRemoveCompany(company.id)}
              >
                {company.name} ✕
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            選択中の企業数: {targetCompanies.length}
          </p>
          <Button
            onClick={handleSubmit}
            disabled={targetCompanies.length === 0}
          >
            送信する
          </Button>
        </div>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>メール送信の確認</AlertDialogTitle>
            <AlertDialogDescription>
              選択された{targetCompanies.length}社にメールを送信します。
              よろしいですか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedSubmit}>
              送信する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
