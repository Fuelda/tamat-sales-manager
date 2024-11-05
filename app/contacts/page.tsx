"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

// ステータスの選択肢を定義
const leadStatuses = [
  "初回接触",
  "興味あり",
  "提案中",
  "交渉中",
  "成約",
  "失注",
  "保留中",
  "フォローアップ中",
];

interface Contact {
  id: string;
  company_id: string;
  company_name: string;
  contact_date: string;
  content: string;
  status: string;
}

interface Company {
  id: string;
  name: string;
}

export const dynamic = "force-dynamic";
const ContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newContact, setNewContact] = useState<
    Omit<Contact, "id" | "company_name">
  >({
    company_id: "",
    contact_date: new Date().toISOString().split("T")[0],
    content: "",
    status: "", // 新しく追加
  });

  useEffect(() => {
    fetchContacts();
    fetchCompanies();
  }, []);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from("contact_history")
      .select(
        `
        id,
        company_id,
        companies (id, name),
        contact_date,
        content,
        status
      `
      )
      .order("contact_date", { ascending: false });

    if (error) {
      console.error("コンタクトデータの取得中にエラーが発生しました:", error);
    } else {
      setContacts(
        data.map((contact: any) => ({
          ...contact,
          company_name: contact.companies.name,
          company_id: contact.companies.id,
        }))
      );
    }
  };

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("会社データの取得中にエラーが発生しました:", error);
    } else {
      setCompanies(data);
    }
  };

  const addContact = async () => {
    const { data, error } = await supabase
      .from("contact_history")
      .insert([newContact])
      .select();

    if (error) {
      console.error("コンタクトの追加中にエラーが発生しました:", error);
    } else {
      fetchContacts();
      setNewContact({
        company_id: "",
        contact_date: new Date().toISOString().split("T")[0],
        content: "",
        status: "", // リセット
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">コンタクト一覧</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">新しいコンタクトを追加</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            value={newContact.company_id}
            onValueChange={(value) =>
              setNewContact({ ...newContact, company_id: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="会社を選択" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={newContact.contact_date}
            onChange={(e) =>
              setNewContact({ ...newContact, contact_date: e.target.value })
            }
          />
          <Textarea
            placeholder="コンタクト内容"
            value={newContact.content}
            onChange={(e) =>
              setNewContact({ ...newContact, content: e.target.value })
            }
            className="col-span-2"
            rows={4}
          />
          <Select
            value={newContact.status}
            onValueChange={(value) =>
              setNewContact({ ...newContact, status: value })
            }
          >
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
          <Button onClick={addContact} className="col-span-2">
            コンタクトを追加
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>会社名</TableHead>
            <TableHead>日付</TableHead>
            <TableHead>内容</TableHead>
            <TableHead>ステータス</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                {" "}
                <Link
                  href={`/companies/${contact.company_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.company_name}
                </Link>
              </TableCell>
              <TableCell>
                {new Date(contact.contact_date).toLocaleDateString("ja-JP")}
              </TableCell>
              <TableCell className="whitespace-pre-wrap">
                {contact.content}
              </TableCell>
              <TableCell>{contact.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactsPage;
