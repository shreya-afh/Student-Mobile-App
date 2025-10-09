import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { ChevronLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRegistration } from "@/contexts/RegistrationContext";
import { InlineCylinderPicker } from "@/components/InlineCylinderPicker";

export default function RegisterStep1() {
  const [, setLocation] = useLocation();
  const { registrationData, updateStep1 } = useRegistration();
  const [formData, setFormData] = useState(registrationData.step1);

  useEffect(() => {
    setFormData(registrationData.step1);
  }, [registrationData.step1]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.dateOfBirth.day || !formData.dateOfBirth.month || !formData.dateOfBirth.year) {
      alert("Please select your complete date of birth");
      return;
    }
    
    updateStep1(formData);
    setLocation("/register/step2");
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
              onClick={() => setLocation("/")}
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
              Step 1 of 4
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
            Personal Information
          </h1>

          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Full Name *
              </Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm mb-2 block">
                Gender *
              </Label>
              <div className="flex gap-3">
                {["Male", "Female", "Other"].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender })}
                    className={`flex-1 h-10 rounded-lg border font-['Inter',Helvetica] font-normal text-sm transition-colors ${
                      formData.gender === gender
                        ? "border-[#6d10b0] bg-[#6d10b0]/5 text-[#6d10b0]"
                        : "border-[#0000001a] text-[#495565]"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="guardianName" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Guardian's Name *
              </Label>
              <Input
                id="guardianName"
                placeholder="Enter guardian's name"
                value={formData.guardianName}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="guardianOccupation" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Guardian's Occupation *
              </Label>
              <Input
                id="guardianOccupation"
                placeholder="Enter guardian's occupation"
                value={formData.guardianOccupation}
                onChange={(e) => setFormData({ ...formData, guardianOccupation: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm mb-3 block">
                Date of Birth *
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <InlineCylinderPicker
                  items={Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))}
                  value={formData.dateOfBirth.day}
                  onChange={(day) => setFormData({ ...formData, dateOfBirth: { ...formData.dateOfBirth, day } })}
                  label="Day"
                />
                <InlineCylinderPicker
                  items={[
                    { value: '01', label: 'Jan' },
                    { value: '02', label: 'Feb' },
                    { value: '03', label: 'Mar' },
                    { value: '04', label: 'Apr' },
                    { value: '05', label: 'May' },
                    { value: '06', label: 'Jun' },
                    { value: '07', label: 'Jul' },
                    { value: '08', label: 'Aug' },
                    { value: '09', label: 'Sep' },
                    { value: '10', label: 'Oct' },
                    { value: '11', label: 'Nov' },
                    { value: '12', label: 'Dec' },
                  ]}
                  value={formData.dateOfBirth.month}
                  onChange={(month) => setFormData({ ...formData, dateOfBirth: { ...formData.dateOfBirth, month } })}
                  label="Month"
                />
                <InlineCylinderPicker
                  items={Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i))}
                  value={formData.dateOfBirth.year}
                  onChange={(year) => setFormData({ ...formData, dateOfBirth: { ...formData.dateOfBirth, year } })}
                  label="Year"
                />
              </div>
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
