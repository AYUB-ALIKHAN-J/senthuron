
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Proposal } from "@/types/proposal";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Eye, Mail } from "lucide-react";

interface ProposalTableProps {
  proposals: Proposal[];
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void;
  selectedProposalId?: string | null;
}

const ProposalTable = ({ proposals, onDelete, onSelect, selectedProposalId }: ProposalTableProps) => {
  // Filter out deleted proposals for display
  const visibleProposals = proposals.filter(p => p.status !== 'deleted');
  
  if (visibleProposals.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">No proposals found. Create your first proposal!</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {onSelect && <TableHead className="w-[50px]"></TableHead>}
            <TableHead>Client Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Services</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleProposals.map((proposal) => (
            <TableRow 
              key={proposal.id} 
              className={selectedProposalId === proposal.id ? "bg-muted" : ""}
              onClick={() => onSelect && onSelect(proposal.id)}
            >
              {onSelect && (
                <TableCell>
                  <div className="flex items-center justify-center">
                    <div 
                      className={`w-4 h-4 rounded-full ${
                        selectedProposalId === proposal.id 
                          ? "bg-primary" 
                          : "border border-muted-foreground"
                      }`}
                    />
                  </div>
                </TableCell>
              )}
              <TableCell className="font-medium">{proposal.clientName}</TableCell>
              <TableCell>{proposal.clientEmail || "—"}</TableCell>
              <TableCell>{format(new Date(proposal.createdAt), 'MMM dd, yyyy')}</TableCell>
              <TableCell>
                <StatusBadge status={proposal.status} />
              </TableCell>
              <TableCell>{proposal.services.length} services</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/create/${proposal.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will delete the proposal for {proposal.clientName}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(proposal.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProposalTable;
