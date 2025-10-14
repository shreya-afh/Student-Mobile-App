import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { ChevronLeftIcon, CameraIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRegistration } from "@/contexts/RegistrationContext";
import { useToast } from "@/hooks/use-toast";
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";

export default function RegisterStep4() {
  const [, setLocation] = useLocation();
  const { registrationData, updateStep4 } = useRegistration();
  const [formData, setFormData] = useState(registrationData.step4);
  const [aadhaarError, setAadhaarError] = useState("");
  const { toast } = useToast();
  useAndroidBackButton("/register/step3");

  useEffect(() => {
    setFormData(registrationData.step4);
  }, [registrationData.step4]);

  const validateAadhaar = (number: string): boolean => {
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(number);
  };

  const handleAadhaarChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 12);
    setFormData({ ...formData, aadhaar: numericValue });
    
    if (numericValue && numericValue.length > 0 && numericValue.length < 12) {
      setAadhaarError("Aadhaar must be exactly 12 digits");
    } else if (numericValue && !validateAadhaar(numericValue)) {
      setAadhaarError("Enter a valid 12-digit Aadhaar number");
    } else {
      setAadhaarError("");
    }
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAadhaar(formData.aadhaar)) {
      setAadhaarError("Enter a valid 12-digit Aadhaar number");
      return;
    }

    updateStep4(formData);
    setLocation("/verify-otp");
  };

  const handleCaptureSelfie = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        direction: CameraDirection.Front,
      });

      // Convert the image URI to a File object
      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      
      setFormData({ ...formData, selfie: file });
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera Error",
        description: "Failed to capture selfie. Please try again.",
        variant: "destructive",
      });
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
              onClick={() => setLocation("/register/step3")}
              className="h-10 w-10 p-0 hover:bg-transparent relative z-10 -ml-2"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </Button>
            <span className="font-['Inter',Helvetica] font-medium text-white text-sm">
              Back
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-['Inter',Helvetica] font-normal text-white text-xs">
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

      <div className="flex-1 overflow-y-auto p-4">
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
                type="tel"
                placeholder="Enter 12-digit Aadhaar number"
                value={formData.aadhaar}
                onChange={(e) => handleAadhaarChange(e.target.value)}
                className={`mt-1 ${aadhaarError ? 'border-red-500' : ''}`}
                maxLength={12}
                required
                data-testid="input-aadhaar"
              />
              {aadhaarError ? (
                <p className="font-['Inter',Helvetica] font-normal text-red-500 text-xs mt-1">
                  {aadhaarError}
                </p>
              ) : (
                <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                  Will be safely stored with encryption
                </p>
              )}
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
              <button
                type="button"
                onClick={handleCaptureSelfie}
                className="w-full border-2 border-dashed border-[#0000001a] rounded-lg p-8 text-center hover:bg-[#6d10b0]/5 transition-colors"
              >
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
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#6d10b0] hover:bg-[#5a0d94] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base mt-6"
            >
              Continue to Verification
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
