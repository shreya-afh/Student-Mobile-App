import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";

export default function RegisterStep3() {
  const [, setLocation] = useLocation();
  const { registrationData, updateStep3 } = useRegistration();
  const [formData, setFormData] = useState(registrationData.step3);
  const [errors, setErrors] = useState({ studentContact: "", guardianContact: "", whatsappNumber: "" });
  const [sameAsContact, setSameAsContact] = useState(false);
  useAndroidBackButton("/register/step2");

  useEffect(() => {
    setFormData(registrationData.step3);
  }, [registrationData.step3]);

  const validatePhoneNumber = (number: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const computeContactErrors = (studentNum: string, guardianNum: string) => {
    const newErrors = { studentContact: "", guardianContact: "", whatsappNumber: errors.whatsappNumber };
    
    // Validate student number - check invalid first, then duplicate
    if (studentNum && !validatePhoneNumber(studentNum)) {
      newErrors.studentContact = "Enter a valid 10-digit mobile number";
    } else if (studentNum && guardianNum && studentNum === guardianNum && studentNum.length === 10) {
      newErrors.studentContact = "Student and guardian numbers must be different";
    }
    
    // Validate guardian number - check invalid first, then duplicate
    if (guardianNum && !validatePhoneNumber(guardianNum)) {
      newErrors.guardianContact = "Enter a valid 10-digit mobile number";
    } else if (studentNum && guardianNum && studentNum === guardianNum && guardianNum.length === 10) {
      newErrors.guardianContact = "Guardian and student numbers must be different";
    }
    
    return newErrors;
  };

  const handleStudentContactChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, studentContact: numericValue });
    setErrors(computeContactErrors(numericValue, formData.guardianContact));
    
    // If "same as contact" is checked, update WhatsApp number too
    if (sameAsContact) {
      setFormData({ ...formData, studentContact: numericValue, whatsappNumber: numericValue });
    }
  };

  const handleGuardianContactChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, guardianContact: numericValue });
    setErrors(computeContactErrors(formData.studentContact, numericValue));
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

    if (!formData.whatsappNumber) {
      setErrors({ ...errors, whatsappNumber: "WhatsApp number is required" });
      return;
    }

    if (!validatePhoneNumber(formData.whatsappNumber)) {
      setErrors({ ...errors, whatsappNumber: "Enter a valid 10-digit mobile number" });
      return;
    }

    updateStep3(formData);
    setLocation("/register/step4");
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
                onClick={() => setLocation("/register/step2")}
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
                Step 3 of 4
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}>
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
                WhatsApp Number *
              </Label>
              <div className="flex items-center gap-2 mt-2 mb-1">
                <Checkbox 
                  id="sameAsContact" 
                  checked={sameAsContact}
                  onCheckedChange={(checked) => {
                    setSameAsContact(checked as boolean);
                    if (checked) {
                      setFormData({ ...formData, whatsappNumber: formData.studentContact });
                      setErrors({ ...errors, whatsappNumber: "" });
                    }
                  }}
                />
                <label
                  htmlFor="sameAsContact"
                  className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm cursor-pointer"
                >
                  Same as contact number
                </label>
              </div>
              <Input
                id="whatsappNumber"
                type="tel"
                placeholder="Enter 10-digit WhatsApp number"
                value={formData.whatsappNumber}
                onChange={(e) => handleWhatsappNumberChange(e.target.value)}
                className={`mt-1 ${errors.whatsappNumber ? 'border-red-500' : ''}`}
                maxLength={10}
                disabled={sameAsContact}
                required
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
                  <SelectItem value="below-1lakh">Below ₹1 Lakh</SelectItem>
                  <SelectItem value="1-2lakh">₹1-2 Lakhs</SelectItem>
                  <SelectItem value="2-3lakh">₹2-3 Lakhs</SelectItem>
                  <SelectItem value="3-4lakh">₹3-4 Lakhs</SelectItem>
                  <SelectItem value="4-5lakh">₹4-5 Lakhs</SelectItem>
                  <SelectItem value="above-5lakh">Above ₹5 Lakhs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base mt-6"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
