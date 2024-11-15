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
import { Project } from "@/types/project";
import { Company } from "@/types/company";

const PROJECT_STATUSES = [
  "調整中",
  "見積済",
  "請求済",
  "納品済",
  "入金済",
  "キャンセル",
] as const;

export const dynamic = "force-dynamic";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    company_id: "",
    price: 0,
    billing_date: "",
    payment_date: "",
    status: "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetchProjects();
    fetchCompanies();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        companies (
          id,
          name
        )
      `
      )
      .order("billing_date", { ascending: false });
    if (error) console.error("Error fetching projects:", error);
    else setProjects(data);
  }

  async function fetchCompanies() {
    const { data, error } = await supabase.from("companies").select("id, name");
    if (error) console.error("Error fetching companies:", error);
    else setCompanies(data as Company[]);
  }

  async function addProject() {
    const { data, error } = await supabase
      .from("projects")
      .insert([newProject]);
    if (error) console.error("Error adding project:", error);
    else {
      fetchProjects();
      setNewProject({
        company_id: "",
        price: 0,
        billing_date: "",
        payment_date: "",
        status: "",
      });
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Add New Project</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <select
            className="border p-2 rounded"
            value={newProject.company_id}
            onChange={(e) =>
              setNewProject({ ...newProject, company_id: e.target.value })
            }
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="Price"
            value={newProject.price}
            onChange={(e) =>
              setNewProject({ ...newProject, price: Number(e.target.value) })
            }
          />
          <Input
            type="date"
            placeholder="Billing Date"
            value={newProject.billing_date}
            onChange={(e) =>
              setNewProject({ ...newProject, billing_date: e.target.value })
            }
          />
          <Input
            type="date"
            placeholder="Payment Date"
            value={newProject.payment_date}
            onChange={(e) =>
              setNewProject({ ...newProject, payment_date: e.target.value })
            }
          />
          <select
            className="border p-2 rounded"
            value={newProject.status}
            onChange={(e) =>
              setNewProject({ ...newProject, status: e.target.value })
            }
          >
            <option value="">ステータスを選択</option>
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <Button onClick={addProject}>Add Project</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Billing Date</TableHead>
            <TableHead>Payment Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <Link href={`/companies/${project.company_id}`}>
                  <span className="text-blue-600 hover:underline">
                    {project.companies?.name}
                  </span>
                </Link>
              </TableCell>
              <TableCell>¥{project.price.toLocaleString()}</TableCell>
              <TableCell>
                {new Date(project.billing_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {project.payment_date
                  ? new Date(project.payment_date).toLocaleDateString()
                  : "Not paid"}
              </TableCell>
              <TableCell>{project.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
