
import React from 'react';
import { Proposal } from '@/types/proposal';
import { Tag } from 'lucide-react';

interface ProposalTagsProps {
  proposal: Partial<Proposal>;
  styles: {
    accentColor: string;
  };
}

const ProposalTags: React.FC<ProposalTagsProps> = ({ proposal, styles }) => {
  if (!proposal.tags || proposal.tags.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${styles.accentColor}`}>
        <Tag className="h-5 w-5" />
        Categories
      </h2>
      <div className="flex flex-wrap gap-2">
        {proposal.tags.map((tag) => (
          <span key={tag} className="proposal-tag inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProposalTags;
