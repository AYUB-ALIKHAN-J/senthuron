
import React from 'react';
import { Proposal } from '@/types/proposal';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface ProposalHeaderProps {
  proposal: Partial<Proposal>;
  styles: {
    headerBg: string;
    headerText: string;
    accentColor: string;
    accentBg: string;
    borderColor: string;
  };
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({ proposal, styles }) => {
  const proposalId = proposal.id ? proposal.id.substring(0, 8) : 'Draft';
  
  return (
    <div className={`${styles.headerBg} ${styles.headerText} p-8`}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {proposal.tags?.includes('Web') 
              ? 'Web Development Proposal'
              : proposal.tags?.includes('Design')
              ? 'Design Services Proposal'
              : proposal.tags?.includes('Marketing')
              ? 'Marketing Strategy Proposal'
              : 'Business Proposal'}
          </h1>
          <p className="opacity-90">{proposal.companyName || 'Your Company Name'}</p>
          <p className="mt-1 text-sm opacity-80">Proposal #{proposalId}</p>
        </div>
        <div className="text-right">
          {proposal.createdAt && (
            <div className="mb-2 flex items-center justify-end gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(proposal.createdAt), 'PPP')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalHeader;
