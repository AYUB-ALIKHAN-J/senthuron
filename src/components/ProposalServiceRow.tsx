
import { ServiceItem } from "@/types/proposal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ProposalServiceRowProps {
  service: ServiceItem;
  onChange: (service: ServiceItem) => void;
  onDelete: () => void;
  currencySymbol?: string;
}

const ProposalServiceRow = ({ service, onChange, onDelete, currencySymbol = "$" }: ProposalServiceRowProps) => {
  const handleChange = (field: keyof ServiceItem, value: string | number) => {
    onChange({
      ...service,
      [field]: value
    });
  };
  
  // Calculate the total for this row
  const total = service.unitPrice * service.quantity;
  
  return (
    <div className="grid grid-cols-12 gap-2 items-center mb-2">
      <div className="col-span-5">
        <Input 
          value={service.name} 
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Service name"
        />
      </div>
      <div className="col-span-2">
        <Input 
          type="number"
          value={service.unitPrice === 0 ? '' : service.unitPrice} 
          onChange={(e) => handleChange('unitPrice', parseFloat(e.target.value) || 0)}
          placeholder="Price"
          min={0}
          step="0.01"
        />
      </div>
      <div className="col-span-2">
        <Input 
          type="number"
          value={service.quantity === 0 ? '' : service.quantity} 
          onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
          placeholder="Qty"
          min={0}
        />
      </div>
      <div className="col-span-2 text-right font-medium">
        {currencySymbol}{total.toFixed(2)}
      </div>
      <div className="col-span-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDelete}
          className="h-8 w-8 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProposalServiceRow;
