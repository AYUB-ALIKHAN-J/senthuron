
// This is a read-only file, but we need to add the client-email class to emails
// We'll need to create a custom wrapper component instead

import React from 'react';
import { Proposal } from '@/types/proposal';
import EmailWrapper from './EmailWrapper';

interface ProposalPreviewProps {
  proposal: Partial<Proposal>;
}

const CustomProposalPreview = React.forwardRef<HTMLDivElement, ProposalPreviewProps>(
  (props, ref) => {
    const { proposal } = props;
    
    // We'll wrap the original ProposalPreview with our custom component
    // that adds the necessary classes for emails
    return (
      <div ref={ref}>
        <EmailWrapper proposal={proposal} />
      </div>
    );
  }
);

CustomProposalPreview.displayName = 'CustomProposalPreview';

export default CustomProposalPreview;
