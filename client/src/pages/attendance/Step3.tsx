import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { ChevronLeftIcon, StarIcon } from "lucide-react";
import { useState } from "react";

export default function AttendanceStep3() {
  const [, setLocation] = useLocation();
  const [rating, setRating] = useState(0);
  const [suggestions, setSuggestions] = useState("");

  const handleSubmit = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[linear-gradient(90deg,rgba(218,178,255,1)_0%,rgba(196,180,255,1)_100%)] p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/attendance/mode")}
              className="h-8 w-9 p-0 hover:bg-transparent"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#6d10b0]" />
            </Button>
            <h1 className="font-['Inter',Helvetica] font-semibold text-[#6d10b0] text-lg">
              Feedback
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-['Inter',Helvetica] font-normal text-[#6d10b0] text-xs">
              Step 3 of 3
            </span>
            <div className="bg-[#ffffffe6] rounded-[10px] px-3 py-1.5">
              <span className="font-['Inter',Helvetica] font-normal text-[#1d2838] text-xs">
                Infosys X AspireForHer
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-xl mb-2">
              Submit feedback to proceed
            </h2>
            <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
              Offline session selected
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

            <div className="bg-white border border-[#0000001a] rounded-lg p-6">
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
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full h-12 bg-[#6d10b0] hover:bg-[#5a0d94] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base disabled:opacity-50"
          >
            Submit Feedback & Confirm Attendance
          </Button>
        </div>
      </div>
    </div>
  );
}
