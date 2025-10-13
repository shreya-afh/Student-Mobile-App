import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "wouter";
import { ChevronLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRegistration } from "@/contexts/RegistrationContext";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";

export default function RegisterStep3() {
  const [, setLocation] = useLocation();
  const { registrationData, updateStep3 } = useRegistration();
  const [formData, setFormData] = useState(registrationData.step3);
  const [errors, setErrors] = useState({ studentContact: "", guardianContact: "", whatsappNumber: "" });
  useAndroidBackButton("/register/step2");

  useEffect(() => {
    setFormData(registrationData.step3);
  }, [registrationData.step3]);

  const validatePhoneNumber = (number: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const handleStudentContactChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, studentContact: numericValue });
    
    if (numericValue && !validatePhoneNumber(numericValue)) {
      setErrors({ ...errors, studentContact: "Enter a valid 10-digit mobile number" });
    } else if (numericValue === formData.guardianContact && numericValue.length === 10) {
      setErrors({ ...errors, studentContact: "Student and guardian numbers must be different" });
    } else {
      setErrors({ ...errors, studentContact: "" });
    }
  };

  const handleGuardianContactChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, guardianContact: numericValue });
    
    if (numericValue && !validatePhoneNumber(numericValue)) {
      setErrors({ ...errors, guardianContact: "Enter a valid 10-digit mobile number" });
    } else if (numericValue === formData.studentContact && numericValue.length === 10) {
      setErrors({ ...errors, guardianContact: "Guardian and student numbers must be different" });
    } else {
      setErrors({ ...errors, guardianContact: "" });
    }
  };

  const handleWhatsappNumberChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, whatsappNumber: numericValue });
    
    if (numericValue && !validatePhoneNumber(numericValue)) {
      setErrors({ ...errors, whatsappNumber: "Enter a valid 10-digit mobile number" });
    } else {
      setErrors({ ...errors, whatsappNumber: "" });
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhoneNumber(formData.studentContact)) {
      setErrors({ ...errors, studentContact: "Enter a valid 10-digit mobile number" });
      return;
    }

    if (!validatePhoneNumber(formData.guardianContact)) {
      setErrors({ ...errors, guardianContact: "Enter a valid 10-digit mobile number" });
      return;
    }

    if (formData.studentContact === formData.guardianContact) {
      setErrors({ 
        ...errors, 
        studentContact: "Student and guardian numbers must be different",
        guardianContact: "Guardian and student numbers must be different"
      });
      return;
    }

    if (formData.whatsappNumber && !validatePhoneNumber(formData.whatsappNumber)) {
      setErrors({ ...errors, whatsappNumber: "Enter a valid 10-digit mobile number" });
      return;
    }

    updateStep3(formData);
    setLocation("/register/step4");
  };

  return (
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[linear-gradient(90deg,rgba(218,178,255,1)_0%,rgba(196,180,255,1)_100%)] pt-safe pb-4 px-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/register/step2")}
              className="h-10 w-10 p-0 hover:bg-transparent relative z-10 -ml-2"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#6d10b0]" />
            </Button>
            <span className="font-['Inter',Helvetica] font-medium text-[#6d10b0] text-sm">
              Back
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-['Inter',Helvetica] font-normal text-[#6d10b0] text-xs">
              Step 3 of 4
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
            Contact Details
          </h1>

          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <Label htmlFor="studentContact" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Student Contact Number *
              </Label>
              <Input
                id="studentContact"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={formData.studentContact}
                onChange={(e) => handleStudentContactChange(e.target.value)}
                className={`mt-1 ${errors.studentContact ? 'border-red-500' : ''}`}
                maxLength={10}
                required
                data-testid="input-student-contact"
              />
              {errors.studentContact ? (
                <p className="font-['Inter',Helvetica] font-normal text-red-500 text-xs mt-1">
                  {errors.studentContact}
                </p>
              ) : (
                <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                  This will be verified with OTP
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="whatsappNumber" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                WhatsApp Number (Optional)
              </Label>
              <Input
                id="whatsappNumber"
                type="tel"
                placeholder="Enter 10-digit WhatsApp number"
                value={formData.whatsappNumber}
                onChange={(e) => handleWhatsappNumberChange(e.target.value)}
                className={`mt-1 ${errors.whatsappNumber ? 'border-red-500' : ''}`}
                maxLength={10}
                data-testid="input-whatsapp"
              />
              {errors.whatsappNumber && (
                <p className="font-['Inter',Helvetica] font-normal text-red-500 text-xs mt-1">
                  {errors.whatsappNumber}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="guardianContact" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Guardian's Contact *
              </Label>
              <Input
                id="guardianContact"
                type="tel"
                placeholder="Enter 10-digit guardian mobile number"
                value={formData.guardianContact}
                onChange={(e) => handleGuardianContactChange(e.target.value)}
                className={`mt-1 ${errors.guardianContact ? 'border-red-500' : ''}`}
                maxLength={10}
                required
                data-testid="input-guardian-contact"
              />
              {errors.guardianContact && (
                <p className="font-['Inter',Helvetica] font-normal text-red-500 text-xs mt-1">
                  {errors.guardianContact}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="familyIncome" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Family Income *
              </Label>
              <Select value={formData.familyIncome} onValueChange={(value) => setFormData({ ...formData, familyIncome: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select income range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="below-2lakh">Below ₹2 Lakh</SelectItem>
                  <SelectItem value="2-5lakh">₹2-5 Lakh</SelectItem>
                  <SelectItem value="5-10lakh">₹5-10 Lakh</SelectItem>
                  <SelectItem value="above-10lakh">Above ₹10 Lakh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#6d10b0] hover:bg-[#5a0d94] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base mt-6"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
