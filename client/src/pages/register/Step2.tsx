import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { ChevronLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRegistration } from "@/contexts/RegistrationContext";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import { indianStates, getDistrictsForState, getCitiesForDistrict } from "@shared/locationData";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";

export default function RegisterStep2() {
  const [, setLocation] = useLocation();
  const { registrationData, updateStep2 } = useRegistration();
  const [formData, setFormData] = useState(registrationData.step2);
  const [selectedState, setSelectedState] = useState(registrationData.step2.state);
  const [selectedDistrict, setSelectedDistrict] = useState(registrationData.step2.district);
  const [showCityInput, setShowCityInput] = useState(false);
  const [otherCityValue, setOtherCityValue] = useState("");
  const [errors, setErrors] = useState({ state: "", district: "", city: "", startYear: "", endYear: "", pincode: "" });
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

    const newErrors = { state: "", district: "", city: "", startYear: "", endYear: "", pincode: "" };
    let hasError = false;

    // Validate start year (must be in the past)
    const currentYear = new Date().getFullYear();
    const startYear = parseInt(formData.startYear);
    const endYear = parseInt(formData.endYear);

    if (!formData.startYear || isNaN(startYear)) {
      newErrors.startYear = "Please enter a valid start year";
      hasError = true;
    } else if (startYear > currentYear) {
      newErrors.startYear = "Start year must be in the past";
      hasError = true;
    }

    // Validate end year (must be >= start year)
    if (!formData.endYear || isNaN(endYear)) {
      newErrors.endYear = "Please enter a valid end year";
      hasError = true;
    } else if (endYear < startYear) {
      newErrors.endYear = "End year must be greater than or equal to start year";
      hasError = true;
    }

    // Validate pincode (must be 6 digits)
    if (!formData.pincode) {
      newErrors.pincode = "Please enter pincode";
      hasError = true;
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
      hasError = true;
    }

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
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}>
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
              <Select
                value={formData.collegeName}
                onValueChange={(value) => setFormData({ ...formData, collegeName: value })}
              >
                <SelectTrigger className="mt-1" data-testid="select-college">
                  <SelectValue placeholder="Select your college" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annasaheb Dange College of Engineering & Technology, Ashta" data-testid="college-adcet">
                    Annasaheb Dange College of Engineering & Technology, Ashta
                  </SelectItem>
                  <SelectItem value="Ashokrao Mane Group of Institutions" data-testid="college-amgi">
                    Ashokrao Mane Group of Institutions
                  </SelectItem>
                  <SelectItem value="Don Bosco Institute of Technology" data-testid="college-dbit">
                    Don Bosco Institute of Technology
                  </SelectItem>
                  <SelectItem value="SKN SINHGAD COLLEGE OF ENGINEERING" data-testid="college-skn">
                    SKN SINHGAD COLLEGE OF ENGINEERING
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="course" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Course *
              </Label>
              <Select
                value={formData.course}
                onValueChange={(value) => setFormData({ ...formData, course: value })}
              >
                <SelectTrigger className="mt-1" data-testid="select-course">
                  <SelectValue placeholder="Select your course" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <div className="px-2 py-1.5 text-xs font-semibold text-[#6d10b0] bg-[#f3e8ff] pointer-events-none">Undergraduate (UG) Courses</div>
                  <SelectItem value="BBA">BBA</SelectItem>
                  <SelectItem value="BCom">BCom</SelectItem>
                  <SelectItem value="BCom (Hons)">BCom (Hons)</SelectItem>
                  <SelectItem value="BMS">BMS</SelectItem>
                  <SelectItem value="BBM">BBM</SelectItem>
                  <SelectItem value="BFIA">BFIA</SelectItem>
                  <SelectItem value="BSc (General)">BSc (General)</SelectItem>
                  <SelectItem value="BSc (Hons) – Physics">BSc (Hons) – Physics</SelectItem>
                  <SelectItem value="BSc (Hons) – Chemistry">BSc (Hons) – Chemistry</SelectItem>
                  <SelectItem value="BSc (Hons) – Biology">BSc (Hons) – Biology</SelectItem>
                  <SelectItem value="BSc (Hons) – Mathematics">BSc (Hons) – Mathematics</SelectItem>
                  <SelectItem value="BSc (Hons) – Computer Science">BSc (Hons) – Computer Science</SelectItem>
                  <SelectItem value="BSc (Hons) – Biotechnology">BSc (Hons) – Biotechnology</SelectItem>
                  <SelectItem value="BSc (Hons) – Environmental Science">BSc (Hons) – Environmental Science</SelectItem>
                  <SelectItem value="BTech / BE">BTech / BE</SelectItem>
                  <SelectItem value="BCA">BCA</SelectItem>
                  <SelectItem value="BSc Nursing">BSc Nursing</SelectItem>
                  <SelectItem value="BA">BA</SelectItem>
                  <SelectItem value="BA (Hons) – English">BA (Hons) – English</SelectItem>
                  <SelectItem value="BA (Hons) – History">BA (Hons) – History</SelectItem>
                  <SelectItem value="BA (Hons) – Political Science">BA (Hons) – Political Science</SelectItem>
                  <SelectItem value="BA (Hons) – Sociology">BA (Hons) – Sociology</SelectItem>
                  <SelectItem value="BA (Hons) – Psychology">BA (Hons) – Psychology</SelectItem>
                  <SelectItem value="BFA">BFA</SelectItem>
                  <SelectItem value="BDes">BDes</SelectItem>
                  <SelectItem value="LLB (3-yr)">LLB (3-yr)</SelectItem>
                  <SelectItem value="BA LLB (5-yr integrated)">BA LLB (5-yr integrated)</SelectItem>
                  <SelectItem value="BBA LLB (5-yr integrated)">BBA LLB (5-yr integrated)</SelectItem>
                  <SelectItem value="MBBS">MBBS</SelectItem>
                  <SelectItem value="BDS">BDS</SelectItem>
                  <SelectItem value="BAMS">BAMS</SelectItem>
                  <SelectItem value="BHMS">BHMS</SelectItem>
                  <SelectItem value="BPT">BPT</SelectItem>
                  <SelectItem value="BPharm">BPharm</SelectItem>
                  <SelectItem value="BEd">BEd</SelectItem>
                  <SelectItem value="BA BEd (Integrated)">BA BEd (Integrated)</SelectItem>
                  <SelectItem value="BSc BEd (Integrated)">BSc BEd (Integrated)</SelectItem>
                  <SelectItem value="BHM (Hotel Management)">BHM (Hotel Management)</SelectItem>
                  <SelectItem value="BFTech (Fashion Technology)">BFTech (Fashion Technology)</SelectItem>
                  <SelectItem value="BSc Animation">BSc Animation</SelectItem>
                  <SelectItem value="BJMC (Mass Communication & Journalism)">BJMC (Mass Communication & Journalism)</SelectItem>
                  <SelectItem value="BSc Aviation">BSc Aviation</SelectItem>
                  <SelectItem value="BSc Agriculture">BSc Agriculture</SelectItem>
                  <SelectItem value="BSc Horticulture">BSc Horticulture</SelectItem>
                  <SelectItem value="BSc Forestry">BSc Forestry</SelectItem>
                  <SelectItem value="BVSc">BVSc</SelectItem>
                  
                  <div className="px-2 py-1.5 text-xs font-semibold text-[#6d10b0] bg-[#f3e8ff] pointer-events-none mt-1">Postgraduate (PG) Courses</div>
                  <SelectItem value="MBA">MBA</SelectItem>
                  <SelectItem value="MCom">MCom</SelectItem>
                  <SelectItem value="PGDM">PGDM</SelectItem>
                  <SelectItem value="MSc (Physics)">MSc (Physics)</SelectItem>
                  <SelectItem value="MSc (Chemistry)">MSc (Chemistry)</SelectItem>
                  <SelectItem value="MSc (Biology)">MSc (Biology)</SelectItem>
                  <SelectItem value="MSc (Mathematics)">MSc (Mathematics)</SelectItem>
                  <SelectItem value="MSc (Computer Science)">MSc (Computer Science)</SelectItem>
                  <SelectItem value="MSc (Biotechnology)">MSc (Biotechnology)</SelectItem>
                  <SelectItem value="MSc (Environmental Science)">MSc (Environmental Science)</SelectItem>
                  <SelectItem value="MTech / ME">MTech / ME</SelectItem>
                  <SelectItem value="MCA">MCA</SelectItem>
                  <SelectItem value="MPhil">MPhil</SelectItem>
                  <SelectItem value="MA (English)">MA (English)</SelectItem>
                  <SelectItem value="MA (History)">MA (History)</SelectItem>
                  <SelectItem value="MA (Political Science)">MA (Political Science)</SelectItem>
                  <SelectItem value="MA (Sociology)">MA (Sociology)</SelectItem>
                  <SelectItem value="MA (Psychology)">MA (Psychology)</SelectItem>
                  <SelectItem value="MFA">MFA</SelectItem>
                  <SelectItem value="MDes">MDes</SelectItem>
                  <SelectItem value="LLM">LLM</SelectItem>
                  <SelectItem value="MD">MD</SelectItem>
                  <SelectItem value="MS">MS</SelectItem>
                  <SelectItem value="MDS">MDS</SelectItem>
                  <SelectItem value="MPharm">MPharm</SelectItem>
                  <SelectItem value="MPT">MPT</SelectItem>
                  <SelectItem value="MPH">MPH</SelectItem>
                  <SelectItem value="MEd">MEd</SelectItem>
                  <SelectItem value="MJMC">MJMC</SelectItem>
                  <SelectItem value="MHM (Hotel Management)">MHM (Hotel Management)</SelectItem>
                  <SelectItem value="MVSc">MVSc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startYear" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                  Start Year *
                </Label>
                <Input
                  id="startYear"
                  type="number"
                  placeholder="2023"
                  value={formData.startYear}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setFormData({ ...formData, startYear: value });
                    setErrors({ ...errors, startYear: "", endYear: "" });
                  }}
                  className={`mt-1 ${errors.startYear ? 'border-red-500' : ''}`}
                  maxLength={4}
                  required
                />
                {errors.startYear && (
                  <p className="font-['Inter',Helvetica] font-normal text-red-500 text-xs mt-1">
                    {errors.startYear}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="endYear" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                  End Year *
                </Label>
                <Input
                  id="endYear"
                  type="number"
                  placeholder="2027"
                  value={formData.endYear}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setFormData({ ...formData, endYear: value });
                    setErrors({ ...errors, endYear: "" });
                  }}
                  className={`mt-1 ${errors.endYear ? 'border-red-500' : ''}`}
                  maxLength={4}
                  required
                />
                {errors.endYear && (
                  <p className="font-['Inter',Helvetica] font-normal text-red-500 text-xs mt-1">
                    {errors.endYear}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="state" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                State *
              </Label>
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((state) => (
                    <SelectItem key={typeof state === 'string' ? state : state.value} value={typeof state === 'string' ? state : state.value}>
                      {typeof state === 'string' ? state : state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="font-['Inter',Helvetica] font-normal text-red-500 text-xs mt-1">
                  {errors.state}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="district" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                District *
              </Label>
              <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedState}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={!selectedState ? "Select state first" : "Select district"} />
                </SelectTrigger>
                <SelectContent>
                  {getDistrictsForState(selectedState).map((district) => (
                    <SelectItem key={typeof district === 'string' ? district : district.value} value={typeof district === 'string' ? district : district.value}>
                      {typeof district === 'string' ? district : district.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="city" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                City *
              </Label>
              <Select value={showCityInput ? "other" : formData.city} onValueChange={handleCityChange} disabled={!selectedDistrict}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={!selectedDistrict ? "Select district first" : "Select city"} />
                </SelectTrigger>
                <SelectContent>
                  {getCitiesForDistrict(selectedState, selectedDistrict).map((city) => (
                    <SelectItem key={typeof city === 'string' ? city : city.value} value={typeof city === 'string' ? city : city.value}>
                      {typeof city === 'string' ? city : city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                type="tel"
                placeholder="Enter 6-digit pincode"
                value={formData.pincode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setFormData({ ...formData, pincode: value });
                  setErrors({ ...errors, pincode: "" });
                }}
                className={`mt-1 ${errors.pincode ? 'border-red-500' : ''}`}
                maxLength={6}
                required
                data-testid="input-pincode"
              />
              {errors.pincode && (
                <p className="font-['Inter',Helvetica] font-normal text-red-500 text-xs mt-1">
                  {errors.pincode}
                </p>
              )}
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
