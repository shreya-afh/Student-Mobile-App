import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ChevronLeftIcon, MonitorIcon, MapPinIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";
import { validateAttendanceQR, type AttendanceQRData } from "@shared/attendance-schema";
import { useToast } from "@/hooks/use-toast";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function AttendanceStep2() {
  const [, setLocation] = useLocation();
  const [qrData, setQrData] = useState<AttendanceQRData | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isVerifyingLocation, setIsVerifyingLocation] = useState(false);
  const [locationVerified, setLocationVerified] = useState<boolean | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
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

      if (validationResult.data.mode === "offline") {
        verifyLocation(validationResult.data);
      }
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

  const verifyLocation = async (data: AttendanceQRData) => {
    if (!data.location) return;

    setIsVerifyingLocation(true);
    setLocationError(null);

    try {
      const { Geolocation } = await import(/* @vite-ignore */ '@capacitor/geolocation');
      
      const permission = await Geolocation.checkPermissions();
      
      if (permission.location !== 'granted') {
        const requestResult = await Geolocation.requestPermissions();
        if (requestResult.location !== 'granted') {
          setLocationError("Location permission is required for offline sessions");
          setLocationVerified(false);
          setIsVerifyingLocation(false);
          return;
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      const distance = calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        data.location.latitude,
        data.location.longitude
      );

      const ALLOWED_DISTANCE = 1000;

      if (distance <= ALLOWED_DISTANCE) {
        setLocationVerified(true);
        toast({
          title: "Location Verified",
          description: "You are at the session location",
        });
      } else {
        setLocationVerified(false);
        setLocationError(`You are ${Math.round(distance)}m away from the session location. Please move closer.`);
        toast({
          title: "Location Mismatch",
          description: `You must be within ${ALLOWED_DISTANCE}m of the session location`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Location error:", error);
      setLocationVerified(false);
      setLocationError(error.message || "Unable to verify location. Please enable location services.");
      toast({
        title: "Location Error",
        description: "Failed to get your current location",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingLocation(false);
    }
  };

  const handleContinue = () => {
    if (qrData?.mode === "online" || locationVerified) {
      setLocation("/attendance/feedback");
    }
  };

  const handleRetryLocation = () => {
    if (qrData) {
      verifyLocation(qrData);
    }
  };

  if (isValidating) {
    return null;
  }

  const canContinue = qrData?.mode === "online" || locationVerified === true;

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
                Session Information
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

      <div className="flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}>
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#5C4C7D] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-xl mb-2">
              QR Code Scanned Successfully
            </h2>
            <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
              Review session details below
            </p>
          </div>

          {qrData && (
            <>
              <Card className="mb-4 border-[#5C4C7D] bg-[#eff1ff]">
                <CardContent className="p-4">
                  <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-sm mb-3">
                    Session Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-['Inter',Helvetica] font-normal text-[#495565]" data-testid="text-session-name">
                      <span className="font-medium">Session:</span> {qrData.session}
                    </p>
                    <p className="font-['Inter',Helvetica] font-normal text-[#495565]" data-testid="text-session-date">
                      <span className="font-medium">Date:</span> {qrData.date}
                    </p>
                    <p className="font-['Inter',Helvetica] font-normal text-[#495565]" data-testid="text-session-course">
                      <span className="font-medium">Course:</span> {qrData.course}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className={`mb-4 ${
                qrData.mode === "online" ? "border-blue-500 bg-blue-50" : "border-purple-500 bg-purple-50"
              }`}>
                <CardContent className="p-4 flex items-center gap-3">
                  {qrData.mode === "online" ? (
                    <MonitorIcon className="w-8 h-8 text-blue-600" />
                  ) : (
                    <MapPinIcon className="w-8 h-8 text-purple-600" />
                  )}
                  <div>
                    <h4 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base" data-testid="text-session-mode">
                      {qrData.mode === "online" ? "Online Session" : "Offline Session"}
                    </h4>
                    <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                      {qrData.mode === "online" 
                        ? "Virtual classroom attendance" 
                        : qrData.location?.address || "Physical classroom attendance"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {qrData.mode === "offline" && (
                <Card className={`mb-4 ${
                  locationVerified === true 
                    ? "border-green-500 bg-green-50" 
                    : locationVerified === false 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-200"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {isVerifyingLocation ? (
                        <Loader2 className="w-6 h-6 text-gray-600 animate-spin mt-0.5" />
                      ) : locationVerified === true ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
                      ) : locationVerified === false ? (
                        <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                      ) : (
                        <MapPinIcon className="w-6 h-6 text-gray-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-sm mb-1">
                          Location Verification
                        </h4>
                        {isVerifyingLocation ? (
                          <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                            Checking your location...
                          </p>
                        ) : locationVerified === true ? (
                          <p className="font-['Inter',Helvetica] font-normal text-green-700 text-sm">
                            Location verified successfully
                          </p>
                        ) : locationError ? (
                          <>
                            <p className="font-['Inter',Helvetica] font-normal text-red-700 text-sm mb-2">
                              {locationError}
                            </p>
                            <Button
                              onClick={handleRetryLocation}
                              variant="outline"
                              size="sm"
                              className="text-xs h-8"
                              data-testid="button-retry-location"
                            >
                              Retry Location
                            </Button>
                          </>
                        ) : (
                          <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                            Verifying your location...
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-full h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base disabled:opacity-50"
            data-testid="button-continue-feedback"
          >
            Continue to Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}
