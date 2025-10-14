import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { ChevronLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRegistration } from "@/contexts/RegistrationContext";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import { PopupCylinderPicker } from "@/components/PopupCylinderPicker";
import { indianStates, getDistrictsForState, getCitiesForDistrict } from "@shared/locationData";

export default function RegisterStep2() {
  const [, setLocation] = useLocation();
  const { registrationData, updateStep2 } = useRegistration();
  const [formData, setFormData] = useState(registrationData.step2);
  const [selectedState, setSelectedState] = useState(registrationData.step2.state);
  const [selectedDistrict, setSelectedDistrict] = useState(registrationData.step2.district);
  const [showCityInput, setShowCityInput] = useState(false);
  const [otherCityValue, setOtherCityValue] = useState("");
  const [errors, setErrors] = useState({ state: "", district: "", city: "" });
  useAndroidBackButton("/register/step1");

  useEffect(() => {
    setFormData(registrationData.step2);
    setSelectedState(registrationData.step2.state);
    setSelectedDistrict(registrationData.step2.district);
    
    // Check if current city is in the city options or if it's a custom "other" value
    if (registrationData.step2.state && registrationData.step2.district) {
      const cities = getCitiesForDistrict(registrationData.step2.state, registrationData.step2.district);
      const cityExists = cities.some(c => c.value === registrationData.step2.city);
      if (!cityExists && registrationData.step2.city) {
        setShowCityInput(true);
        setOtherCityValue(registrationData.step2.city);
      }
    }
  }, [registrationData.step2]);

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedDistrict("");
    setShowCityInput(false);
    setOtherCityValue("");
    setFormData({ ...formData, state: value, district: "", city: "" });
    setErrors({ ...errors, state: "", district: "", city: "" });
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setShowCityInput(false);
    setOtherCityValue("");
    setFormData({ ...formData, district: value, city: "" });
    setErrors({ ...errors, district: "", city: "" });
  };

  const handleCityChange = (value: string) => {
    if (value === "other") {
      setShowCityInput(true);
      setFormData({ ...formData, city: otherCityValue });
    } else {
      setShowCityInput(false);
      setOtherCityValue("");
      setFormData({ ...formData, city: value });
      setErrors({ ...errors, city: "" });
    }
  };

  const handleOtherCityChange = (value: string) => {
    setOtherCityValue(value);
    setFormData({ ...formData, city: value });
    if (value.trim()) {
      setErrors({ ...errors, city: "" });
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { state: "", district: "", city: "" };
    let hasError = false;

    if (!formData.state) {
      newErrors.state = "Please select a state";
      hasError = true;
    }

    if (!formData.district) {
      newErrors.district = "Please select a district";
      hasError = true;
    }

    if (!formData.city || (showCityInput && !formData.city.trim())) {
      newErrors.city = "Please select or enter a city";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    updateStep2(formData);
    setLocation("/register/step3");
  };

  return (
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-safe pb-4 px-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/register/step1")}
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
              <PopupCylinderPicker
                items={indianStates}
                value={selectedState}
                onChange={handleStateChange}
                label="State *"
              />
              {errors.state && (
                <p className="font-['Inter',Helvetica] font-normal text-red-500 text-xs mt-1">
                  {errors.state}
                </p>
              )}
            </div>

            <div>
              <PopupCylinderPicker
                items={getDistrictsForState(selectedState)}
                value={selectedDistrict}
                onChange={handleDistrictChange}
                label="District *"
                disabled={!selectedState}
              />
              {errors.district ? (
                <p className="font-['Inter',Helvetica] font-normal text-red-500 text-xs mt-1">
                  {errors.district}
                </p>
              ) : !selectedState ? (
                <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                  Please select a state first
                </p>
              ) : null}
            </div>

            <div>
              <PopupCylinderPicker
                items={getCitiesForDistrict(selectedState, selectedDistrict)}
                value={showCityInput ? "other" : formData.city}
                onChange={handleCityChange}
                label="City *"
                disabled={!selectedDistrict}
              />
              {errors.city ? (
                <p className="font-['Inter',Helvetica] font-normal text-red-500 text-xs mt-1">
                  {errors.city}
                </p>
              ) : !selectedDistrict ? (
                <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                  Please select a district first
                </p>
              ) : null}
              {showCityInput && (
                <div className="mt-2">
                  <Input
                    id="otherCity"
                    placeholder="Enter city name"
                    value={otherCityValue}
                    onChange={(e) => handleOtherCityChange(e.target.value)}
                    className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}
                    required
                    data-testid="input-other-city"
                  />
                </div>
              )}
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
                data-testid="input-pincode"
              />
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
