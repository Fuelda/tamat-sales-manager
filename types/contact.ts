export type Contact = {
  id: string;
  company_id: string|null;
  content: string;
  status: string;
  contact_date: string;
  created_at: string|null;
  updated_at: string|null;
  companies: { name: string }|null;
};
