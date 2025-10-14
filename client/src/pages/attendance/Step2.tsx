import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ChevronLeftIcon, MonitorIcon, UsersIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";
import { validateAttendanceQR, type AttendanceQRData } from "@shared/attendance-schema";
import { useToast } from "@/hooks/use-toast";

export default function AttendanceStep2() {
  const [, setLocation] = useLocation();
  const [sessionMode, setSessionMode] = useState("");
  const [qrData, setQrData] = useState<AttendanceQRData | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const { toast } = useToast();
  useAndroidBackButton("/attendance");

  useEffect(() => {
    let storedData: string | null = null;
    
    try {
      storedData = localStorage.getItem("attendance_qr_data");
    } catch (storageError) {
      console.error("localStorage access error:", storageError);
      toast({
        title: "Storage Access Error",
        description: "Unable to access session data. Please try scanning again.",
        variant: "destructive",
      });
      setLocation("/attendance");
      return;
    }

    if (!storedData) {
      toast({
        title: "No Attendance Data",
        description: "Please scan a QR code first",
        variant: "destructive",
      });
      setLocation("/attendance");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      const validationResult = validateAttendanceQR(parsedData);
      
      if (!validationResult.success) {
        toast({
          title: "Invalid Attendance Data",
          description: validationResult.error,
          variant: "destructive",
        });
        try {
          localStorage.removeItem("attendance_qr_data");
        } catch (e) {
          console.error("Failed to remove invalid data:", e);
        }
        setLocation("/attendance");
        return;
      }
      
      setQrData(validationResult.data);
      setIsValidating(false);
    } catch (error) {
      console.error("Error parsing QR data:", error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load attendance information",
        variant: "destructive",
      });
      try {
        localStorage.removeItem("attendance_qr_data");
      } catch (e) {
        console.error("Failed to remove corrupted data:", e);
      }
      setLocation("/attendance");
    }
  }, [setLocation, toast]);

  if (isValidating) {
    return null;
  }

  const handleContinue = () => {
    if (sessionMode) {
      setLocation("/attendance/feedback");
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
                onClick={() => setLocation("/attendance")}
                className="h-10 w-10 p-0 hover:bg-gray-100 relative z-10 -ml-2"
                data-testid="button-back-attendance"
              >
                <ChevronLeftIcon className="w-6 h-6 text-[#495565]" />
              </Button>
              <h1 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-lg">
                Session Mode
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-['Inter',Helvetica] font-normal text-[#495565] text-xs">
                Step 2 of 3
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#5C4C7D] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-xl mb-2">
              QR Code Scanned
            </h2>
            <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
              Please select your session mode
            </p>
          </div>

          {qrData && (
            <Card className="mb-6 border-[#5C4C7D] bg-[#eff1ff]">
              <CardContent className="p-4">
                <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-sm mb-2">
                  Session Information
                </h3>
                <div className="space-y-1 text-sm">
                  {qrData.session && (
                    <p className="font-['Inter',Helvetica] font-normal text-[#495565]">
                      <span className="font-medium">Session:</span> {qrData.session}
                    </p>
                  )}
                  {qrData.date && (
                    <p className="font-['Inter',Helvetica] font-normal text-[#495565]">
                      <span className="font-medium">Date:</span> {qrData.date}
                    </p>
                  )}
                  {qrData.course && (
                    <p className="font-['Inter',Helvetica] font-normal text-[#495565]">
                      <span className="font-medium">Course:</span> {qrData.course}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base mb-4">
            Is this session Online or Offline?
          </h3>

          <div className="space-y-3 mb-6">
            <Card
              onClick={() => setSessionMode("offline")}
              className={`cursor-pointer hover:shadow-md transition-all ${
                sessionMode === "offline"
                  ? "border-[#5C4C7D] bg-[#eff1ff]"
                  : "border-gray-200"
              }`}
              data-testid="card-session-offline"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  sessionMode === "offline" ? "bg-[#5C4C7D]" : "bg-[#f3f4f6]"
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
              className={`cursor-pointer hover:shadow-md transition-all ${
                sessionMode === "online"
                  ? "border-[#5C4C7D] bg-[#eff1ff]"
                  : "border-gray-200"
              }`}
              data-testid="card-session-online"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  sessionMode === "online" ? "bg-[#5C4C7D]" : "bg-[#f3f4f6]"
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
            className="w-full h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base disabled:opacity-50"
            data-testid="button-continue-session"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
