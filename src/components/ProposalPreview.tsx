
import React, { forwardRef } from "react";
import { Proposal, ServiceItem } from "@/types/proposal";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProposalPreviewProps {
  proposal: Partial<Proposal>;
}

const ProposalPreview = forwardRef<HTMLDivElement, ProposalPreviewProps>(({ proposal }, ref) => {
  // Get currency symbol based on currency code
  const getCurrencySymbol = (currencyCode?: string) => {
    switch (currencyCode) {
      case "USD": return "$";
      case "EUR": return "€";
      case "INR": return "₹";
      case "GBP": return "£";
      default: return "$";
    }
  };
  
  // Calculate the total for all services
  const calculateTotal = (services: ServiceItem[]) => {
    return services.reduce((total, service) => {
      return total + (service.unitPrice * service.quantity);
    }, 0);
  };
  
  const totalAmount = proposal.services?.length ? calculateTotal(proposal.services) : 0;
  const currencySymbol = getCurrencySymbol(proposal.currency);
  
  // Format date to display or show placeholder
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Not specified';
    return format(new Date(date), 'MMMM dd, yyyy');
  };
  
  return (
    <div ref={ref} className="h-full overflow-auto p-4 bg-muted/30">
      <Card className="shadow-md max-w-3xl mx-auto">
        <CardHeader className="pb-4 space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-muted-foreground">PROPOSAL FOR</div>
              <CardTitle className="text-2xl font-bold text-primary">
                {proposal.clientName || 'Client Name'}
              </CardTitle>
              {proposal.clientEmail && (
                <div className="text-sm mt-1">
                  <span className="text-muted-foreground">Email: </span>
                  {proposal.clientEmail}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">DATE</div>
              <div className="font-medium">
                {proposal.createdAt ? format(new Date(proposal.createdAt), 'MMMM dd, yyyy') : format(new Date(), 'MMMM dd, yyyy')}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-6 space-y-6">
          {/* Time Period */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">START DATE</h3>
              <p className="font-medium">{formatDate(proposal.startDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">END DATE</h3>
              <p className="font-medium">{formatDate(proposal.endDate)}</p>
            </div>
          </div>
          
          {/* Services Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services & Pricing</h3>
            
            {proposal.services?.length ? (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted text-muted-foreground text-sm">
                    <tr>
                      <th className="text-left p-3">Service</th>
                      <th className="text-right p-3">Price</th>
                      <th className="text-right p-3">Quantity</th>
                      <th className="text-right p-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposal.services.map((service, index) => (
                      <tr key={service.id} className={index % 2 === 0 ? 'bg-card' : 'bg-muted/50'}>
                        <td className="p-3 text-left">{service.name || 'Unnamed Service'}</td>
                        <td className="p-3 text-right">{currencySymbol}{service.unitPrice.toFixed(2)}</td>
                        <td className="p-3 text-right">{service.quantity}</td>
                        <td className="p-3 text-right font-medium">
                          {currencySymbol}{(service.unitPrice * service.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-primary/5 font-medium">
                    <tr>
                      <td colSpan={3} className="p-3 text-right">Total:</td>
                      <td className="p-3 text-right font-bold">{currencySymbol}{totalAmount.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4 border rounded-md">
                No services added yet
              </p>
            )}
          </div>
          
          {/* Tags */}
          {proposal.tags?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {proposal.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Notes */}
          {proposal.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">NOTES</h3>
              <div className="border rounded-md p-3 bg-muted/30 whitespace-pre-line">
                {proposal.notes}
              </div>
            </div>
          )}
          
          {/* Contact Footer */}
          <div className="mt-6 pt-4 border-t text-sm text-muted-foreground text-center">
            <p>For inquiries, contact us at: <span className="text-primary">contact@proposalbuilder.com</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ProposalPreview.displayName = "ProposalPreview";

export default ProposalPreview;
