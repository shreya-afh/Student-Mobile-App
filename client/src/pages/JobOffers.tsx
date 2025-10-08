import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ChevronLeftIcon, UploadIcon, CalendarIcon, MapPinIcon, IndianRupeeIcon } from "lucide-react";

export default function JobOffers() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#faf9fb] flex flex-col">
      {/* Header */}
      <header className="bg-[linear-gradient(90deg,rgba(218,178,255,1)_0%,rgba(196,180,255,1)_100%)] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard")}
              className="h-8 w-9 p-0 hover:bg-transparent"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#6d10b0]" />
            </Button>
            <h1 className="font-['Inter',Helvetica] font-semibold text-[#6d10b0] text-lg">
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

      <div className="flex-1 p-4">
        {/* Upload Section */}
        <Card className="bg-[#eff1ff] border-[#6d10b0] mb-6">
          <CardContent className="p-4">
            <h2 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base mb-2">
              Got a Job Offer?
            </h2>
            <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-3">
              Upload your offer letter to confirm your placement and get recognition.
            </p>
            <Button className="w-full h-10 bg-[#6d10b0] hover:bg-[#5a0d94] text-white">
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
              <Button variant="link" className="p-0 h-auto text-[#6d10b0]">
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
                <Button variant="link" className="p-0 h-auto text-[#6d10b0]">
                  View Letter
                </Button>
                <Button className="h-8 px-4 bg-[#6d10b0] hover:bg-[#5a0d94] text-white text-sm">
                  Accept
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
