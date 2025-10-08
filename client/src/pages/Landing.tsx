import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#faf9fb] flex flex-col">
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        {/* Header Badge */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[10px] px-4 py-2 mb-8 inline-block">
            <span className="font-['Inter',Helvetica] font-normal text-[#1d2838] text-xs">
              Infosys X AspireForHer
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center">
          <h1 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-2xl text-center mb-4 leading-8">
            Build your skills and land a good placement by this
            career transformation program powered by
            Infosys and AspireForHer.
          </h1>

          {/* CTA Buttons */}
          <div className="w-full space-y-3 mb-12">
            <Button
              onClick={() => setLocation("/register/step1")}
              className="w-full h-12 bg-[#6d10b0] hover:bg-[#5a0d94] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base"
            >
              Start Your Journey
            </Button>
            
            <Button
              onClick={() => setLocation("/login")}
              variant="outline"
              className="w-full h-12 border-[#6d10b0] text-[#6d10b0] hover:bg-[#6d10b0]/5 rounded-lg font-['Inter',Helvetica] font-medium text-base"
            >
              Already Registered? Login
            </Button>
          </div>

          {/* Stats */}
          <div className="w-full grid grid-cols-3 gap-4 mb-12">
            <div className="text-center">
              <div className="font-['Inter',Helvetica] font-bold text-[#6d10b0] text-2xl">95%</div>
              <div className="font-['Inter',Helvetica] font-normal text-[#495565] text-xs mt-1">
                Placement Rate
              </div>
            </div>
            <div className="text-center">
              <div className="font-['Inter',Helvetica] font-bold text-[#6d10b0] text-2xl">10K+</div>
              <div className="font-['Inter',Helvetica] font-normal text-[#495565] text-xs mt-1">
                Students Trained
              </div>
            </div>
            <div className="text-center">
              <div className="font-['Inter',Helvetica] font-bold text-[#6d10b0] text-2xl">500+</div>
              <div className="font-['Inter',Helvetica] font-normal text-[#495565] text-xs mt-1">
                Partner Companies
              </div>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="w-full">
            <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-xl text-center mb-6">
              What You'll Get
            </h2>
            
            <div className="space-y-4">
              <Card className="border-[#0000001a]">
                <CardContent className="p-4">
                  <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base mb-1">
                    Industry-Ready Training
                  </h3>
                  <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                    60+ hours of practical digital marketing skills
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#0000001a]">
                <CardContent className="p-4">
                  <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base mb-1">
                    Certified Programs
                  </h3>
                  <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                    Get recognized certificates from industry leaders
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#0000001a]">
                <CardContent className="p-4">
                  <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base mb-1">
                    Job Placement Support
                  </h3>
                  <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                    Direct placement with 500+ partner companies
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trusted by */}
          <div className="w-full mt-8 text-center">
            <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
              Trusted by students from
            </p>
            <p className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-sm mt-1">
              IITs • NITs • Other Prestigious Universities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
