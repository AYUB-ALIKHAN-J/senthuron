
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
  services: ServiceItem[];
  startDate: Date | null;
  endDate: Date | null;
  notes: string;
  tags: string[];
  createdAt: Date;
  status: 'created' | 'pending' | 'deleted';
  currency: string;
}

export interface ProposalFormData {
  clientName: string;
  clientEmail: string;
  services: ServiceItem[];
  startDate: Date | null;
  endDate: Date | null;
  notes: string;
  tags: string[];
  currency: string;
}
