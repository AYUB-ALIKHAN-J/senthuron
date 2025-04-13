
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { ProposalFormData, ServiceItem } from "@/types/proposal";
import { createProposal, fetchProposalById, updateProposal } from "@/services/proposalService";
import { usePDF } from "react-to-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useResponsive } from "@/hooks/use-responsive";
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  CalendarIcon, 
  Download, 
  Save, 
  Plus, 
  ArrowLeft, 
  Mail, 
  Calendar as CalendarIcon2, 
  Tag, 
  X,
  Eye,
  Menu,
  Phone,
  Building,
  FileText,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import DraggableServiceList from "@/components/DraggableServiceList";
import ProposalServiceRow from "@/components/ProposalServiceRow";
import ProposalPreview from "@/components/ProposalPreview";
import ThemeToggle from "@/components/ThemeToggle";

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

const currencyOptions = [
  { value: "USD", label: "$ (USD)" },
  { value: "EUR", label: "€ (EUR)" },
  { value: "INR", label: "₹ (INR)" },
  { value: "GBP", label: "£ (GBP)" },
];

const emailTemplateOptions = [
  { value: "standard", label: "Standard Proposal" },
  { value: "detailed", label: "Detailed Breakdown" },
  { value: "summary", label: "Brief Summary" },
  { value: "formal", label: "Formal Business Proposal" },
];

const CreateProposal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  const [customTag, setCustomTag] = useState("");
  const [proposalDate, setProposalDate] = useState<Date | undefined>(new Date());
  const [showPreview, setShowPreview] = useState(!isMobile);
  const previewRef = useRef<HTMLDivElement>(null);

  const { toPDF, targetRef } = usePDF({
    filename: 'proposal.pdf',
    page: { 
      margin: 20,
      format: 'A4',
      orientation: 'portrait'
    }
  });

  const [formData, setFormData] = useState<ProposalFormData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    companyName: "",
    services: [],
    startDate: null,
    endDate: null,
    notes: "",
    executiveSummary: "",
    standardTerms: "50% deposit required to begin work\nRemaining balance due upon project completion\nTwo rounds of revisions included\nAdditional revisions billed at hourly rate",
    tags: [],
    currency: "USD",
    preferredTemplate: "standard"
  });

  useEffect(() => {
    const loadProposal = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const proposal = await fetchProposalById(id);
        
        if (proposal) {
          setFormData({
            clientName: proposal.clientName,
            clientEmail: proposal.clientEmail || "",
            clientPhone: proposal.clientPhone || "",
            companyName: proposal.companyName || "",
            services: proposal.services,
            startDate: proposal.startDate ? new Date(proposal.startDate) : null,
            endDate: proposal.endDate ? new Date(proposal.endDate) : null,
            notes: proposal.notes,
            executiveSummary: proposal.executiveSummary || "",
            standardTerms: proposal.standardTerms || "50% deposit required to begin work\nRemaining balance due upon project completion\nTwo rounds of revisions included\nAdditional revisions billed at hourly rate",
            tags: proposal.tags,
            currency: proposal.currency || "USD",
            preferredTemplate: proposal.preferredTemplate || "standard"
          });
          
          if (proposal.preferredTemplate) {
            setSelectedTemplate(proposal.preferredTemplate);
          }
          
          if (proposal.createdAt) {
            setProposalDate(new Date(proposal.createdAt));
          }
          
          setIsEdit(true);
        } else {
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

  const handleInputChange = (field: keyof ProposalFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const handleServiceChange = (updatedService: ServiceItem) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      ),
    }));
  };

  const handleServiceDelete = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service.id !== serviceId),
    }));
  };

  const handleServicesReorder = (reorderedServices: ServiceItem[]) => {
    setFormData((prev) => ({
      ...prev,
      services: reorderedServices,
    }));
  };

  const handleTagSelect = (tag: string) => {
    if (formData.tags.includes(tag)) {
      handleInputChange(
        "tags",
        formData.tags.filter((t) => t !== tag)
      );
    } else {
      handleInputChange("tags", [...formData.tags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      handleInputChange("tags", [...formData.tags, customTag.trim()]);
      setCustomTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleInputChange(
      "tags",
      formData.tags.filter((t) => t !== tag)
    );
  };

  const handleSendEmail = () => {
    if (!formData.clientEmail) {
      toast({
        title: "Email Required",
        description: "Please enter a client email address",
        variant: "destructive"
      });
      return;
    }
    
    handleInputChange("preferredTemplate", selectedTemplate);
    
    toast({
      title: "Email Sent",
      description: `Proposal sent to ${formData.clientEmail} using the ${selectedTemplate} template`,
      variant: "default"
    });
  };

  const handleExportPDF = () => {
    const tagsElements = document.querySelectorAll('.proposal-tag');
    tagsElements.forEach(tag => {
      (tag as HTMLElement).style.display = 'none';
    });
    
    const emailElements = document.querySelectorAll('.client-email');
    emailElements.forEach(email => {
      if (email instanceof HTMLElement) {
        const emailText = email.innerText;
        if (emailText && !emailText.startsWith('mailto:')) {
          email.innerHTML = `<a href="mailto:${emailText}">${emailText}</a>`;
        }
      }
    });
    
    toPDF();
    
    setTimeout(() => {
      tagsElements.forEach(tag => {
        (tag as HTMLElement).style.display = '';
      });
    }, 1000);
    
    toast({
      title: "PDF Generated",
      description: "Your proposal has been exported as a PDF document",
      variant: "default"
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName.trim()) {
      toast({
        title: "Missing Information",
        description: "Client name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.clientEmail.trim()) {
      toast({
        title: "Missing Information", 
        description: "Client email is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      
      const submissionData = {
        ...formData,
        createdAt: proposalDate,
        preferredTemplate: selectedTemplate
      };
      
      if (isEdit && id) {
        await updateProposal(id, submissionData);
        toast({
          title: "Success",
          description: "Proposal updated successfully"
        });
      } else {
        await createProposal(submissionData);
        toast({
          title: "Success",
          description: "New proposal created successfully"
        });
      }
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save proposal:", error);
      toast({
        title: "Error",
        description: "Failed to save proposal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
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

  const currencySymbol = getCurrencySymbol(formData.currency);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-muted/30 py-4 px-4 border-b sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
              <h1 className="text-xl font-semibold hidden sm:block">
                {isEdit ? "Edit Proposal" : "Create New Proposal"}
              </h1>
            </div>
            
            {isMobile && (
              <div className="flex items-center">
                <h1 className="text-lg font-semibold mr-2">
                  {isEdit ? "Edit Proposal" : "New Proposal"}
                </h1>
                <ThemeToggle />
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="ml-2">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="py-4 flex flex-col space-y-4">
                      <h3 className="text-lg font-medium">Actions</h3>
                      <Separator />
                      <div className="grid gap-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowPreview(true)}
                          className="justify-start"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        
                        <div className="space-y-2">
                          <Label>Email Template</Label>
                          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                            <SelectTrigger>
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
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleSendEmail}
                          disabled={!formData.clientEmail}
                          className="justify-start"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleExportPDF}
                          disabled={saving}
                          className="justify-start"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export PDF
                        </Button>
                        
                        <Button 
                          type="submit" 
                          form="proposal-form" 
                          disabled={saving}
                          className="justify-start"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          {saving ? "Saving..." : isEdit ? "Update Proposal" : "Save Proposal"}
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
            
            {!isMobile && (
              <div className="flex space-x-2 items-center">
                <ThemeToggle />
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="w-[180px]">
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
                  size="sm" 
                  onClick={handleSendEmail}
                  disabled={!formData.clientEmail}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportPDF}
                  disabled={saving}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button 
                  type="submit" 
                  form="proposal-form" 
                  disabled={saving} 
                  className="ml-2"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : isEdit ? "Update Proposal" : "Save Proposal"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-pulse">Loading proposal data...</div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row flex-1">
          <div className={`flex-1 overflow-auto border-r ${showPreview && isMobile ? 'hidden' : 'block'}`}>
            <div className="container max-w-2xl mx-auto py-6 px-4">
              <form id="proposal-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-lg font-semibold">Company & Client Information</h2>
                    <div className="space-y-2">
                      <Label htmlFor="proposalDate">Proposal Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !proposalDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon2 className="mr-2 h-4 w-4" />
                            {proposalDate ? (
                              format(proposalDate, "PPP")
                            ) : (
                              <span>Select proposal date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={proposalDate}
                            onSelect={(date) => setProposalDate(date || new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Your Company Name</Label>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="companyName"
                        placeholder="Enter your company name"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name</Label>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="clientName"
                          placeholder="Enter client name"
                          value={formData.clientName}
                          onChange={(e) => handleInputChange("clientName", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="clientEmail">Client Email</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="clientEmail"
                          type="email"
                          placeholder="Enter client email"
                          value={formData.clientEmail}
                          onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="clientPhone">Client Phone</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="clientPhone"
                          type="tel"
                          placeholder="Enter client phone"
                          value={formData.clientPhone}
                          onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Executive Summary</h2>
                  <div className="space-y-2">
                    <Label htmlFor="executiveSummary">Summary</Label>
                    <Textarea
                      id="executiveSummary"
                      placeholder="Thank you for considering our services. This proposal outlines our recommended approach for your project, including scope of work, pricing, and timeline."
                      value={formData.executiveSummary}
                      onChange={(e) => handleInputChange("executiveSummary", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-lg font-semibold">Services & Pricing</h2>
                    <div className="flex space-x-2 items-center">
                      <Select 
                        value={formData.currency}
                        onValueChange={(value) => handleInputChange("currency", value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyOptions.map(currency => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <div>
                      {isMobile ? (
                        <div className="space-y-1">
                          {formData.services.map((service) => (
                            <ProposalServiceRow
                              key={service.id}
                              service={service}
                              onChange={handleServiceChange}
                              onDelete={() => handleServiceDelete(service.id)}
                              currencySymbol={currencySymbol}
                            />
                          ))}
                        </div>
                      ) : (
                        <DraggableServiceList
                          services={formData.services}
                          onServiceChange={handleServiceChange}
                          onServiceDelete={handleServiceDelete}
                          onServicesReorder={handleServicesReorder}
                          currencySymbol={currencySymbol}
                        />
                      )}
                      <div className="text-right pt-2 font-semibold">
                        Total: {currencySymbol}
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

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Tags</h2>
                  <div className="mb-4">
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Add custom tag..."
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomTag();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddCustomTag}
                        disabled={!customTag.trim()}
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Add Tag
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.length > 0 && (
                      <div className="w-full mb-2 flex flex-wrap gap-2">
                        <div className="text-sm text-muted-foreground mr-2 pt-1">Selected:</div>
                        {formData.tags.map((tag) => (
                          <div 
                            key={tag} 
                            className="proposal-tag inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary"
                          >
                            {tag}
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 text-primary hover:bg-primary/20"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-sm text-muted-foreground mr-2 pt-1">Suggested:</div>
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

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Notes & Terms</h2>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter any additional notes for this proposal"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="standardTerms">Standard Terms</Label>
                    <Textarea
                      id="standardTerms"
                      placeholder="Enter standard terms and conditions"
                      value={formData.standardTerms}
                      onChange={(e) => handleInputChange("standardTerms", e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Standard terms will appear at the bottom of your proposal unless they are already included in your notes.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {isMobile ? (
            <div className={`flex-1 ${!showPreview ? 'hidden' : 'block'}`}>
              <div className="sticky top-0 z-10 bg-background p-2 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Proposal Preview</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowPreview(false)}
                >
                  Edit
                </Button>
              </div>
              <div ref={targetRef}>
                <ProposalPreview 
                  proposal={{
                    ...formData,
                    createdAt: proposalDate
                  }} 
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto bg-muted/20" ref={targetRef}>
              <ProposalPreview
                ref={previewRef}
                proposal={{
                  ...formData,
                  createdAt: proposalDate
                }}
              />
            </div>
          )}
        </div>
      )}

      <footer className="bg-muted/30 py-4 px-4 border-t mt-auto">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>For inquiries, contact us at: <a href="mailto:contact@proposalbuilder.com" className="text-primary hover:underline">contact@proposalbuilder.com</a></p>
        </div>
      </footer>
    </div>
  );
};

export default CreateProposal;
