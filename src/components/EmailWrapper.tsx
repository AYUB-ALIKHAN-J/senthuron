
import React from 'react';
import { Proposal } from '@/types/proposal';
import ProposalPreview from './ProposalPreview';

interface EmailWrapperProps {
  proposal: Partial<Proposal>;
}

const EmailWrapper: React.FC<EmailWrapperProps> = ({ proposal }) => {
  return (
    <ProposalPreview 
      proposal={proposal} 
      template={proposal.preferredTemplate || 'standard'}
    />
  );
};

export default EmailWrapper;
