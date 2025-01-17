"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import ContactModal from "./ContactModal";
import { BusinessType, Company } from "@/types/company";
import { Contact } from "@/types/contact";
import { Project } from "@/types/project";

interface CompanyDetailsProps {
  company: Company;
  contactHistory: Omit<Contact, "companies">[];
  projects: Omit<Project, "companies">[];
  businessTypes: BusinessType[];
}

export default function CompanyDetails({
  company,
  contactHistory: initialContactHistory,
  projects,
  businessTypes,
}: CompanyDetailsProps) {
  const [contactHistory, setContactHistory] = useState(initialContactHistory);

  const handleContactAdded = async () => {
    const { data, error } = await supabase
      .from("contact_history")
      .select("*")
      .eq("company_id", company.id)
      .order("contact_date", { ascending: false });

    if (error) {
      console.error("連絡履歴の再取得中にエラーが発生しました:", error);
      return;
    }

    setContactHistory(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{company.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">会社情報</h3>
              <p>
                <strong>連絡先:</strong>{" "}
                <a
                  href={
                    company.communication_channel === "mail"
                      ? `mailto:${company.contact}`
                      : company.contact
                  }
                  target="_blank"
                >
                  {company.contact}
                </a>
              </p>
              <p>
                <strong>連絡媒体: </strong>
                {company.communication_channel}
              </p>
              <p>
                <strong>事業内容: </strong>
                {businessTypes.find(
                  (type) => type.id === company.business_type_id
                )?.name || "-"}
              </p>
              <p>
                <strong>リーチ手段:</strong> {company.reach_method}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">登録情報</h3>
              {company.created_at && (
                <p>
                  <strong>作成日時:</strong>{" "}
                  {new Date(company.created_at).toLocaleString()}
                </p>
              )}
              {company.updated_at && (
                <p>
                  <strong>更新日時:</strong>{" "}
                  {new Date(company.updated_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>連絡履歴</CardTitle>
          <ContactModal
            companyId={company.id}
            onContactAdded={handleContactAdded}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日付</TableHead>
                <TableHead>内容</TableHead>
                <TableHead>ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contactHistory.map((history) => (
                <TableRow key={history.id}>
                  <TableCell>
                    {new Date(history.contact_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="whitespace-pre-wrap">
                    {history.content}
                  </TableCell>
                  <TableCell>
                    <Badge>{history.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>案件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="pt-6">
                  <p>
                    <strong>金額:</strong> ¥{project.price.toLocaleString()}
                  </p>
                  <p>
                    <strong>請求日:</strong>{" "}
                    {new Date(project.billing_date).toLocaleDateString()}
                  </p>
                  {project.payment_date && (
                    <p>
                      <strong>支払日:</strong>{" "}
                      {new Date(project.payment_date).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-center">
        <Link href="/companies" passHref>
          <Button variant="outline">会社一覧に戻る</Button>
        </Link>
      </div>
    </div>
  );
}
