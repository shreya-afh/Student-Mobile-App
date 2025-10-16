import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#faf9fb]">
      {/* Header with Logos */}
      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4 pt-12">
          <div className="flex items-center justify-center gap-3">
            <img 
              src={infosysLogo} 
              alt="Infosys Foundation" 
              className="h-20 object-contain"
              data-testid="logo-infosys"
            />
            <div className="text-2xl font-bold text-gray-400">×</div>
            <img 
              src={aspireForHerLogo} 
              alt="AspireForHer" 
              className="h-20 object-contain"
              data-testid="logo-aspireforher"
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-2xl mx-auto px-4 pt-2 pb-8 flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
        <div className="text-center w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1d2838] mb-8 leading-tight">
            Career Transformation Program
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 max-w-sm mx-auto mb-12">
            <Button
              onClick={() => setLocation("/register/step1")}
              className="h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-semibold transition-all"
              data-testid="button-start-journey"
            >
              Start Your Journey
            </Button>
            
            <Button
              onClick={() => setLocation("/login")}
              variant="outline"
              className="h-12 border-2 border-[#5C4C7D] text-[#5C4C7D] hover:bg-[#5C4C7D]/10 rounded-lg font-semibold transition-all"
              data-testid="button-login"
            >
              Login
            </Button>
          </div>

          {/* Compact Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#5C4C7D]" data-testid="stat-placement-rate">95%</div>
              <div className="text-xs text-[#495565] mt-1">Placement</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#5C4C7D]" data-testid="stat-students-trained">10K+</div>
              <div className="text-xs text-[#495565] mt-1">Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#5C4C7D]" data-testid="stat-partner-companies">500+</div>
              <div className="text-xs text-[#495565] mt-1">Companies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
