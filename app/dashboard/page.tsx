import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CompanyChart, ContactChart, ProjectChart } from "./DashboardCharts";
import { supabase } from "@/lib/supabase";

export default async function Dashboard() {
  const { data: companies } = await supabase.from("companies").select("*");
  const { data: contacts } = await supabase
    .from("contact_history")
    .select("*,companies(name)");
  const { data: projects } = await supabase
    .from("projects")
    .select("*,companies(name)");

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const companiesWithoutRecentContact = companies
    ?.filter((company) => {
      const latestContact = contacts
        ?.filter((contact) => contact.company_id === company.id)
        .sort(
          (a, b) =>
            new Date(b.contact_date).getTime() -
            new Date(a.contact_date).getTime()
        )[0];
      return (
        !latestContact || new Date(latestContact.contact_date) < oneMonthAgo
      );
    })
    .map((company) => {
      const latestContact = contacts
        ?.filter((contact) => contact.company_id === company.id)
        .sort(
          (a, b) =>
            new Date(b.contact_date).getTime() -
            new Date(a.contact_date).getTime()
        )[0];
      return {
        ...company,
        latestContact,
      };
    });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>

      {companiesWithoutRecentContact &&
        companiesWithoutRecentContact.length > 0 && (
          <Card className="mb-8 border-red-500 border-2">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                注意：最近コンタクトがない会社
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
                        ? new Date(
                            company.latestContact.contact_date
                          ).toLocaleDateString()
                        : "記録なし"}
                    </p>
                    {company.latestContact && (
                      <p className="text-sm mt-1">
                        最終コンタクト内容:{" "}
                        {company.latestContact.content.substring(0, 100)}...
                      </p>
                    )}
                    <Button
                      asChild
                      className="mt-2"
                      variant="outline"
                      size="sm"
                    >
                      <Link href={`/companies/${company.id}`}>詳細を見る</Link>
                    </Button>
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
            <p className="text-4xl font-bold mb-4">{companies?.length || 0}</p>
            <ul className="list-none mb-4">
              {companies?.slice(0, 5).map((company) => (
                <li key={company.id} className="mb-2">
                  <Link
                    href={`/companies/${company.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {company.name}
                  </Link>
                  <span className="text-sm text-gray-500 ml-2">
                    {company.business_type}
                  </span>
                </li>
              ))}
            </ul>
            <Button asChild>
              <Link href="/companies">詳細を見る</Link>
            </Button>
            <CompanyChart
              companies={companies || []}
              contacts={contacts || []}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>コンタクト</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4">{contacts?.length || 0}</p>
            <ul className="list-none mb-4">
              {contacts?.slice(0, 5).map((contact) => (
                <li key={contact.id} className="mb-2">
                  <span className="font-semibold">
                    {contact.companies?.name}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(contact.contact_date).toLocaleDateString()}
                  </span>
                  <br />
                  <span className="text-sm">
                    {contact.content.substring(0, 30)}...
                  </span>
                </li>
              ))}
            </ul>
            <Button asChild>
              <Link href="/contacts">詳細を見る</Link>
            </Button>
            <ContactChart contacts={contacts || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>プロジェクト</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4">{projects?.length || 0}</p>
            <ul className="list-none mb-4">
              {projects?.slice(0, 5).map((project) => (
                <li key={project.id} className="mb-2">
                  <span className="font-semibold">
                    {project.companies?.name}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    ¥{project.price.toLocaleString()}
                  </span>
                  <br />
                  <span className="text-sm">
                    請求日:{" "}
                    {new Date(project.billing_date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
            <Button asChild>
              <Link href="/projects">詳細を見る</Link>
            </Button>
            <ProjectChart projects={projects || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
