
import React from 'react';
import { Proposal } from '@/types/proposal';
import { FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProposalServicesProps {
  proposal: Partial<Proposal>;
  styles: {
    accentColor: string;
    accentBg: string;
    borderColor: string;
  };
}

const ProposalServices: React.FC<ProposalServicesProps> = ({ proposal, styles }) => {
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
  );
};

export default ProposalServices;
