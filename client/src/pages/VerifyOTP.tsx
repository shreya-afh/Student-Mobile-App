import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ChevronLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRegistration } from "@/contexts/RegistrationContext";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, getApiBaseUrl } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";

export default function VerifyOTP() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { registrationData, resetRegistration } = useRegistration();
  const { toast } = useToast();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(0); // Start at 0, will be set to 60 when OTP is successfully sent

  useAndroidBackButton("/register/step4");

  const mobileNumber = registrationData.step3.studentContact;

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      console.log('[OTP DEBUG] Sending OTP to:', mobileNumber);
      console.log('[OTP DEBUG] API Base URL:', getApiBaseUrl());
      const response = await apiRequest("POST", "/api/send-otp", { mobileNumber });
      return response.json();
    },
    onSuccess: () => {
      setTimer(60); // Start timer only on successful send
      toast({
        title: "OTP Sent",
        description: "Please check your SMS for the verification code",
      });
    },
    onError: (error: any) => {
      // Stop timer on error so resend button is immediately available
      setTimer(0);
      
      console.error('[OTP ERROR]', error);
      console.error('[OTP ERROR] Full error:', JSON.stringify(error, null, 2));
      
      // Parse error message from response
      let errorMessage = "Failed to send OTP. Please try again.";
      try {
        const errorText = error.message || "";
        // Extract JSON from error message like "500: {"success":false,"message":"..."}"
        const match = errorText.match(/\d+:\s*(\{.*\})/);
        if (match && match[1]) {
          const errorData = JSON.parse(match[1]);
          errorMessage = errorData.message || errorMessage;
        }
      } catch (e) {
        // Use default message if parsing fails
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (otpCode: string) => {
      // First verify OTP
      const verifyResponse = await apiRequest("POST", "/api/verify-otp", { mobileNumber, otp: otpCode });
      const verifyResult = await verifyResponse.json();
      
      if (!verifyResult.success) {
        throw new Error(JSON.stringify(verifyResult));
      }

      // Then submit registration data
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify({
        step1: registrationData.step1,
        step2: registrationData.step2,
        step3: registrationData.step3,
        step4: {
          aadhaar: registrationData.step4.aadhaar,
          isPWD: registrationData.step4.isPWD,
          isGovtEmployee: registrationData.step4.isGovtEmployee,
          password: registrationData.step4.password,
        },
      }));

      if (registrationData.step4.selfie) {
        formDataToSend.append("selfie", registrationData.step4.selfie);
      }

      const registerResponse = await fetch(getApiBaseUrl() + "/api/register", {
        method: "POST",
        body: formDataToSend,
      });

      const registerResult = await registerResponse.json();
      
      if (!registerResult.success) {
        throw new Error(JSON.stringify(registerResult));
      }

      return registerResult;
    },
    onSuccess: (result) => {
      toast({
        title: "Registration Successful",
        description: `Reg. ID: ${result.userId}`,
        duration: 5000,
      });
      login({ 
        id: result.userId, 
        phone: mobileNumber, 
        name: registrationData.step1.fullName 
      });
      resetRegistration();
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      // Parse error message and type from response
      let errorMessage = "Invalid OTP. Please try again.";
      let errorType = "invalid";
      
      try {
        const errorText = error.message || "";
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
        errorType = errorData.errorType || errorType;
      } catch (e) {
        // Use default message if parsing fails
      }

      // Clear OTP inputs if expired to help user understand they need to resend
      if (errorType === "expired") {
        setOtp(["", "", "", "", ""]);
      }
      
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Send OTP when component mounts
    if (mobileNumber) {
      sendOtpMutation.mutate();
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 4) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    verifyOtpMutation.mutate(otpCode);
  };

  const handleResend = () => {
    setOtp(["", "", "", "", ""]); // Clear OTP inputs
    sendOtpMutation.mutate(); // Timer will be set by mutation's onSuccess
  };

  return (
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 pt-safe">
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
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/register/step4")}
              className="h-10 w-10 p-0 hover:bg-gray-100"
              data-testid="button-back"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#495565]" />
            </Button>
            <span className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
              Back
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-md w-full text-center">
          <h1 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-2xl mb-2">
            Verify Your Phone
          </h1>
          <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-2">
            We've sent a 5-digit code to
          </p>
          <p className="font-['Inter',Helvetica] font-semibold text-[#5C4C7D] text-base mb-8" data-testid="text-phone">
            {mobileNumber}
          </p>

          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 h-12 text-center text-xl font-semibold"
                data-testid={`input-otp-${index}`}
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            disabled={otp.some((d) => !d) || verifyOtpMutation.isPending}
            className="w-full h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base mb-4"
            data-testid="button-verify"
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
          </Button>

          <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
            {timer > 0 ? (
              <span data-testid="text-timer">Resend code in {timer}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={sendOtpMutation.isPending}
                className="text-[#5C4C7D] hover:underline disabled:opacity-50"
                data-testid="button-resend"
              >
                {sendOtpMutation.isPending ? "Sending..." : "Resend code"}
              </button>
            )}
          </p>

          <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-4">
            Didn't receive the code? Check your SMS or try resending.
          </p>

          <div className="mt-8 p-4 bg-[#eff1ff] rounded-lg">
            <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-xs">
              We use OTP verification to ensure the security of your account and prevent fraud.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
