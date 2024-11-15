export type Project = {
  id: string;
  company_id: string|null;
  price: number;
  billing_date: string;
  payment_date: string|null;
  created_at: string|null;
  updated_at: string|null;
  status: string|null;
  companies: { name: string }|null;
};
