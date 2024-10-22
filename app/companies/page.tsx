"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Company {
  id: string;
  name: string;
  contact: string;
  communication_channel: string;
  business_type: string;
  reach_method: string;
}

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newCompany, setNewCompany] = useState<Omit<Company, "id">>({
    name: "",
    contact: "",
    communication_channel: "",
    business_type: "",
    reach_method: "",
  });
  const [communicationChannels, setCommunicationChannels] = useState<string[]>(
    []
  );
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [reachMethods, setReachMethods] = useState<string[]>([]);
  const [newChannel, setNewChannel] = useState("");
  const [newBusinessType, setNewBusinessType] = useState("");
  const [newReachMethod, setNewReachMethod] = useState("");
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [isBusinessTypeDialogOpen, setIsBusinessTypeDialogOpen] =
    useState(false);
  const [isReachMethodDialogOpen, setIsReachMethodDialogOpen] = useState(false);

  useEffect(() => {
    fetchCompanies();
    fetchCommunicationChannels();
    fetchBusinessTypes();
    fetchReachMethods();
  }, []);

  const fetchCompanies = async () => {
    const { data, error } = await supabase.from("companies").select("*");
    if (error)
      console.error("会社データの取得中にエラーが発生しました:", error);
    else setCompanies(data as Company[]);
  };

  const fetchCommunicationChannels = async () => {
    const { data, error } = await supabase
      .from("communication_channels")
      .select("name")
      .order("name");

    if (error) {
      console.error(
        "コミュニケーションチャンネルの取得中にエラーが発生しました:",
        error
      );
    } else {
      setCommunicationChannels(data.map((channel) => channel.name));
    }
  };

  const fetchBusinessTypes = async () => {
    const { data, error } = await supabase
      .from("business_types")
      .select("name")
      .order("name");

    if (error) {
      console.error("業種の取得中にエラーが発生しました:", error);
    } else {
      setBusinessTypes(data.map((type) => type.name));
    }
  };

  const fetchReachMethods = async () => {
    const { data, error } = await supabase
      .from("reach_methods")
      .select("name")
      .order("name");

    if (error) {
      console.error("アプローチ方法の取得中にエラーが発生しました:", error);
    } else {
      setReachMethods(data.map((method) => method.name));
    }
  };

  const addCompany = async () => {
    const { data, error } = await supabase
      .from("companies")
      .insert([newCompany]);
    if (error) console.error("会社の追加中にエラーが発生しました:", error);
    else {
      fetchCompanies();
      setNewCompany({
        name: "",
        contact: "",
        communication_channel: "",
        business_type: "",
        reach_method: "",
      });
    }
  };

  const addNewChannel = async () => {
    if (newChannel.trim() === "") return;

    const { data, error } = await supabase
      .from("communication_channels")
      .insert({ name: newChannel.trim() })
      .select();

    if (error) {
      console.error("新しいチャンネルの追加中にエラーが発生しました:", error);
    } else {
      setCommunicationChannels([...communicationChannels, data[0].name]);
      setNewChannel("");
      setIsChannelDialogOpen(false);
    }
  };

  const addNewBusinessType = async () => {
    if (newBusinessType.trim() === "") return;

    const { data, error } = await supabase
      .from("business_types")
      .insert({ name: newBusinessType.trim() })
      .select();

    if (error) {
      console.error("新しい業種の追加中にエラーが発生しました:", error);
    } else {
      setBusinessTypes([...businessTypes, data[0].name]);
      setNewBusinessType("");
      setIsBusinessTypeDialogOpen(false);
    }
  };

  const addNewReachMethod = async () => {
    if (newReachMethod.trim() === "") return;

    const { data, error } = await supabase
      .from("reach_methods")
      .insert({ name: newReachMethod.trim() })
      .select();

    if (error) {
      console.error(
        "新しいアプローチ方法の追加中にエラーが発生しました:",
        error
      );
    } else {
      setReachMethods([...reachMethods, data[0].name]);
      setNewReachMethod("");
      setIsReachMethodDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">会社一覧</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">新しい会社を追加</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            placeholder="会社名"
            value={newCompany.name}
            onChange={(e) =>
              setNewCompany({ ...newCompany, name: e.target.value })
            }
          />
          <Input
            placeholder="連絡先"
            value={newCompany.contact}
            onChange={(e) =>
              setNewCompany({ ...newCompany, contact: e.target.value })
            }
          />
          <div className="flex gap-2">
            <Select
              value={newCompany.communication_channel}
              onValueChange={(value) =>
                setNewCompany({ ...newCompany, communication_channel: value })
              }
            >
              <SelectTrigger className="flex-grow">
                <SelectValue placeholder="コミュニケーションチャンネル" />
              </SelectTrigger>
              <SelectContent>
                {communicationChannels.map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog
              open={isChannelDialogOpen}
              onOpenChange={setIsChannelDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">新規追加</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新しいチャンネルを追加</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="新しいチャンネル名"
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                  />
                  <Button onClick={addNewChannel}>追加</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-2">
            <Select
              value={newCompany.business_type}
              onValueChange={(value) =>
                setNewCompany({ ...newCompany, business_type: value })
              }
            >
              <SelectTrigger className="flex-grow">
                <SelectValue placeholder="業種" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog
              open={isBusinessTypeDialogOpen}
              onOpenChange={setIsBusinessTypeDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">新規追加</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新しい業種を追加</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="新しい業種名"
                    value={newBusinessType}
                    onChange={(e) => setNewBusinessType(e.target.value)}
                  />
                  <Button onClick={addNewBusinessType}>追加</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-2">
            <Select
              value={newCompany.reach_method}
              onValueChange={(value) =>
                setNewCompany({ ...newCompany, reach_method: value })
              }
            >
              <SelectTrigger className="flex-grow">
                <SelectValue placeholder="アプローチ方法" />
              </SelectTrigger>
              <SelectContent>
                {reachMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog
              open={isReachMethodDialogOpen}
              onOpenChange={setIsReachMethodDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">新規追加</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新しいアプローチ方法を追加</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="新しいアプローチ方法"
                    value={newReachMethod}
                    onChange={(e) => setNewReachMethod(e.target.value)}
                  />
                  <Button onClick={addNewReachMethod}>追加</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Button onClick={addCompany}>会社を追加</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Communication Channel</TableHead>
            <TableHead>Business Type</TableHead>
            <TableHead>Reach Method</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.contact}</TableCell>
              <TableCell>{company.communication_channel}</TableCell>
              <TableCell>{company.business_type}</TableCell>
              <TableCell>{company.reach_method}</TableCell>
              <TableCell>
                <Link href={`/companies/${company.id}`} passHref>
                  <Button variant="outline">View</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesPage;
