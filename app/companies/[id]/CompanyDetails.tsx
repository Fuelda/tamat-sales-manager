"use client";

import React from "react";
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

interface Company {
  id: string;
  name: string;
  contact: string;
  communication_channel: string;
  business_type: string;
  reach_method: string;
  created_at: string;
  updated_at: string;
}

interface ContactHistory {
  id: string;
  company_id: string;
  content: string;
  status: string;
  contact_date: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  company_id: string;
  price: number;
  billing_date: string;
  payment_date: string;
  created_at: string;
  updated_at: string;
}

interface CompanyDetailsProps {
  company: Company;
  contactHistory: ContactHistory[];
  projects: Project[];
}

export default function CompanyDetails({
  company,
  contactHistory,
  projects,
}: CompanyDetailsProps) {
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
                <strong>連絡先:</strong> {company.contact}
              </p>
              <p>
                <strong>連絡媒体:</strong> {company.communication_channel}
              </p>
              <p>
                <strong>事業内容:</strong> {company.business_type}
              </p>
              <p>
                <strong>リーチ手段:</strong> {company.reach_method}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">登録情報</h3>
              <p>
                <strong>作成日時:</strong>{" "}
                {new Date(company.created_at).toLocaleString()}
              </p>
              <p>
                <strong>更新日時:</strong>{" "}
                {new Date(company.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>連絡履歴</CardTitle>
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
                  <TableCell>{history.content}</TableCell>
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
                  <p>
                    <strong>支払日:</strong>{" "}
                    {new Date(project.payment_date).toLocaleDateString()}
                  </p>
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
