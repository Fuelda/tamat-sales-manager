import { CompanyList } from "./components/CompanyList";
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
      <CompanyList
        companiesWithoutRecentContact={companiesWithoutRecentContact || []}
        companies={companies || []}
        contacts={contacts || []}
        projects={projects || []}
      />
    </div>
  );
}
