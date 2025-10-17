import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ChevronLeftIcon, UploadIcon, CalendarIcon, MapPinIcon, IndianRupeeIcon, ExternalLinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, getApiBaseUrl } from "@/lib/queryClient";
import type { OfferLetter } from "@shared/schema";
import { indianStates, getDistrictsForState, getCitiesForDistrict } from "@shared/locationData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function JobOffers() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Form fields
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [jobType, setJobType] = useState("");
  const [placementLocationType, setPlacementLocationType] = useState("");
  const [placementState, setPlacementState] = useState("");
  const [placementDistrict, setPlacementDistrict] = useState("");
  const [placementCity, setPlacementCity] = useState("");
  const [joiningDay, setJoiningDay] = useState("");
  const [joiningMonth, setJoiningMonth] = useState("");
  const [joiningYear, setJoiningYear] = useState("");
  const [salary, setSalary] = useState("");
  const [joiningStatus, setJoiningStatus] = useState("");
  
  // Calculate days in selected month for joining date
  const daysInJoiningMonth = useMemo(() => {
    if (!joiningMonth || !joiningYear) return 31;
    const year = parseInt(joiningYear);
    const month = parseInt(joiningMonth);
    return new Date(year, month, 0).getDate();
  }, [joiningMonth, joiningYear]);
  
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [offerToReject, setOfferToReject] = useState<string | null>(null);
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
    mutationFn: async (data: { 
      file: File; 
      company: string; 
      position: string;
      jobType: string;
      placementLocationType: string;
      placementState: string;
      placementDistrict: string;
      placementCity: string;
      joiningDate: string;
      salary: string;
      joiningStatus: string;
    }) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("data", JSON.stringify({
        userId: user?.id,
        company: data.company,
        position: data.position,
        jobType: data.jobType,
        placementLocationType: data.placementLocationType,
        placementState: data.placementState,
        placementDistrict: data.placementDistrict,
        placementCity: data.placementCity,
        joiningDate: data.joiningDate,
        salary: data.salary,
        joiningStatus: data.joiningStatus,
      }));
      
      const baseUrl = await getApiBaseUrl();
      const response = await fetch(baseUrl + "/api/offer-letters/upload", {
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
      setJobType("");
      setPlacementLocationType("");
      setPlacementState("");
      setPlacementDistrict("");
      setPlacementCity("");
      setJoiningDay("");
      setJoiningMonth("");
      setJoiningYear("");
      setSalary("");
      setJoiningStatus("");
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

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async (offerId: string) => {
      await apiRequest("POST", `/api/offer-letters/${offerId}/reject`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offer-letters", user?.id] });
      toast({
        title: "Offer Rejected",
        description: "You have rejected the offer.",
      });
      setRejectDialogOpen(false);
      setOfferToReject(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject offer",
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

  const handleStateChange = (value: string) => {
    setPlacementState(value);
    setPlacementDistrict("");
    setPlacementCity("");
  };

  const handleDistrictChange = (value: string) => {
    setPlacementDistrict(value);
    setPlacementCity("");
  };

  const handleSubmitUpload = () => {
    if (!uploadFile || !company || !position || !jobType || !placementLocationType || 
        !placementState || !placementDistrict || !placementCity || !joiningDay || !joiningMonth || !joiningYear || 
        !salary || !joiningStatus) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file",
        variant: "destructive",
      });
      return;
    }
    
    // Format joining date as DD-MM-YYYY
    const formattedJoiningDate = `${joiningDay}-${joiningMonth}-${joiningYear}`;
    
    uploadMutation.mutate({ 
      file: uploadFile, 
      company, 
      position,
      jobType,
      placementLocationType,
      placementState,
      placementDistrict,
      placementCity,
      joiningDate: formattedJoiningDate,
      salary,
      joiningStatus
    });
  };

  const handleViewLetter = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const handleAccept = (offerId: string) => {
    acceptMutation.mutate(offerId);
  };

  const handleRejectClick = (offerId: string) => {
    setOfferToReject(offerId);
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = () => {
    if (offerToReject) {
      rejectMutation.mutate(offerToReject);
    }
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

      <div className="flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}>
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
                      offer.status === 'accepted' 
                        ? 'border-[#00a63e]' 
                        : offer.status === 'rejected' 
                        ? 'border-red-500' 
                        : 'border-[#f59e0b]'
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
                              : offer.status === 'rejected'
                              ? 'bg-red-500 text-white border-transparent hover:bg-red-500'
                              : 'bg-[#fef3c7] text-[#92400e] border-transparent hover:bg-[#fef3c7]'
                          }
                        >
                          {offer.status === 'accepted' ? 'accepted' : offer.status === 'rejected' ? 'rejected' : 'pending'}
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
                        <div className="flex gap-2 items-center">
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
                            <>
                              <Button
                                onClick={() => handleRejectClick(offer.id)}
                                disabled={rejectMutation.isPending}
                                variant="outline"
                                className="h-7 px-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 text-xs disabled:opacity-50"
                                data-testid={`button-reject-${offer.id}`}
                              >
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleAccept(offer.id)}
                                disabled={acceptMutation.isPending}
                                className="h-7 px-2 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white text-xs disabled:opacity-50"
                                data-testid={`button-accept-${offer.id}`}
                              >
                                Accept
                              </Button>
                            </>
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Offer Letter</DialogTitle>
            <DialogDescription>
              Fill in all the details about your job offer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Employer Name */}
            <div className="grid gap-2">
              <Label htmlFor="company">Employer Name *</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Infosys"
              />
            </div>
            
            {/* Job Title */}
            <div className="grid gap-2">
              <Label htmlFor="position">Job Title *</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g., Software Engineer"
              />
            </div>

            {/* Job Type */}
            <div className="grid gap-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Full-time</SelectItem>
                  <SelectItem value="2">Part-time</SelectItem>
                  <SelectItem value="3">Contract</SelectItem>
                  <SelectItem value="4">Internship</SelectItem>
                  <SelectItem value="5">Apprenticeship</SelectItem>
                  <SelectItem value="6">Self-employed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Placement Location Type */}
            <div className="grid gap-2">
              <Label htmlFor="placementLocationType">Placement Location Type *</Label>
              <Select value={placementLocationType} onValueChange={setPlacementLocationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Rural</SelectItem>
                  <SelectItem value="2">Urban</SelectItem>
                  <SelectItem value="3">Semi-Urban</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Placement State */}
            <div className="grid gap-2">
              <Label htmlFor="placementState">Placement State *</Label>
              <Select value={placementState} onValueChange={handleStateChange}>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((state) => (
                    <SelectItem key={typeof state === 'string' ? state : state.value} value={typeof state === 'string' ? state : state.value}>
                      {typeof state === 'string' ? state : state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Placement District */}
            <div className="grid gap-2">
              <Label htmlFor="placementDistrict">Placement District *</Label>
              <Select value={placementDistrict} onValueChange={handleDistrictChange} disabled={!placementState}>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder={!placementState ? "Select state first" : "Select district"} />
                </SelectTrigger>
                <SelectContent>
                  {getDistrictsForState(placementState).map((district) => (
                    <SelectItem key={typeof district === 'string' ? district : district.value} value={typeof district === 'string' ? district : district.value}>
                      {typeof district === 'string' ? district : district.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Placement City */}
            <div className="grid gap-2">
              <Label htmlFor="placementCity">Placement City Location *</Label>
              <Select value={placementCity} onValueChange={setPlacementCity} disabled={!placementDistrict}>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder={!placementDistrict ? "Select district first" : "Select city"} />
                </SelectTrigger>
                <SelectContent>
                  {getCitiesForDistrict(placementState, placementDistrict).map((city) => (
                    <SelectItem key={typeof city === 'string' ? city : city.value} value={typeof city === 'string' ? city : city.value}>
                      {typeof city === 'string' ? city : city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Joining Date */}
            <div className="grid gap-2">
              <Label>Joining Date *</Label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Select value={joiningDay} onValueChange={setJoiningDay}>
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: daysInJoiningMonth }, (_, i) => String(i + 1).padStart(2, '0')).map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={joiningMonth} onValueChange={setJoiningMonth}>
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">Jan</SelectItem>
                      <SelectItem value="02">Feb</SelectItem>
                      <SelectItem value="03">Mar</SelectItem>
                      <SelectItem value="04">Apr</SelectItem>
                      <SelectItem value="05">May</SelectItem>
                      <SelectItem value="06">Jun</SelectItem>
                      <SelectItem value="07">Jul</SelectItem>
                      <SelectItem value="08">Aug</SelectItem>
                      <SelectItem value="09">Sep</SelectItem>
                      <SelectItem value="10">Oct</SelectItem>
                      <SelectItem value="11">Nov</SelectItem>
                      <SelectItem value="12">Dec</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={joiningYear} onValueChange={setJoiningYear}>
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i)).map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Annual Salary */}
            <div className="grid gap-2">
              <Label htmlFor="salary">Annual Salary Offered in INR (CTC) *</Label>
              <Input
                id="salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g., 500000"
                type="number"
              />
            </div>

            {/* Joining Status */}
            <div className="grid gap-2">
              <Label htmlFor="joiningStatus">Joining Status *</Label>
              <Select value={joiningStatus} onValueChange={setJoiningStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select joining status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Joined</SelectItem>
                  <SelectItem value="2">Will be joining</SelectItem>
                  <SelectItem value="3">Considering another offer</SelectItem>
                  <SelectItem value="4">Considering Higher Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Offer Letter File */}
            <div className="grid gap-2">
              <Label htmlFor="file">Offer Letter (PDF) *</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
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

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Offer?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this offer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReject}
              className="bg-red-500 hover:bg-red-600"
            >
              Reject Offer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
