import { supabase } from "@/lib/supabase";
import CompanyDetails from "./CompanyDetails";

async function getCompanyData(id: string) {
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (companyError) {
    console.error("会社データの取得中にエラーが発生しました:", companyError);
    throw new Error("会社データを取得できませんでした");
  }

  const { data: contactHistory, error: contactHistoryError } = await supabase
    .from("contact_history")
    .select("*")
    .eq("company_id", id)
    .order("contact_date", { ascending: false });

  if (contactHistoryError) {
    console.error(
      "連絡履歴の取得中にエラーが発生しました:",
      contactHistoryError
    );
    throw new Error("連絡履歴を取得できませんでした");
  }

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .eq("company_id", id)
    .order("billing_date", { ascending: false });

  if (projectsError) {
    console.error("案件データの取得中にエラーが発生しました:", projectsError);
    throw new Error("案件データを取得できませんでした");
  }

  return { company, contactHistory, projects };
}

export default async function CompanyPage({
  params,
}: {
  params: { id: string };
}) {
  const { company, contactHistory, projects } = await getCompanyData(params.id);

  return (
    <CompanyDetails
      company={company}
      contactHistory={contactHistory}
      projects={projects}
    />
  );
}
