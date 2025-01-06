export type Company = {
  id: string;
  name: string;
  contact: string;
  communication_channel: string;
  reach_method: string;
  created_at: string|null;
  updated_at: string|null;
  business_type_id: number|null;
  lead_status_id: string|null;
  person_in_charge: string|null;
};

export type BusinessType = {
  id: number;
  name: string;
}
