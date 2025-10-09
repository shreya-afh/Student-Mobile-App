import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { ChevronLeftIcon, CameraIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRegistration } from "@/contexts/RegistrationContext";
import { useToast } from "@/hooks/use-toast";

export default function RegisterStep4() {
  const [, setLocation] = useLocation();
  const { registrationData, updateStep4, resetRegistration } = useRegistration();
  const [formData, setFormData] = useState(registrationData.step4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData(registrationData.step4);
  }, [registrationData.step4]);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    updateStep4(formData);
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify({
        step1: registrationData.step1,
        step2: registrationData.step2,
        step3: registrationData.step3,
        step4: {
          aadhaar: formData.aadhaar,
          isPWD: formData.isPWD,
          isGovtEmployee: formData.isGovtEmployee,
        },
      }));

      if (formData.selfie) {
        formDataToSend.append("selfie", formData.selfie);
      }

      const response = await fetch("/api/register", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Registration Successful",
          description: "Your data has been saved to Google Sheets!",
        });
        resetRegistration();
        setLocation("/verify-otp");
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, selfie: e.target.files[0] });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9fb] flex flex-col">
      {/* Header */}
      <header className="bg-[linear-gradient(90deg,rgba(218,178,255,1)_0%,rgba(196,180,255,1)_100%)] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/register/step3")}
              className="h-8 w-9 p-0 hover:bg-transparent"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#6d10b0]" />
            </Button>
            <span className="font-['Inter',Helvetica] font-medium text-[#6d10b0] text-sm">
              Back
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-['Inter',Helvetica] font-normal text-[#6d10b0] text-xs">
              Step 4 of 4
            </span>
            <div className="bg-[#ffffffe6] rounded-[10px] px-3 py-1.5">
              <span className="font-['Inter',Helvetica] font-normal text-[#1d2838] text-xs">
                Infosys X AspireForHer
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto">
          <h1 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-xl mb-6">
            Verification Details
          </h1>

          <form onSubmit={handleComplete} className="space-y-4">
            <div>
              <Label htmlFor="aadhaar" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Aadhaar Number *
              </Label>
              <Input
                id="aadhaar"
                placeholder="Enter 12-digit Aadhaar number"
                value={formData.aadhaar}
                onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                className="mt-1"
                maxLength={12}
                required
              />
              <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                Will be safely stored with encryption
              </p>
            </div>

            <div>
              <Label className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm mb-2 block">
                Person with Disability (PWD) Status *
              </Label>
              <div className="flex gap-3">
                {["Yes", "No"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData({ ...formData, isPWD: option })}
                    className={`flex-1 h-10 rounded-lg border font-['Inter',Helvetica] font-normal text-sm transition-colors ${
                      formData.isPWD === option
                        ? "border-[#6d10b0] bg-[#6d10b0]/5 text-[#6d10b0]"
                        : "border-[#0000001a] text-[#495565]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm mb-2 block">
                Is any family member a Government Employee? *
              </Label>
              <div className="flex gap-3">
                {["Yes", "No"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData({ ...formData, isGovtEmployee: option })}
                    className={`flex-1 h-10 rounded-lg border font-['Inter',Helvetica] font-normal text-sm transition-colors ${
                      formData.isGovtEmployee === option
                        ? "border-[#6d10b0] bg-[#6d10b0]/5 text-[#6d10b0]"
                        : "border-[#0000001a] text-[#495565]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm mb-2 block">
                Live Picture (Selfie) *
              </Label>
              <div className="border-2 border-dashed border-[#0000001a] rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="selfie-input"
                />
                <label htmlFor="selfie-input" className="cursor-pointer">
                  <CameraIcon className="w-12 h-12 mx-auto text-[#697282] mb-2" />
                  <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                    Tap to capture selfie
                  </p>
                  <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                    Live camera required
                  </p>
                  {formData.selfie && (
                    <p className="font-['Inter',Helvetica] font-normal text-[#6d10b0] text-xs mt-2">
                      ✓ Photo captured
                    </p>
                  )}
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#6d10b0] hover:bg-[#5a0d94] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base mt-6 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Complete Registration"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
