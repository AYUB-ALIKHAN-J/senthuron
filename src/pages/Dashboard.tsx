
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Proposal } from "@/types/proposal";
import { fetchProposals, deleteProposal } from "@/services/proposalService";
import { Button } from "@/components/ui/button";
import ProposalTable from "@/components/ProposalTable";
import { PlusCircle, FileText, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Email template options
const emailTemplateOptions = [
  { value: "standard", label: "Standard Proposal" },
  { value: "detailed", label: "Detailed Breakdown" },
  { value: "summary", label: "Brief Summary" },
  { value: "formal", label: "Formal Business Proposal" },
];

const Dashboard = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProposals = async () => {
      try {
        setLoading(true);
        const data = await fetchProposals();
        setProposals(data);
      } catch (error) {
        console.error("Failed to load proposals:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProposal(id);
      // Update the list after deletion
      const updatedProposals = await fetchProposals();
      setProposals(updatedProposals);
    } catch (error) {
      console.error("Failed to delete proposal:", error);
    }
  };

  const handleProposalSelect = (id: string) => {
    setSelectedProposal(id === selectedProposal ? null : id);
  };

  const handleSendEmail = () => {
    if (!selectedProposal) {
      toast("Please select a proposal to send");
      return;
    }

    const proposal = proposals.find(p => p.id === selectedProposal);
    if (!proposal) {
      toast.error("Proposal not found");
      return;
    }

    if (!proposal.clientEmail) {
      toast.error("No email address found for this client");
      return;
    }

    // Simulate sending email
    toast.success(`Email sent to ${proposal.clientEmail} using ${selectedTemplate} template`);
    // In a real app, you would call an API to send the email
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container py-8 max-w-6xl flex-grow">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Proposal Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your client proposals
            </p>
          </div>
          <Button size="lg" onClick={() => navigate("/create")}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Proposal
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse">Loading proposals...</div>
          </div>
        ) : (
          <>
            {proposals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-muted/30 rounded-lg border border-dashed">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No proposals yet</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  You haven't created any proposals yet. Start by creating your first proposal
                  for a client.
                </p>
                <Button asChild>
                  <Link to="/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Proposal
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-end space-x-4 mb-4">
                  <Select 
                    value={selectedTemplate} 
                    onValueChange={setSelectedTemplate}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Email Template" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplateOptions.map(template => (
                        <SelectItem key={template.value} value={template.value}>
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={handleSendEmail}
                    disabled={!selectedProposal}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                </div>
                <ProposalTable 
                  proposals={proposals} 
                  onDelete={handleDelete} 
                  onSelect={handleProposalSelect}
                  selectedProposalId={selectedProposal}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Contact Footer */}
      <footer className="bg-muted/30 py-4 px-4 border-t mt-auto">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>For inquiries, contact us at: <a href="mailto:contact@proposalbuilder.com" className="text-primary hover:underline">contact@proposalbuilder.com</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
