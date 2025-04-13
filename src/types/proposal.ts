
export interface ServiceItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Proposal {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  companyName?: string;
  services: ServiceItem[];
  startDate: Date | null;
  endDate: Date | null;
  notes: string;
  executiveSummary?: string;
  standardTerms?: string;
  tags: string[];
  createdAt: Date;
  status: 'created' | 'pending' | 'deleted';
  currency: string;
  preferredTemplate?: string;
}

export interface ProposalFormData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  companyName?: string;
  services: ServiceItem[];
  startDate: Date | null;
  endDate: Date | null;
  notes: string;
  executiveSummary?: string;
  standardTerms?: string;
  tags: string[];
  currency: string;
  createdAt?: Date;
  preferredTemplate?: string;
}
