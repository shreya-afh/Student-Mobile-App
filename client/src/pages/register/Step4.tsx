import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { ChevronLeftIcon, CameraIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRegistration } from "@/contexts/RegistrationContext";
import { useToast } from "@/hooks/use-toast";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";

export default function RegisterStep4() {
  const [, setLocation] = useLocation();
  const { registrationData, updateStep4 } = useRegistration();
  const [formData, setFormData] = useState(registrationData.step4);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.password || formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    updateStep4(formData);
    setLocation("/verify-otp");
  };

  const handleCaptureSelfie = async () => {
    try {
      const { Camera, CameraResultType, CameraSource, CameraDirection } = await import(/* @vite-ignore */ '@capacitor/camera');
      
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
                onClick={() => setLocation("/register/step3")}
                className="h-10 w-10 p-0 hover:bg-gray-100 relative z-10 -ml-2"
              >
                <ChevronLeftIcon className="w-6 h-6 text-[#495565]" />
              </Button>
              <span className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Back
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-['Inter',Helvetica] font-normal text-[#495565] text-xs">
                Step 4 of 4
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
                        ? "border-[#5C4C7D] bg-[#5C4C7D]/5 text-[#5C4C7D]"
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
                        ? "border-[#5C4C7D] bg-[#5C4C7D]/5 text-[#5C4C7D]"
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
                className="w-full border-2 border-dashed border-[#0000001a] rounded-lg p-8 text-center hover:bg-[#5C4C7D]/5 transition-colors"
              >
                <CameraIcon className="w-12 h-12 mx-auto text-[#697282] mb-2" />
                <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                  Tap to capture selfie
                </p>
                <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                  Live camera required
                </p>
                {formData.selfie && (
                  <p className="font-['Inter',Helvetica] font-normal text-[#5C4C7D] text-xs mt-2">
                    ✓ Photo captured
                  </p>
                )}
              </button>
            </div>

            <div>
              <Label htmlFor="password" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Create Password *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password (min. 6 characters)"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setPasswordError("");
                  }}
                  className={passwordError ? 'border-red-500 pr-10' : 'pr-10'}
                  required
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#697282] hover:text-[#495565]"
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                You'll use this password to login
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Confirm Password *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className={passwordError ? 'border-red-500 pr-10' : 'pr-10'}
                  required
                  data-testid="input-confirm-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#697282] hover:text-[#495565]"
                >
                  {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="font-['Inter',Helvetica] font-normal text-red-500 text-xs mt-1">
                  {passwordError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base mt-6"
            >
              Continue to Verification
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
