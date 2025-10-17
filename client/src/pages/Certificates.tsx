import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ChevronLeftIcon, DownloadIcon, Share2Icon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";

export default function Certificates() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  useAndroidBackButton("/dashboard");

  const handleDownload = (certName: string) => {
    const certData = `
AFH STUDENT APP - CERTIFICATE OF COMPLETION

This certifies that

[STUDENT NAME]

has successfully completed

${certName}

Issued by: AspireForHer X Infosys
Date: ${new Date().toLocaleDateString()}
Certificate ID: AFH-CS-2024-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}

This is a digitally generated certificate.
    `.trim();

    const blob = new Blob([certData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${certName.replace(/\s+/g, '_')}_Certificate.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Certificate Downloaded",
      description: `${certName} certificate has been downloaded successfully!`,
    });
  };

  const handleShare = async (certName: string) => {
    const shareText = `Check out my ${certName} certificate from AFH Student App!`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: certName,
          text: shareText,
          url: shareUrl,
        });
        toast({
          title: "Certificate Shared",
          description: "Certificate shared successfully!",
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          await fallbackCopyToClipboard(shareText, shareUrl);
        }
      }
    } else {
      await fallbackCopyToClipboard(shareText, shareUrl);
    }
  };

  const fallbackCopyToClipboard = async (text: string, url: string) => {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast({
        title: "Link Copied",
        description: "Certificate link copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
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
                My Certificates
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-20" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="border-gray-200 hover:shadow-md transition-all">
            <CardContent className="p-3 text-center">
              <div className="font-['Inter',Helvetica] font-bold text-[#5C4C7D] text-2xl">1</div>
              <div className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                Earned
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-md transition-all">
            <CardContent className="p-3 text-center">
              <div className="font-['Inter',Helvetica] font-bold text-[#5C4C7D] text-2xl">1</div>
              <div className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                In Progress
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-md transition-all">
            <CardContent className="p-3 text-center">
              <div className="font-['Inter',Helvetica] font-bold text-[#5C4C7D] text-2xl">1</div>
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

        <Card className="border-gray-200 hover:shadow-md transition-all mb-6">
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
              <Button 
                onClick={() => handleDownload("Basic Computer Skills")}
                className="flex-1 h-10 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                onClick={() => handleShare("Basic Computer Skills")}
                variant="outline" 
                className="flex-1 h-10 border-[#5C4C7D] text-[#5C4C7D]"
              >
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

        <Card className="border-gray-200 hover:shadow-md transition-all mb-6">
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
                <div className="bg-[#5C4C7D] h-2 rounded-full" style={{ width: "65%" }}></div>
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

        <Card className="border-gray-200 hover:shadow-md transition-all mb-6">
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
                <div className="bg-[#5C4C7D] h-2 rounded-full" style={{ width: "33%" }}></div>
              </div>
              <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-xs mt-1">
                Complete 20 more hours to earn certificate
              </p>
            </div>
          </CardContent>
        </Card>

        {/* About AFH Certificates */}
        <Card className="bg-[#f3f4f6] border-gray-200">
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
                  <span className="text-[#5C4C7D] mt-0.5">•</span>
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
