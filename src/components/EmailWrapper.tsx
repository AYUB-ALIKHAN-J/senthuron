
import React from 'react';
import { Proposal } from '@/types/proposal';
import ProposalPreview from './ProposalPreview';

interface EmailWrapperProps {
  proposal: Partial<Proposal>;
}

const EmailWrapper: React.FC<EmailWrapperProps> = ({ proposal }) => {
  // Create a processed copy of the proposal to ensure emails are properly clickable
  const processedProposal = {
    ...proposal,
    // We don't need special handling here anymore as we've updated the ProposalPreview component
    // to handle emails directly with proper links
  };
  
  return (
    <ProposalPreview 
      proposal={processedProposal} 
      template={proposal.preferredTemplate || 'standard'}
    />
  );
};

export default EmailWrapper;
