
import React from 'react';
import { Proposal } from '@/types/proposal';

interface EmailWrapperProps {
  proposal: Partial<Proposal>;
}

const EmailWrapper: React.FC<EmailWrapperProps> = ({ proposal }) => {
  // Create a processed copy of the proposal to add the needed classes
  const processedProposal = {
    ...proposal,
    clientEmail: proposal.clientEmail 
      ? `<span class="client-email">${proposal.clientEmail}</span>` 
      : undefined
  };
  
  return <div>{JSON.stringify(processedProposal)}</div>;
};

export default EmailWrapper;
