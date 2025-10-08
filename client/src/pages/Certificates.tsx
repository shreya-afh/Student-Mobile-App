import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ChevronLeftIcon, DownloadIcon, Share2Icon } from "lucide-react";

export default function Certificates() {
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
              My Certificates
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
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="border-[#0000001a]">
            <CardContent className="p-3 text-center">
              <div className="font-['Inter',Helvetica] font-bold text-[#6d10b0] text-2xl">1</div>
              <div className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                Earned
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#0000001a]">
            <CardContent className="p-3 text-center">
              <div className="font-['Inter',Helvetica] font-bold text-[#6d10b0] text-2xl">1</div>
              <div className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                In Progress
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#0000001a]">
            <CardContent className="p-3 text-center">
              <div className="font-['Inter',Helvetica] font-bold text-[#6d10b0] text-2xl">1</div>
              <div className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                Pending
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earned Certificates */}
        <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-lg mb-3">
          Earned Certificates
        </h2>

        <Card className="border-[#0000001a] mb-6">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base">
                  Basic Computer Skills
                </h3>
                <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                  Computer Literacy Program
                </p>
              </div>
              <Badge className="bg-[#00a63e] text-white border-transparent hover:bg-[#00a63e]">
                Earned
              </Badge>
            </div>

            <div className="text-sm text-[#697282] mb-3">
              <p className="font-['Inter',Helvetica] font-normal">
                Issued: 10 Nov 2024
              </p>
              <p className="font-['Inter',Helvetica] font-normal">
                ID: AFH-CS-2024-001123
              </p>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 h-10 bg-[#6d10b0] hover:bg-[#5a0d94] text-white">
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex-1 h-10 border-[#6d10b0] text-[#6d10b0]">
                <Share2Icon className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-lg mb-3">
          In Progress
        </h2>

        <Card className="border-[#0000001a] mb-6">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base">
                  Digital Marketing Fundamentals
                </h3>
                <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                  Digital Marketing Fundamentals
                </p>
              </div>
              <Badge className="bg-[#3b82f6] text-white border-transparent hover:bg-[#3b82f6]">
                In Progress
              </Badge>
            </div>

            <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm mb-3">
              ID: AFH-DM-2024-001234
            </p>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">
                  Progress
                </span>
                <span className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                  39/60 hours
                </span>
              </div>
              <div className="w-full bg-[#e5e7eb] rounded-full h-2">
                <div className="bg-[#6d10b0] h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-xs mt-1">
                65% complete • 21 hours remaining
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pending */}
        <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-lg mb-3">
          Pending
        </h2>

        <Card className="border-[#0000001a] mb-6">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base">
                  Advanced Excel Training
                </h3>
                <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                  Microsoft Office Suite
                </p>
              </div>
              <Badge variant="outline" className="border-[#697282] text-[#697282]">
                Pending
              </Badge>
            </div>

            <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm mb-3">
              ID: AFH-EX-2024-001235
            </p>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">
                  Progress
                </span>
                <span className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                  10/30 hours
                </span>
              </div>
              <div className="w-full bg-[#e5e7eb] rounded-full h-2">
                <div className="bg-[#6d10b0] h-2 rounded-full" style={{ width: "33%" }}></div>
              </div>
              <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-xs mt-1">
                Complete 20 more hours to earn certificate
              </p>
            </div>
          </CardContent>
        </Card>

        {/* About AFH Certificates */}
        <Card className="bg-[#f3f4f6] border-[#0000001a]">
          <CardContent className="p-4">
            <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-sm mb-2">
              About AFH Certificates
            </h3>
            <ul className="space-y-1">
              {[
                "Certificates are issued after completing minimum 60 learning hours",
                "All certificates are digitally signed and verifiable",
                "Share your achievements on social media",
                "Use certificates to enhance your job applications",
              ].map((item, i) => (
                <li key={i} className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm flex items-start gap-2">
                  <span className="text-[#6d10b0] mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
