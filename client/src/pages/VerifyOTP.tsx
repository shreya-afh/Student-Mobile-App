import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { ChevronLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function VerifyOTP() {
  const [, setLocation] = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(25);

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

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = () => {
    setLocation("/course-enrollment");
  };

  return (
    <div className="min-h-screen bg-[#faf9fb] flex flex-col">
      {/* Header */}
      <header className="bg-[linear-gradient(90deg,rgba(218,178,255,1)_0%,rgba(196,180,255,1)_100%)] p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/register/step4")}
            className="h-8 w-9 p-0 hover:bg-transparent"
          >
            <ChevronLeftIcon className="w-6 h-6 text-[#6d10b0]" />
          </Button>
          <span className="font-['Inter',Helvetica] font-medium text-[#6d10b0] text-sm">
            Back
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-2xl mb-2">
            Verify Your Phone
          </h1>
          <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-8">
            We've sent a 6-digit code to
          </p>

          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 h-12 text-center text-xl font-semibold"
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            disabled={otp.some((d) => !d)}
            className="w-full h-12 bg-[#6d10b0] hover:bg-[#5a0d94] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base mb-4"
          >
            Verify OTP
          </Button>

          <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
            {timer > 0 ? (
              `Resend code in ${timer}s`
            ) : (
              <button
                onClick={() => setTimer(25)}
                className="text-[#6d10b0] hover:underline"
              >
                Resend code
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
