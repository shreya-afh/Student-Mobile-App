import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ChevronLeftIcon, UploadIcon, CalendarIcon, MapPinIcon, IndianRupeeIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";

export default function JobOffers() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [acceptedOffers, setAcceptedOffers] = useState<string[]>([]);
  useAndroidBackButton("/dashboard");

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "Offer Letter Uploaded",
          description: `${file.name} has been uploaded successfully!`,
        });
      }
    };
    input.click();
  };

  const handleViewLetter = (company: string) => {
    toast({
      title: "Opening Offer Letter",
      description: `Viewing offer letter from ${company}...`,
    });
  };

  const handleAccept = (company: string) => {
    setAcceptedOffers([...acceptedOffers, company]);
    toast({
      title: "Offer Accepted",
      description: `Congratulations! You have accepted the offer from ${company}.`,
    });
  };

  return (
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[#B4A5D5] pt-safe pb-4 px-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard")}
              className="h-10 w-10 p-0 hover:bg-transparent relative z-10 -ml-2"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#1d2838]" />
            </Button>
            <h1 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-lg">
              Job Offers
            </h1>
          </div>
          <div className="bg-[#ffffffe6] rounded-[10px] px-3 py-1.5">
            <span className="font-['Inter',Helvetica] font-normal text-[#1d2838] text-xs">
              Infosys X AspireForHer
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Upload Section */}
        <Card className="bg-[#eff1ff] border-[#B4A5D5] mb-6">
          <CardContent className="p-4">
            <h2 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base mb-2">
              Got a Job Offer?
            </h2>
            <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-3">
              Upload your offer letter to confirm your placement and get recognition.
            </p>
            <Button 
              onClick={handleUpload}
              className="w-full h-10 bg-[#B4A5D5] hover:bg-[#9B8BC4] text-[#1d2838]"
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload Offer Letter
            </Button>
          </CardContent>
        </Card>

        {/* Offer Letters Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-lg">
            Offer Letters
          </h2>
          <span className="font-['Inter',Helvetica] font-medium text-[#697282] text-sm">
            2 offers
          </span>
        </div>

        {/* Accepted Offer */}
        <Card className="border-[#00a63e] mb-4">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base">
                  Software Engineer Trainee
                </h3>
                <p className="font-['Inter',Helvetica] font-semibold text-[#495565] text-sm">
                  Infosys
                </p>
              </div>
              <Badge className="bg-[#00a63e] text-white border-transparent hover:bg-[#00a63e]">
                accepted
              </Badge>
            </div>

            <div className="flex flex-wrap gap-3 mb-3">
              <div className="flex items-center gap-1 text-[#495565]">
                <MapPinIcon className="w-4 h-4" />
                <span className="font-['Inter',Helvetica] font-normal text-sm">
                  Pune, Maharashtra
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#495565]">
                <IndianRupeeIcon className="w-4 h-4" />
                <span className="font-['Inter',Helvetica] font-normal text-sm">
                  4.5 LPA
                </span>
              </div>
            </div>

            <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-3">
              Welcome to Infosys! Your offer has been accepted and joining details will follow.
            </p>

            <div className="bg-[#f0fdf4] border border-[#00a63e] rounded-lg p-3 mb-3">
              <p className="font-['Inter',Helvetica] font-semibold text-[#00a63e] text-sm mb-1">
                Offer Accepted
              </p>
              <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                Joining on 15/04/2024
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">
                Received: 12/03/2024
              </span>
              <Button 
                onClick={() => handleViewLetter("Infosys")}
                variant="link" 
                className="p-0 h-auto text-[#B4A5D5]"
              >
                View Letter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Offer */}
        <Card className="border-[#f59e0b] mb-4">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base">
                  Data Analyst
                </h3>
                <p className="font-['Inter',Helvetica] font-semibold text-[#495565] text-sm">
                  Wipro
                </p>
              </div>
              <Badge className="bg-[#fef3c7] text-[#92400e] border-transparent hover:bg-[#fef3c7]">
                pending-decision
              </Badge>
            </div>

            <div className="flex flex-wrap gap-3 mb-3">
              <div className="flex items-center gap-1 text-[#495565]">
                <MapPinIcon className="w-4 h-4" />
                <span className="font-['Inter',Helvetica] font-normal text-sm">
                  Hyderabad, Telangana
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#495565]">
                <IndianRupeeIcon className="w-4 h-4" />
                <span className="font-['Inter',Helvetica] font-normal text-sm">
                  3.8 LPA
                </span>
              </div>
            </div>

            <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-3">
              You have received an offer! Please review and respond by the deadline.
            </p>

            <div className="bg-[#fffbeb] border border-[#f59e0b] rounded-lg p-3 mb-3">
              <p className="font-['Inter',Helvetica] font-semibold text-[#f59e0b] text-sm mb-1">
                Awaiting Your Decision
              </p>
              <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                Respond by 18/03/2024
              </p>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">
                Received: 10/03/2024
              </span>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleViewLetter("Wipro")}
                  variant="link" 
                  className="p-0 h-auto text-[#B4A5D5]"
                >
                  View Letter
                </Button>
                <Button 
                  onClick={() => handleAccept("Wipro")}
                  disabled={acceptedOffers.includes("Wipro")}
                  className="h-8 px-4 bg-[#B4A5D5] hover:bg-[#9B8BC4] text-[#1d2838] text-sm disabled:opacity-50"
                >
                  {acceptedOffers.includes("Wipro") ? "Accepted" : "Accept"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
