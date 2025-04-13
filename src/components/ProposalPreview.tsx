
import React from 'react';
import { Proposal } from '@/types/proposal';

interface ProposalPreviewProps {
  proposal: Partial<Proposal>;
}

const ProposalPreview = React.forwardRef<HTMLDivElement, ProposalPreviewProps>(
  ({ proposal }, ref) => {
    return (
      <div ref={ref}>
        <pre>{JSON.stringify(proposal, null, 2)}</pre>
      </div>
    );
  }
);

ProposalPreview.displayName = 'ProposalPreview';

export default ProposalPreview;
