
import React from 'react';
import { Proposal } from '@/types/proposal';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ProposalTimelineProps {
  proposal: Partial<Proposal>;
  styles: {
    accentColor: string;
    accentBg: string;
    borderColor: string;
  };
}

const ProposalTimeline: React.FC<ProposalTimelineProps> = ({ proposal, styles }) => {
  return (
    <div className="mb-8">
      <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${styles.accentColor}`}>
        <Calendar className="h-5 w-5" />
        Project Timeline
      </h2>
      <div className={`${styles.accentBg} p-4 rounded-md border ${styles.borderColor}`}>
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="mb-4 sm:mb-0">
            <p className="font-medium text-muted-foreground">Start Date</p>
            <p className="font-semibold text-lg">
              {proposal.startDate 
                ? format(new Date(proposal.startDate), 'PPP') 
                : 'Not specified'}
            </p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">End Date</p>
            <p className="font-semibold text-lg">
              {proposal.endDate 
                ? format(new Date(proposal.endDate), 'PPP') 
                : 'Not specified'}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-dashed border-muted">
          <p className="text-sm text-muted-foreground">
            This timeline assumes prompt feedback and approvals. Any delays may impact the final delivery date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProposalTimeline;
