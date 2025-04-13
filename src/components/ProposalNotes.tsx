
import React from 'react';
import { Proposal } from '@/types/proposal';
import { Info } from 'lucide-react';

interface ProposalNotesProps {
  proposal: Partial<Proposal>;
  styles: {
    accentColor: string;
    accentBg: string;
    borderColor: string;
  };
}

const ProposalNotes: React.FC<ProposalNotesProps> = ({ proposal, styles }) => {
  if (!proposal.notes) return null;
  
  return (
    <div className="mb-8">
      <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${styles.accentColor}`}>
        <Info className="h-5 w-5" />
        Additional Notes
      </h2>
      <div className={`${styles.accentBg} p-4 rounded-md border ${styles.borderColor} whitespace-pre-wrap`}>
        {proposal.notes}
        
        {!proposal.notes.includes("Terms") && proposal.standardTerms ? (
          <div className="mt-4 pt-4 border-t border-dashed border-muted">
            <p className="font-medium">Standard Terms:</p>
            <div className="whitespace-pre-wrap mt-2 text-sm">{proposal.standardTerms}</div>
          </div>
        ) : !proposal.notes.includes("Terms") && !proposal.standardTerms && (
          <div className="mt-4 pt-4 border-t border-dashed border-muted">
            <p className="font-medium">Standard Terms:</p>
            <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
              <li>50% deposit required to begin work</li>
              <li>Remaining balance due upon project completion</li>
              <li>Two rounds of revisions included</li>
              <li>Additional revisions billed at hourly rate</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalNotes;
