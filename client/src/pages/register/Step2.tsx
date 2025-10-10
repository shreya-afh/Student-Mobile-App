import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { ChevronLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRegistration } from "@/contexts/RegistrationContext";

export default function RegisterStep2() {
  const [, setLocation] = useLocation();
  const { registrationData, updateStep2 } = useRegistration();
  const [formData, setFormData] = useState(registrationData.step2);

  useEffect(() => {
    setFormData(registrationData.step2);
  }, [registrationData.step2]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    updateStep2(formData);
    setLocation("/register/step3");
  };

  return (
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[linear-gradient(90deg,rgba(218,178,255,1)_0%,rgba(196,180,255,1)_100%)] p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/register/step1")}
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
              Step 2 of 4
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
          <h1 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-xl mb-2">
            College & Education Details
          </h1>
          <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-6">
            Please provide your college and course information
          </p>

          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <Label htmlFor="collegeName" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                College Name *
              </Label>
              <Input
                id="collegeName"
                placeholder="Enter college name"
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="course" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Course *
              </Label>
              <Input
                id="course"
                placeholder="Enter course name"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startYear" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                  Start Year *
                </Label>
                <Input
                  id="startYear"
                  placeholder="2023"
                  value={formData.startYear}
                  onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="endYear" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                  End Year *
                </Label>
                <Input
                  id="endYear"
                  placeholder="2027"
                  value={formData.endYear}
                  onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="city" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                City *
              </Label>
              <Input
                id="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="district" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                District *
              </Label>
              <Input
                id="district"
                placeholder="Enter district"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="state" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                State *
              </Label>
              <Input
                id="state"
                placeholder="Enter state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="pincode" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Pincode *
              </Label>
              <Input
                id="pincode"
                placeholder="Enter pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="mt-1"
                maxLength={6}
                required
              />
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
