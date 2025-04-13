
import React from 'react';
import { Proposal } from '@/types/proposal';
import { Info } from 'lucide-react';

interface ProposalSummaryProps {
  proposal: Partial<Proposal>;
  styles: {
    accentColor: string;
  };
}

const ProposalSummary: React.FC<ProposalSummaryProps> = ({ proposal, styles }) => {
  return (
    <div className="mb-8">
      <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${styles.accentColor}`}>
        <Info className="h-5 w-5" />
        Executive Summary
      </h2>
      <div className="prose max-w-none">
        {proposal.executiveSummary ? (
          <div className="whitespace-pre-wrap">{proposal.executiveSummary}</div>
        ) : (
          <>
            <p>
              Thank you for considering our services. This proposal outlines our recommended approach
              for your project, including scope of work, pricing, and timeline.
            </p>
            <p className="mt-2">
              Our team specializes in delivering high-quality solutions tailored to your specific needs,
              ensuring that we meet and exceed your expectations.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProposalSummary;
