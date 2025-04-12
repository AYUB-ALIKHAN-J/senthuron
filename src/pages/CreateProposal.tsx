
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { ProposalFormData, ServiceItem } from "@/types/proposal";
import { createProposal, fetchProposalById, updateProposal } from "@/services/proposalService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Download, Save, Plus, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import ProposalServiceRow from "@/components/ProposalServiceRow";
import ProposalPreview from "@/components/ProposalPreview";

// Predefined service options
const serviceOptions = [
  "Web Development",
  "UI/UX Design",
  "Content Writing",
  "SEO Services",
  "Mobile App Development",
  "Marketing Strategy",
  "Branding Package",
  "Maintenance Services",
];

// Predefined tag options
const tagOptions = [
  "Web",
  "Design",
  "Marketing",
  "Branding",
  "E-commerce",
  "Development",
  "Consulting",
  "Maintenance",
];

const CreateProposal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Initialize form data
  const [formData, setFormData] = useState<ProposalFormData>({
    clientName: "",
    services: [],
    startDate: null,
    endDate: null,
    notes: "",
    tags: [],
  });

  // Load existing proposal if in edit mode
  useEffect(() => {
    const loadProposal = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const proposal = await fetchProposalById(id);
        
        if (proposal) {
          setFormData({
            clientName: proposal.clientName,
            services: proposal.services,
            startDate: proposal.startDate ? new Date(proposal.startDate) : null,
            endDate: proposal.endDate ? new Date(proposal.endDate) : null,
            notes: proposal.notes,
            tags: proposal.tags,
          });
          setIsEdit(true);
        } else {
          // If proposal not found, redirect to create new
          navigate("/create", { replace: true });
        }
      } catch (error) {
        console.error("Failed to load proposal:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProposal();
  }, [id, navigate]);

  // Handle form field changes
  const handleInputChange = (field: keyof ProposalFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle adding a new service row
  const handleAddService = (optionName?: string) => {
    const newService: ServiceItem = {
      id: uuidv4(),
      name: optionName || "",
      unitPrice: 0,
      quantity: 1,
    };

    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
  };

  // Handle updating a service
  const handleServiceChange = (updatedService: ServiceItem) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      ),
    }));
  };

  // Handle removing a service
  const handleServiceDelete = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service.id !== serviceId),
    }));
  };

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    if (formData.tags.includes(tag)) {
      // Remove tag if already selected
      handleInputChange(
        "tags",
        formData.tags.filter((t) => t !== tag)
      );
    } else {
      // Add tag if not selected
      handleInputChange("tags", [...formData.tags, tag]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName.trim()) {
      // Show validation error
      alert("Client name is required");
      return;
    }

    try {
      setSaving(true);
      
      if (isEdit && id) {
        await updateProposal(id, formData);
      } else {
        await createProposal(formData);
      }
      
      // Navigate back to dashboard after successful save
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save proposal:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-muted/30 py-4 px-4 border-b">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold">
                {isEdit ? "Edit Proposal" : "Create New Proposal"}
              </h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled={saving}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button type="submit" form="proposal-form" disabled={saving} className="ml-2">
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : isEdit ? "Update Proposal" : "Save Proposal"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-pulse">Loading proposal data...</div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-[calc(100vh-73px)]">
          {/* Form Panel */}
          <div className="flex-1 overflow-auto border-r">
            <div className="container max-w-2xl mx-auto py-6 px-4">
              <form id="proposal-form" onSubmit={handleSubmit} className="space-y-8">
                {/* Client Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Client Information</h2>
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      placeholder="Enter client name"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange("clientName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Separator />

                {/* Services Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Services & Pricing</h2>
                    <div className="flex space-x-2">
                      <Select onValueChange={handleAddService}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Add Service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceOptions.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddService()}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Custom
                      </Button>
                    </div>
                  </div>

                  {formData.services.length === 0 ? (
                    <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
                      <p className="text-muted-foreground">
                        No services added. Use the buttons above to add services.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="grid grid-cols-12 gap-2 text-sm text-muted-foreground mb-2">
                        <div className="col-span-5">Service</div>
                        <div className="col-span-2">Unit Price</div>
                        <div className="col-span-2">Quantity</div>
                        <div className="col-span-2 text-right">Total</div>
                        <div className="col-span-1"></div>
                      </div>
                      {formData.services.map((service) => (
                        <ProposalServiceRow
                          key={service.id}
                          service={service}
                          onChange={handleServiceChange}
                          onDelete={() => handleServiceDelete(service.id)}
                        />
                      ))}
                      <div className="text-right pt-2 font-semibold">
                        Total: $
                        {formData.services
                          .reduce(
                            (sum, service) => sum + service.unitPrice * service.quantity,
                            0
                          )
                          .toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Dates Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Timeline</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.startDate ? (
                              format(formData.startDate, "PPP")
                            ) : (
                              <span>Select start date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.startDate || undefined}
                            onSelect={(date) => handleInputChange("startDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.endDate ? (
                              format(formData.endDate, "PPP")
                            ) : (
                              <span>Select end date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.endDate || undefined}
                            onSelect={(date) => handleInputChange("endDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Tags Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant={formData.tags.includes(tag) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTagSelect(tag)}
                        className={
                          formData.tags.includes(tag)
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Notes Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Notes</h2>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter any additional notes or terms for this proposal"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows={5}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 overflow-auto bg-muted/20">
            <ProposalPreview proposal={formData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProposal;
