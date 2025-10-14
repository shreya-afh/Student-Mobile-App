import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ChevronLeftIcon, QrCodeIcon } from "lucide-react";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";

export default function AttendanceStep1() {
  const [, setLocation] = useLocation();
  useAndroidBackButton("/dashboard");

  const handleScanQR = () => {
    setLocation("/attendance/mode");
  };

  return (
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[#6d10b0] pt-safe pb-4 px-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard")}
              className="h-10 w-10 p-0 hover:bg-transparent relative z-10 -ml-2"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </Button>
            <h1 className="font-['Inter',Helvetica] font-semibold text-white text-lg">
              Attendance and Feedback
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-['Inter',Helvetica] font-normal text-white text-xs">
              Step 1 of 3
            </span>
            <div className="bg-[#ffffffe6] rounded-[10px] px-3 py-1.5">
              <span className="font-['Inter',Helvetica] font-normal text-[#1d2838] text-xs">
                Infosys X AspireForHer
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <Card className="border-[#6d10b0] bg-[#eff1ff] mb-6">
            <CardContent className="p-4">
              <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-lg mb-2">
                Feedback Required
              </h2>
              <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                Your feedback is mandatory to mark attendance. After scanning QR or joining online, you'll be asked to rate the session.
              </p>
            </CardContent>
          </Card>

          <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-xl mb-4 text-center">
            Mark Your Attendance
          </h2>

          <div className="flex flex-col items-center">
            <div className="w-48 h-48 border-4 border-[#6d10b0] border-dashed rounded-lg flex items-center justify-center mb-6">
              <QrCodeIcon className="w-24 h-24 text-[#6d10b0]" />
            </div>

            <Button
              onClick={handleScanQR}
              className="w-full max-w-xs h-12 bg-[#6d10b0] hover:bg-[#5a0d94] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base"
            >
              Scan QR Code
            </Button>
            <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm mt-2 text-center">
              Mark attendance and submit feedback
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
