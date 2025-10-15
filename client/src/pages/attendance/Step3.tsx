import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { ChevronLeftIcon, StarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { validateAttendanceQR, type AttendanceQRData } from "@shared/attendance-schema";
import { useAuth } from "@/contexts/AuthContext";

export default function AttendanceStep3() {
  const [, setLocation] = useLocation();
  const [rating, setRating] = useState(0);
  const [suggestions, setSuggestions] = useState("");
  const [qrData, setQrData] = useState<AttendanceQRData | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  useAndroidBackButton("/attendance/mode");

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("attendance_qr_data");
      if (!storedData) {
        toast({
          title: "No Attendance Data",
          description: "Please scan a QR code first",
          variant: "destructive",
        });
        setLocation("/attendance");
        return;
      }

      const parsedData = JSON.parse(storedData);
      const validationResult = validateAttendanceQR(parsedData);
      
      if (!validationResult.success) {
        toast({
          title: "Invalid Attendance Data",
          description: validationResult.error,
          variant: "destructive",
        });
        setLocation("/attendance");
        return;
      }
      
      setQrData(validationResult.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attendance data",
        variant: "destructive",
      });
      setLocation("/attendance");
    }
  }, [setLocation, toast]);

  const saveAttendanceMutation = useMutation({
    mutationFn: async (data: {
      userId: string;
      sessionId: string;
      courseId: string;
      sessionName: string;
      courseName: string;
      sessionDate: string;
      mode: string;
      locationLat?: string;
      locationLong?: string;
      locationAddress?: string;
      rating: number;
      feedback?: string;
    }) => {
      const response = await apiRequest("POST", "/api/attendance", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Attendance recorded successfully",
      });
      
      try {
        localStorage.removeItem("attendance_qr_data");
      } catch (e) {
        console.error("Failed to clear attendance data:", e);
      }
      
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save attendance. Please try again.",
        variant: "destructive",
      });
      console.error("Save attendance error:", error);
    },
  });

  const handleSubmit = () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not logged in",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    if (!qrData || rating === 0) {
      return;
    }

    saveAttendanceMutation.mutate({
      userId: user.id,
      sessionId: qrData.sessionId,
      courseId: qrData.courseId,
      sessionName: qrData.session,
      courseName: qrData.course,
      sessionDate: qrData.date,
      mode: qrData.mode,
      locationLat: qrData.location?.latitude?.toString(),
      locationLong: qrData.location?.longitude?.toString(),
      locationAddress: qrData.location?.address,
      rating,
      feedback: suggestions || undefined,
    });
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
                onClick={() => setLocation("/attendance/mode")}
                className="h-10 w-10 p-0 hover:bg-gray-100 relative z-10 -ml-2"
                data-testid="button-back"
              >
                <ChevronLeftIcon className="w-6 h-6 text-[#495565]" />
              </Button>
              <h1 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-lg">
                Feedback
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-['Inter',Helvetica] font-normal text-[#495565] text-xs">
                Step 3 of 3
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-xl mb-2">
              Submit feedback to proceed
            </h2>
            <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
              {qrData?.mode === "online" ? "Online session" : "Offline session"}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base">
                Rate Your Session <span className="text-[#e7000b]">*Required</span>
              </h3>
            </div>
            <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm mb-4">
              Your feedback helps us improve training quality
            </p>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm text-center mb-3">
                Overall Session Rating
              </p>
              
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                    data-testid={`button-star-${star}`}
                  >
                    <StarIcon
                      className={`w-10 h-10 ${
                        star <= rating
                          ? "fill-[#fbbf24] text-[#fbbf24]"
                          : "text-[#d1d5db]"
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs text-center">
                Tap stars to rate
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm mb-2 block">
              Suggestions (Optional)
            </label>
            <Textarea
              placeholder="Share any suggestions to improve future sessions..."
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              className="min-h-[100px]"
              data-testid="textarea-suggestions"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || saveAttendanceMutation.isPending}
            className="w-full h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base disabled:opacity-50"
            data-testid="button-submit-feedback"
          >
            {saveAttendanceMutation.isPending ? "Submitting..." : "Submit Feedback & Confirm Attendance"}
          </Button>
        </div>
      </div>
    </div>
  );
}
