
import React from 'react';
import { Proposal } from '@/types/proposal';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Calendar, Tag, Info, Mail, Phone, Building } from 'lucide-react';

interface ProposalPreviewProps {
  proposal: Partial<Proposal>;
  template?: string;
}

const ProposalPreview = React.forwardRef<HTMLDivElement, ProposalPreviewProps>(
  ({ proposal, template = 'standard' }, ref) => {
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
    const proposalId = proposal.id ? proposal.id.substring(0, 8) : 'Draft';

    return (
      <div ref={ref} className="p-8 max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 print:shadow-none">
          {/* Cover Section / Header */}
          <div className={`${styles.headerBg} ${styles.headerText} p-8`}>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {proposal.tags?.includes('Web') 
                    ? 'Web Development Proposal'
                    : proposal.tags?.includes('Design')
                    ? 'Design Services Proposal'
                    : proposal.tags?.includes('Marketing')
                    ? 'Marketing Strategy Proposal'
                    : 'Business Proposal'}
                </h1>
                <p className="opacity-90">{proposal.companyName || 'Your Company Name'}</p>
                <p className="mt-1 text-sm opacity-80">Proposal #{proposalId}</p>
              </div>
              <div className="text-right">
                {proposal.createdAt && (
                  <div className="mb-2 flex items-center justify-end gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(proposal.createdAt), 'PPP')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Client Information */}
            <div className="mb-8">
              <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${styles.accentColor}`}>
                <FileText className="h-5 w-5" />
                Client Information
              </h2>
              <div className={`${styles.accentBg} p-4 rounded-md border ${styles.borderColor}`}>
                <p className="font-semibold text-lg">{proposal.clientName}</p>
                <div className="mt-2 flex flex-col gap-2">
                  {proposal.clientEmail && (
                    <p className="client-email flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${proposal.clientEmail}`} className="text-primary hover:underline">
                        {proposal.clientEmail}
                      </a>
                    </p>
                  )}
                  {proposal.clientPhone ? (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{proposal.clientPhone}</span>
                    </p>
                  ) : (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Not provided</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Introduction / Summary */}
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

            {/* Services */}
            <div className="mb-8">
              <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${styles.accentColor}`}>
                <FileText className="h-5 w-5" />
                Services & Pricing
              </h2>
              {proposal.services && proposal.services.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className={styles.accentBg}>
                      <TableRow>
                        <TableHead className="font-semibold">Service</TableHead>
                        <TableHead className="text-right font-semibold">Quantity</TableHead>
                        <TableHead className="text-right font-semibold">Unit Price</TableHead>
                        <TableHead className="text-right font-semibold">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proposal.services.map((service) => (
                        <TableRow key={service.id} className={`border-b ${styles.borderColor}`}>
                          <TableCell className="font-medium">
                            <div>
                              <p>{service.name || 'Unnamed Service'}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {service.name?.includes('Development') 
                                  ? 'Includes planning, implementation, and testing'
                                  : service.name?.includes('Design')
                                  ? 'Includes research, mockups, and revisions'
                                  : 'Standard service package'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{service.quantity}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(service.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(service.unitPrice * service.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className={`${styles.accentBg} font-bold`}>
                        <TableCell colSpan={3} className="text-right">
                          Total
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(totalAmount)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No services added to this proposal.</p>
              )}
            </div>

            {/* Timeline */}
            <div className="mb-8">
              <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${styles.accentColor}`}>
                <Calendar className="h-5 w-5" />
                Project Timeline
              </h2>
              <div className={`${styles.accentBg} p-4 rounded-md border ${styles.borderColor}`}>
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="mb-4 sm:mb-0">
                    <p className="font-medium text-muted-foreground">Start Date</p>
                    <p className="font-semibold text-lg">
                      {proposal.startDate 
                        ? format(new Date(proposal.startDate), 'PPP') 
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">End Date</p>
                    <p className="font-semibold text-lg">
                      {proposal.endDate 
                        ? format(new Date(proposal.endDate), 'PPP') 
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-dashed border-muted">
                  <p className="text-sm text-muted-foreground">
                    This timeline assumes prompt feedback and approvals. Any delays may impact the final delivery date.
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {proposal.notes && (
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
            )}

            {/* Tags */}
            {proposal.tags && proposal.tags.length > 0 && (
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
            )}

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
