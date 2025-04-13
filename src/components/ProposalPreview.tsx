
import React from 'react';
import { Proposal } from '@/types/proposal';
import { Separator } from '@/components/ui/separator';
import ProposalHeader from './ProposalHeader';
import ClientInformation from './ClientInformation';
import ProposalSummary from './ProposalSummary';
import ProposalServices from './ProposalServices';
import ProposalTimeline from './ProposalTimeline';
import ProposalNotes from './ProposalNotes';
import ProposalTags from './ProposalTags';

interface ProposalPreviewProps {
  proposal: Partial<Proposal>;
  template?: string;
}

const ProposalPreview = React.forwardRef<HTMLDivElement, ProposalPreviewProps>(
  ({ proposal, template = 'standard' }, ref) => {
    const getTemplateStyles = () => {
      switch (template) {
        case 'formal':
          return {
            headerBg: 'bg-slate-900',
            headerText: 'text-white',
            accentColor: 'text-slate-800',
            accentBg: 'bg-slate-100',
            borderColor: 'border-slate-200',
          };
        case 'detailed':
          return {
            headerBg: 'bg-blue-800',
            headerText: 'text-white',
            accentColor: 'text-blue-700',
            accentBg: 'bg-blue-50',
            borderColor: 'border-blue-100',
          };
        case 'summary':
          return {
            headerBg: 'bg-emerald-700',
            headerText: 'text-white',
            accentColor: 'text-emerald-700',
            accentBg: 'bg-emerald-50',
            borderColor: 'border-emerald-100',
          };
        case 'standard':
        default:
          return {
            headerBg: 'bg-primary',
            headerText: 'text-primary-foreground',
            accentColor: 'text-primary',
            accentBg: 'bg-primary/10',
            borderColor: 'border-muted',
          };
      }
    };

    const styles = getTemplateStyles();

    return (
      <div ref={ref} className="p-8 max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 print:shadow-none">
          {/* Cover Section / Header */}
          <ProposalHeader proposal={proposal} styles={styles} />

          <div className="p-8">
            {/* Client Information */}
            <ClientInformation proposal={proposal} styles={styles} />

            {/* Introduction / Summary */}
            <ProposalSummary proposal={proposal} styles={styles} />

            {/* Services */}
            <ProposalServices proposal={proposal} styles={styles} />

            {/* Timeline */}
            <ProposalTimeline proposal={proposal} styles={styles} />

            {/* Notes */}
            <ProposalNotes proposal={proposal} styles={styles} />

            {/* Tags */}
            <ProposalTags proposal={proposal} styles={styles} />

            {/* Footer */}
            <Separator className="my-8" />
            <div className="text-center">
              <p className="text-muted-foreground">Thank you for considering our services!</p>
              <p className="mt-1">
                For any questions, please contact us at: 
                <a href={`mailto:${proposal.companyName ? `contact@${proposal.companyName.toLowerCase().replace(/\s+/g, '')}.com` : 'contact@proposalbuilder.com'}`} className="text-primary hover:underline ml-1">
                  {proposal.companyName ? `contact@${proposal.companyName.toLowerCase().replace(/\s+/g, '')}.com` : 'contact@proposalbuilder.com'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProposalPreview.displayName = 'ProposalPreview';

export default ProposalPreview;
