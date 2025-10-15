import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ChevronLeftIcon, UploadIcon, CalendarIcon, MapPinIcon, IndianRupeeIcon, ExternalLinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { OfferLetter } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function JobOffers() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  useAndroidBackButton("/dashboard");

  // Fetch offer letters
  const { data: offersData, isLoading } = useQuery<{ success: boolean; offers: OfferLetter[] }>({
    queryKey: ["/api/offer-letters", user?.id],
    enabled: !!user?.id,
  });

  const offers = offersData?.offers || [];
  const receivedOffers = offers.filter(o => o.type === "received");
  const uploadedOffers = offers.filter(o => o.type === "uploaded");

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (data: { file: File; company: string; position: string }) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("data", JSON.stringify({
        userId: user?.id,
        company: data.company,
        position: data.position,
      }));
      
      const response = await fetch("/api/offer-letters/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offer-letters", user?.id] });
      toast({
        title: "Success",
        description: "Offer letter uploaded successfully!",
      });
      setUploadDialogOpen(false);
      setUploadFile(null);
      setCompany("");
      setPosition("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload offer letter",
        variant: "destructive",
      });
    },
  });

  // Accept mutation
  const acceptMutation = useMutation({
    mutationFn: async (offerId: string) => {
      await apiRequest("POST", `/api/offer-letters/${offerId}/accept`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offer-letters", user?.id] });
      toast({
        title: "Offer Accepted",
        description: "Congratulations! You have accepted the offer.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to accept offer",
        variant: "destructive",
      });
    },
  });

  const handleUpload = () => {
    setUploadDialogOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleSubmitUpload = () => {
    if (!uploadFile || !company || !position) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select a file",
        variant: "destructive",
      });
      return;
    }
    
    uploadMutation.mutate({ file: uploadFile, company, position });
  };

  const handleViewLetter = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const handleAccept = (offerId: string) => {
    acceptMutation.mutate(offerId);
  };

  return (
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-safe flex-shrink-0">
        {/* Logo Bar */}
        <div className="bg-[#f8f9fa] border-b border-gray-200 py-2 px-4">
          <div className="flex items-center justify-center gap-3">
            <img 
              src={infosysLogo} 
              alt="Infosys Foundation" 
              className="h-6 object-contain"
            />
            <span className="text-gray-400 text-sm">×</span>
            <img 
              src={aspireForHerLogo} 
              alt="AspireForHer" 
              className="h-8 object-contain"
            />
          </div>
        </div>
        <div className="pb-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/dashboard")}
                className="h-10 w-10 p-0 hover:bg-gray-100 relative z-10 -ml-2"
              >
                <ChevronLeftIcon className="w-6 h-6 text-[#495565]" />
              </Button>
              <h1 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-lg">
                Job Offers
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Upload Section */}
        <Card className="bg-[#eff1ff] border-gray-200 hover:shadow-md transition-all mb-6">
          <CardContent className="p-4">
            <h2 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base mb-2">
              Got a Job Offer?
            </h2>
            <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-3">
              Upload your offer letter to confirm your placement and get recognition.
            </p>
            <Button 
              onClick={handleUpload}
              className="w-full h-10 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white"
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload Offer Letter
            </Button>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm">
              Loading offer letters...
            </p>
          </div>
        ) : (
          <>
            {/* Received Offers */}
            {receivedOffers.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-lg">
                    Received Offers
                  </h2>
                  <span className="font-['Inter',Helvetica] font-medium text-[#697282] text-sm">
                    {receivedOffers.length} {receivedOffers.length === 1 ? 'offer' : 'offers'}
                  </span>
                </div>

                {receivedOffers.map((offer) => (
                  <Card
                    key={offer.id}
                    className={`hover:shadow-md transition-all mb-4 ${
                      offer.status === 'accepted' ? 'border-[#00a63e]' : 'border-[#f59e0b]'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base">
                            {offer.position}
                          </h3>
                          <p className="font-['Inter',Helvetica] font-semibold text-[#495565] text-sm">
                            {offer.company}
                          </p>
                        </div>
                        <Badge
                          className={
                            offer.status === 'accepted'
                              ? 'bg-[#00a63e] text-white border-transparent hover:bg-[#00a63e]'
                              : 'bg-[#fef3c7] text-[#92400e] border-transparent hover:bg-[#fef3c7]'
                          }
                        >
                          {offer.status === 'accepted' ? 'accepted' : 'pending'}
                        </Badge>
                      </div>

                      {(offer.location || offer.salary) && (
                        <div className="flex flex-wrap gap-3 mb-3">
                          {offer.location && (
                            <div className="flex items-center gap-1 text-[#495565]">
                              <MapPinIcon className="w-4 h-4" />
                              <span className="font-['Inter',Helvetica] font-normal text-sm">
                                {offer.location}
                              </span>
                            </div>
                          )}
                          {offer.salary && (
                            <div className="flex items-center gap-1 text-[#495565]">
                              <IndianRupeeIcon className="w-4 h-4" />
                              <span className="font-['Inter',Helvetica] font-normal text-sm">
                                {offer.salary}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {offer.description && (
                        <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-3">
                          {offer.description}
                        </p>
                      )}

                      {offer.status === 'accepted' && offer.joiningDate && (
                        <div className="bg-[#f0fdf4] border border-[#00a63e] rounded-lg p-3 mb-3">
                          <p className="font-['Inter',Helvetica] font-semibold text-[#00a63e] text-sm mb-1">
                            Offer Accepted
                          </p>
                          <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                            Joining on {offer.joiningDate}
                          </p>
                        </div>
                      )}

                      {offer.status === 'pending' && offer.deadlineDate && (
                        <div className="bg-[#fffbeb] border border-[#f59e0b] rounded-lg p-3 mb-3">
                          <p className="font-['Inter',Helvetica] font-semibold text-[#f59e0b] text-sm mb-1">
                            Awaiting Your Decision
                          </p>
                          <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                            Respond by {offer.deadlineDate}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <span className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">
                          {offer.receivedDate && `Received: ${offer.receivedDate}`}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleViewLetter(offer.fileUrl)}
                            variant="link"
                            className="p-0 h-auto text-[#5C4C7D] flex items-center gap-1"
                            data-testid={`button-view-letter-${offer.id}`}
                          >
                            <ExternalLinkIcon className="w-3 h-3" />
                            View Letter
                          </Button>
                          {offer.status === 'pending' && (
                            <Button
                              onClick={() => handleAccept(offer.id)}
                              disabled={acceptMutation.isPending}
                              className="h-8 px-4 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white text-sm disabled:opacity-50"
                              data-testid={`button-accept-${offer.id}`}
                            >
                              Accept
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {/* Uploaded Offers */}
            {uploadedOffers.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4 mt-6">
                  <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-lg">
                    Uploaded Offers
                  </h2>
                  <span className="font-['Inter',Helvetica] font-medium text-[#697282] text-sm">
                    {uploadedOffers.length} {uploadedOffers.length === 1 ? 'upload' : 'uploads'}
                  </span>
                </div>

                {uploadedOffers.map((offer) => (
                  <Card key={offer.id} className="border-gray-200 hover:shadow-md transition-all mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base">
                            {offer.position}
                          </h3>
                          <p className="font-['Inter',Helvetica] font-semibold text-[#495565] text-sm">
                            {offer.company}
                          </p>
                        </div>
                        <Badge className="bg-[#eff1ff] text-[#5C4C7D] border-transparent hover:bg-[#eff1ff]">
                          uploaded
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">
                          {offer.receivedDate && `Uploaded: ${offer.receivedDate}`}
                        </span>
                        <Button
                          onClick={() => handleViewLetter(offer.fileUrl)}
                          variant="link"
                          className="p-0 h-auto text-[#5C4C7D] flex items-center gap-1"
                          data-testid={`button-view-uploaded-${offer.id}`}
                        >
                          <ExternalLinkIcon className="w-3 h-3" />
                          View Letter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {offers.length === 0 && (
              <Card className="border-gray-200">
                <CardContent className="p-8 text-center">
                  <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm">
                    No offer letters yet. Upload your first offer letter above!
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Offer Letter</DialogTitle>
            <DialogDescription>
              Upload your job offer letter with company and position details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Infosys"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="file">Offer Letter (PDF, DOC, DOCX)</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
              />
              {uploadFile && (
                <p className="text-sm text-[#697282]">
                  Selected: {uploadFile.name}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitUpload}
              disabled={uploadMutation.isPending}
              className="bg-[#5C4C7D] hover:bg-[#4C3C6D]"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
