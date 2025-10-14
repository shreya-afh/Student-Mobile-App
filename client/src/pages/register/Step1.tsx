import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { ChevronLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRegistration } from "@/contexts/RegistrationContext";
import { PopupCylinderPicker } from "@/components/PopupCylinderPicker";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";

export default function RegisterStep1() {
  const [, setLocation] = useLocation();
  const { registrationData, updateStep1 } = useRegistration();
  const [formData, setFormData] = useState(registrationData.step1);
  useAndroidBackButton("/");

  useEffect(() => {
    setFormData(registrationData.step1);
  }, [registrationData.step1]);

  // Calculate days in month based on selected month and year
  const getDaysInMonth = (month: string, year: string): number => {
    if (!month || !year) return 31;
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    return new Date(yearNum, monthNum, 0).getDate();
  };

  const daysInSelectedMonth = getDaysInMonth(formData.dateOfBirth.month, formData.dateOfBirth.year);

  // Auto-adjust day if it exceeds the maximum for the selected month
  useEffect(() => {
    if (formData.dateOfBirth.day && parseInt(formData.dateOfBirth.day) > daysInSelectedMonth) {
      setFormData({
        ...formData,
        dateOfBirth: {
          ...formData.dateOfBirth,
          day: String(daysInSelectedMonth).padStart(2, '0')
        }
      });
    }
  }, [formData.dateOfBirth.month, formData.dateOfBirth.year, daysInSelectedMonth]);

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
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-safe pb-4 px-4 flex-shrink-0">
        <div className="text-center mb-3">
          <p className="font-['Inter',Helvetica] font-medium text-[#697282] text-xs tracking-wide">
            INFOSYS × ASPIREFORHER
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
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
              Step 1 of 4
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
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
                        ? "border-[#5C4C7D] bg-[#5C4C7D]/5 text-[#5C4C7D]"
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
                <PopupCylinderPicker
                  items={Array.from({ length: daysInSelectedMonth }, (_, i) => String(i + 1).padStart(2, '0'))}
                  value={formData.dateOfBirth.day}
                  onChange={(day) => setFormData({ ...formData, dateOfBirth: { ...formData.dateOfBirth, day } })}
                  label="Day"
                />
                <PopupCylinderPicker
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
                <PopupCylinderPicker
                  items={Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i))}
                  value={formData.dateOfBirth.year}
                  onChange={(year) => setFormData({ ...formData, dateOfBirth: { ...formData.dateOfBirth, year } })}
                  label="Year"
                />
              </div>
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
