import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ChevronLeftIcon, QrCodeIcon } from "lucide-react";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";
import { QRScanner } from "@/components/QRScanner";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validateAttendanceQR } from "@shared/attendance-schema";

export default function AttendanceStep1() {
  const [, setLocation] = useLocation();
  const [showScanner, setShowScanner] = useState(false);
  const { toast } = useToast();
  useAndroidBackButton("/dashboard");

  const handleScanQR = () => {
    setShowScanner(true);
  };

  const handleScanSuccess = (decodedText: string) => {
    setShowScanner(false);
    
    try {
      const parsedData = JSON.parse(decodedText);
      const validationResult = validateAttendanceQR(parsedData);
      
      if (!validationResult.success) {
        toast({
          title: "Invalid QR Code",
          description: validationResult.error,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "QR Code Scanned",
        description: "Attendance data captured successfully",
      });
      
      try {
        localStorage.setItem("attendance_qr_data", JSON.stringify(validationResult.data));
        setLocation("/attendance/mode");
      } catch (storageError) {
        toast({
          title: "Storage Error",
          description: "Unable to save attendance data. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Invalid QR Code",
        description: "Please scan a valid attendance QR code with JSON format",
        variant: "destructive",
      });
    }
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
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
                Attendance and Feedback
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-['Inter',Helvetica] font-normal text-[#495565] text-xs">
                Step 1 of 3
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}>
        <div className="max-w-md mx-auto w-full">
          <Card className="border-gray-200 hover:shadow-md transition-all bg-[#eff1ff] mb-6">
            <CardContent className="p-4">
              <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-lg mb-2">
                Feedback Required
              </h2>
              <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                Your feedback is mandatory to mark attendance. After scanning QR, you'll be asked to rate the session.
              </p>
            </CardContent>
          </Card>

          <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-xl mb-4 text-center">
            Mark Your Attendance
          </h2>

          <div className="flex flex-col items-center">
            <div className="w-48 h-48 border-4 border-[#5C4C7D] border-dashed rounded-lg flex items-center justify-center mb-6">
              <QrCodeIcon className="w-24 h-24 text-[#5C4C7D]" />
            </div>

            <Button
              onClick={handleScanQR}
              className="w-full max-w-xs h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base"
              data-testid="button-scan-qr"
            >
              Scan QR Code
            </Button>
            <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm mt-2 text-center">
              Mark attendance and submit feedback
            </p>
          </div>
        </div>
      </div>

      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={handleCloseScanner}
        />
      )}
    </div>
  );
}
