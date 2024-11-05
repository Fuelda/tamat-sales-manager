"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

type CompanyChartProps = {
  companies: any[];
  contacts: any[];
};

export function CompanyChart({ companies, contacts }: CompanyChartProps) {
  const contactsByCompany = contacts?.reduce((acc, contact) => {
    acc[contact.company_id] = (acc[contact.company_id] || 0) + 1;
    return acc;
  }, {});

  const contactsByCompanyChartData = companies
    ?.map((company) => ({
      name: company.name,
      コンタクト数: contactsByCompany[company.id] || 0,
    }))
    .sort((a, b) => b.コンタクト数 - a.コンタクト数)
    .slice(0, 5);

  return (
    <BarChart width={300} height={200} data={contactsByCompanyChartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="コンタクト数" fill="#8884d8" />
    </BarChart>
  );
}

type ContactChartProps = {
  contacts: any[];
};

export function ContactChart({ contacts }: ContactChartProps) {
  const contactsByMonth = contacts?.reduce((acc, contact) => {
    const month = new Date(contact.contact_date).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const contactsByMonthChartData = Object.entries(contactsByMonth || {}).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <BarChart width={300} height={200} data={contactsByMonthChartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#82ca9d" name="コンタクト数" />
    </BarChart>
  );
}

type ProjectChartProps = {
  projects: any[];
};

export function ProjectChart({ projects }: ProjectChartProps) {
  const projectStatusData = projects?.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  const projectStatusChartData = Object.entries(projectStatusData || {}).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <PieChart width={300} height={200}>
      <Pie
        data={projectStatusChartData}
        cx={150}
        cy={100}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {projectStatusChartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
