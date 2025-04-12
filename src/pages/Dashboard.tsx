
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Proposal } from "@/types/proposal";
import { fetchProposals, deleteProposal } from "@/services/proposalService";
import { Button } from "@/components/ui/button";
import ProposalTable from "@/components/ProposalTable";
import { PlusCircle, FileText } from "lucide-react";

const Dashboard = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="container py-8 max-w-6xl">
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
            <ProposalTable proposals={proposals} onDelete={handleDelete} />
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
