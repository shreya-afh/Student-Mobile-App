import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";
import { ArrowRight, Users, Building2, TrendingUp } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf9fb] via-white to-[#f3e8ff]">
      {/* Header with Logos */}
      <div className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <img 
              src={infosysLogo} 
              alt="Infosys Foundation" 
              className="h-16 object-contain"
              data-testid="logo-infosys"
            />
            <div className="text-xl font-bold text-gray-300">×</div>
            <img 
              src={aspireForHerLogo} 
              alt="AspireForHer" 
              className="h-16 object-contain"
              data-testid="logo-aspireforher"
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#5C4C7D]/10 text-[#5C4C7D] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Empowering Women in Tech
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#1d2838] mb-4 leading-tight">
            Career Transformation
            <br />
            <span className="bg-gradient-to-r from-[#5C4C7D] to-[#8B7BA8] bg-clip-text text-transparent">
              Program
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-[#495565] max-w-2xl mx-auto mb-10">
            Join thousands of women advancing their careers through industry-leading skills training and placement opportunities
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-16">
            <Button
              onClick={() => setLocation("/register/step1")}
              className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-[#5C4C7D] to-[#6d10b0] hover:from-[#4C3C6D] hover:to-[#5C0C9D] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#5C4C7D]/30 hover:shadow-xl hover:shadow-[#5C4C7D]/40 group"
              data-testid="button-start-journey"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              onClick={() => setLocation("/login")}
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 border-2 border-[#5C4C7D] text-[#5C4C7D] hover:bg-[#5C4C7D] hover:text-white rounded-xl font-semibold transition-all"
              data-testid="button-login"
            >
              Login
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5C4C7D] to-[#8B7BA8] flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#5C4C7D] to-[#8B7BA8] bg-clip-text text-transparent" data-testid="stat-placement-rate">
                  95%
                </div>
                <div className="text-sm text-[#495565] font-medium">Placement Rate</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5C4C7D] to-[#8B7BA8] flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#5C4C7D] to-[#8B7BA8] bg-clip-text text-transparent" data-testid="stat-students-trained">
                  10K+
                </div>
                <div className="text-sm text-[#495565] font-medium">Students Trained</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5C4C7D] to-[#8B7BA8] flex items-center justify-center mb-2">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#5C4C7D] to-[#8B7BA8] bg-clip-text text-transparent" data-testid="stat-partner-companies">
                  500+
                </div>
                <div className="text-sm text-[#495565] font-medium">Partner Companies</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
