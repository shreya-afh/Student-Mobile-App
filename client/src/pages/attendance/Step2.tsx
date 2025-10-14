import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ChevronLeftIcon, MonitorIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";

export default function AttendanceStep2() {
  const [, setLocation] = useLocation();
  const [sessionMode, setSessionMode] = useState("");
  useAndroidBackButton("/attendance");

  const handleContinue = () => {
    if (sessionMode) {
      setLocation("/attendance/feedback");
    }
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
              onClick={() => setLocation("/attendance")}
              className="h-10 w-10 p-0 hover:bg-transparent relative z-10 -ml-2"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </Button>
            <h1 className="font-['Inter',Helvetica] font-semibold text-white text-lg">
              Session Mode
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-['Inter',Helvetica] font-normal text-white text-xs">
              Step 2 of 3
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
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#6d10b0] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-xl mb-2">
              QR Code Scanned
            </h2>
            <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
              Please select your session mode
            </p>
          </div>

          <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base mb-4">
            Is this session Online or Offline?
          </h3>

          <div className="space-y-3 mb-6">
            <Card
              onClick={() => setSessionMode("offline")}
              className={`cursor-pointer transition-all ${
                sessionMode === "offline"
                  ? "border-[#6d10b0] bg-[#eff1ff]"
                  : "border-[#0000001a]"
              }`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  sessionMode === "offline" ? "bg-[#6d10b0]" : "bg-[#f3f4f6]"
                }`}>
                  <UsersIcon className={`w-6 h-6 ${
                    sessionMode === "offline" ? "text-white" : "text-[#697282]"
                  }`} />
                </div>
                <div>
                  <h4 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base">
                    Offline Session
                  </h4>
                  <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                    Physical classroom attendance
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              onClick={() => setSessionMode("online")}
              className={`cursor-pointer transition-all ${
                sessionMode === "online"
                  ? "border-[#6d10b0] bg-[#eff1ff]"
                  : "border-[#0000001a]"
              }`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  sessionMode === "online" ? "bg-[#6d10b0]" : "bg-[#f3f4f6]"
                }`}>
                  <MonitorIcon className={`w-6 h-6 ${
                    sessionMode === "online" ? "text-white" : "text-[#697282]"
                  }`} />
                </div>
                <div>
                  <h4 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base">
                    Online Session
                  </h4>
                  <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                    Virtual classroom attendance
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!sessionMode}
            className="w-full h-12 bg-[#6d10b0] hover:bg-[#5a0d94] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
