
import React from 'react';
import { Proposal } from '@/types/proposal';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ProposalPreviewProps {
  proposal: Partial<Proposal>;
}

const ProposalPreview = React.forwardRef<HTMLDivElement, ProposalPreviewProps>(
  ({ proposal }, ref) => {
    const formatCurrency = (amount: number) => {
      const currencySymbol = getCurrencySymbol(proposal.currency || 'USD');
      return `${currencySymbol}${amount.toFixed(2)}`;
    };

    const getCurrencySymbol = (currencyCode: string) => {
      switch (currencyCode) {
        case "USD": return "$";
        case "EUR": return "€";
        case "INR": return "₹";
        case "GBP": return "£";
        default: return "$";
      }
    };

    const totalAmount = proposal.services?.reduce(
      (sum, service) => sum + (service.unitPrice * service.quantity), 
      0
    ) || 0;

    return (
      <div ref={ref} className="p-8 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-900 shadow-md rounded-lg p-8 mb-8 print:shadow-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">Proposal</h1>
              {proposal.createdAt && (
                <p className="text-muted-foreground">
                  Date: {format(new Date(proposal.createdAt), 'PPP')}
                </p>
              )}
            </div>
            <div className="mt-4 sm:mt-0 px-4 py-2 bg-primary/10 text-primary rounded-md font-semibold">
              {proposal.tags && proposal.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {proposal.tags.map((tag) => (
                    <span key={tag} className="proposal-tag inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Client Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary/90">Client Information</h2>
            <div className="bg-muted/30 p-4 rounded-md">
              <p className="font-semibold">{proposal.clientName}</p>
              {proposal.clientEmail && (
                <p className="client-email mt-1">
                  <span className="text-muted-foreground">Email: </span>
                  {proposal.clientEmail}
                </p>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary/90">Services & Pricing</h2>
            {proposal.services && proposal.services.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left font-semibold">Service</th>
                      <th className="px-4 py-2 text-right font-semibold">Quantity</th>
                      <th className="px-4 py-2 text-right font-semibold">Price</th>
                      <th className="px-4 py-2 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposal.services.map((service) => (
                      <tr key={service.id} className="border-b border-muted">
                        <td className="px-4 py-3">{service.name || 'Unnamed Service'}</td>
                        <td className="px-4 py-3 text-right">{service.quantity}</td>
                        <td className="px-4 py-3 text-right">
                          {formatCurrency(service.unitPrice)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(service.unitPrice * service.quantity)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30">
                      <td colSpan={3} className="px-4 py-3 text-right font-semibold">
                        Total
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        {formatCurrency(totalAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground italic">No services added to this proposal.</p>
            )}
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary/90">Timeline</h2>
            <div className="bg-muted/30 p-4 rounded-md">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <p className="font-medium text-muted-foreground">Start Date</p>
                  <p className="font-semibold">
                    {proposal.startDate 
                      ? format(new Date(proposal.startDate), 'PPP') 
                      : 'Not specified'}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <p className="font-medium text-muted-foreground">End Date</p>
                  <p className="font-semibold">
                    {proposal.endDate 
                      ? format(new Date(proposal.endDate), 'PPP') 
                      : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {proposal.notes && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4 text-primary/90">Additional Notes</h2>
              <div className="bg-muted/30 p-4 rounded-md whitespace-pre-wrap">
                {proposal.notes}
              </div>
            </div>
          )}

          {/* Footer */}
          <Separator className="my-8" />
          <div className="text-center text-sm text-muted-foreground">
            <p>Thank you for considering our services!</p>
            <p className="mt-1">For any questions, please contact us.</p>
          </div>
        </div>
      </div>
    );
  }
);

ProposalPreview.displayName = 'ProposalPreview';

export default ProposalPreview;
