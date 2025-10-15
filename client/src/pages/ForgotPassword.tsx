import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { ChevronLeftIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"phone" | "otp" | "password">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [timer, setTimer] = useState(0);

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/send-otp", { mobileNumber: phoneNumber });
      return response.json();
    },
    onSuccess: () => {
      setTimer(60);
      setStep("otp");
      toast({
        title: "OTP Sent",
        description: "Please check your SMS for the verification code",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (otpCode: string) => {
      const response = await apiRequest("POST", "/api/verify-otp", { 
        mobileNumber: phoneNumber, 
        otp: otpCode 
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        // Keep OTP in state for password reset verification
        setStep("password");
        toast({
          title: "OTP Verified",
          description: "Please enter your new password",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/reset-password", { 
        mobileNumber: phoneNumber,
        otp: otp.join(""),
        newPassword 
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Reset Successful",
        description: "You can now login with your new password",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    sendOtpMutation.mutate();
  };

  const handleVerifyOtp = () => {
    const otpCode = otp.join("");
    if (otpCode.length === 5) {
      verifyOtpMutation.mutate(otpCode);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    resetPasswordMutation.mutate();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    if (newOtp.join("").length === 5) {
      setTimeout(() => {
        const otpCode = newOtp.join("");
        verifyOtpMutation.mutate(otpCode);
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9fb] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
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
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/login")}
              className="h-8 w-9 p-0 hover:bg-gray-100"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#495565]" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto">
          <h1 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-2xl mb-2">
            Forgot Password
          </h1>
          <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm mb-6">
            {step === "phone" && "Enter your registered mobile number to receive OTP"}
            {step === "otp" && "Enter the OTP sent to your mobile number"}
            {step === "password" && "Create a new password for your account"}
          </p>

          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label htmlFor="phone" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                  Mobile Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1"
                  required
                  data-testid="input-phone"
                />
              </div>

              <Button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="w-full h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base mt-6"
                data-testid="button-send-otp"
              >
                {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <div className="space-y-6">
              <div>
                <Label className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm mb-4 block">
                  Enter OTP
                </Label>
                <div className="flex gap-3 justify-center">
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
              </div>

              <div className="text-center space-y-2">
                {timer > 0 ? (
                  <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm">
                    Resend OTP in {timer}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => sendOtpMutation.mutate()}
                    className="font-['Inter',Helvetica] font-normal text-[#5C4C7D] text-sm hover:underline"
                    data-testid="button-resend-otp"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {step === "password" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="newPassword" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                  New Password *
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password (min. 6 characters)"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError("");
                    }}
                    className={passwordError ? 'border-red-500 pr-10' : 'pr-10'}
                    required
                    data-testid="input-new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#697282] hover:text-[#495565]"
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmNewPassword" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                  Confirm New Password *
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmNewPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError("");
                    }}
                    className={passwordError ? 'border-red-500 pr-10' : 'pr-10'}
                    required
                    data-testid="input-confirm-new-password"
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
                disabled={resetPasswordMutation.isPending}
                className="w-full h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base mt-6"
                data-testid="button-reset-password"
              >
                {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
