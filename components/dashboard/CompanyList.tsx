"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { CompanyChart, ContactChart, ProjectChart } from "./DashboardCharts";
import { Company } from "@/types/company";
import { Contact } from "@/types/contact";
import { Project } from "@/types/project";
import NumberTicker from "../ui/number-ticker";
import { CommunicationChannelChart } from "./CommunicationChannelChart";

type CompanyListProps = {
  companiesWithoutRecentContact: (Pick<
    Company,
    "id" | "name" | "business_type_id"
  > & {
    latestContact?: Pick<Contact, "contact_date" | "content">;
  })[];
  companies: Company[] | null;
  contacts: Contact[];
  projects: Project[];
  channelOptions: { id: number; name: string | null }[];
};

export function CompanyList({
  companiesWithoutRecentContact,
  companies,
  contacts,
  projects,
  channelOptions,
}: CompanyListProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div />;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {companiesWithoutRecentContact.length > 0 && (
        <Card className="mb-8 border-red-500 border-2">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
              最近コンタクトがない会社
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {companiesWithoutRecentContact.map((company) => (
                <li key={company.id} className="border-b pb-2">
                  <Link
                    href={`/companies/${company.id}`}
                    className="text-blue-600 hover:underline text-lg font-semibold"
                  >
                    {company.name}
                  </Link>
                  <p className="text-sm text-gray-600">
                    最終コンタクト日:{" "}
                    {company.latestContact
                      ? formatDate(company.latestContact.contact_date)
                      : "記録なし"}
                  </p>
                  {company.latestContact && (
                    <p className="text-sm mt-1">
                      最終コンタクト内容:{" "}
                      {company.latestContact.content.substring(0, 100)}...
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>会社</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4">
              <NumberTicker value={companies?.length ?? 0} />
            </p>

            {/* <div className="mt-12">
              {companies && (
                <CompanyChart companies={companies} contacts={contacts} />
              )}
            </div> */}

            <div className="mb-4">
              <CommunicationChannelChart
                companies={companies}
                channelOptions={channelOptions}
              />
            </div>

            <Button asChild>
              <Link href="/companies">一覧を見る</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>コンタクト</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4">
              <NumberTicker value={contacts.length} />
            </p>
            <ul className="list-none mb-4">
              {contacts.slice(0, 5).map((contact) => (
                <li key={contact.id} className="mb-2">
                  <span className="font-semibold">
                    {contact.companies?.name}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {formatDate(contact.contact_date)}
                  </span>
                  <br />
                  <span className="text-sm">
                    {contact.content.substring(0, 30)}...
                  </span>
                </li>
              ))}
            </ul>
            <Button asChild>
              <Link href="/contacts">一覧を見る</Link>
            </Button>
            {/* <div className="mt-12">
              <ContactChart contacts={contacts} />
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>プロジェクト</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4">{projects.length}</p>
            <ul className="list-none mb-4">
              {projects.slice(0, 5).map((project) => (
                <li key={project.id} className="mb-2">
                  <span className="font-semibold">
                    {project.companies?.name}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {formatPrice(project.price)}
                  </span>
                  <br />
                  <span className="text-sm">
                    請求日: {formatDate(project.billing_date)}
                  </span>
                </li>
              ))}
            </ul>
            <Button asChild>
              <Link href="/projects">一覧を見る</Link>
            </Button>
            <div className="mt-12">
              <ProjectChart projects={projects} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
