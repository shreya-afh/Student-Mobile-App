import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { GraduationCap, Award, Briefcase, TrendingUp, Users, Building2 } from "lucide-react";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf9fb] to-white">
      {/* Header with Logos */}
      <div className="w-full bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <img 
              src={infosysLogo} 
              alt="Infosys Foundation" 
              className="h-12 object-contain"
              data-testid="logo-infosys"
            />
            <div className="text-2xl font-bold text-gray-400">×</div>
            <img 
              src={aspireForHerLogo} 
              alt="AspireForHer" 
              className="h-12 object-contain"
              data-testid="logo-aspireforher"
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-2 rounded-full mb-6">
            <span className="text-sm font-semibold bg-gradient-to-r from-[#0075C9] to-[#6d10b0] bg-clip-text text-transparent">
              Career Transformation Program
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#1d2838] mb-6 leading-tight">
            Build Your Skills,<br />
            <span className="bg-gradient-to-r from-[#0075C9] to-[#6d10b0] bg-clip-text text-transparent">
              Land Your Dream Job
            </span>
          </h1>
          
          <p className="text-lg text-[#495565] max-w-2xl mx-auto mb-8 leading-relaxed">
            Join a transformative career program powered by Infosys Foundation and AspireForHer. 
            Get industry-ready training, certifications, and direct placement opportunities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-16">
            <Button
              onClick={() => setLocation("/register/step1")}
              className="h-14 px-8 bg-gradient-to-r from-[#0075C9] to-[#6d10b0] hover:opacity-90 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all"
              data-testid="button-start-journey"
            >
              Start Your Journey
            </Button>
            
            <Button
              onClick={() => setLocation("/login")}
              variant="outline"
              className="h-14 px-8 border-2 border-[#6d10b0] text-[#6d10b0] hover:bg-[#6d10b0]/10 rounded-xl font-semibold text-base transition-all"
              data-testid="button-login"
            >
              Already Registered? Login
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                  <TrendingUp className="w-6 h-6 text-[#0075C9]" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#0075C9] to-[#6d10b0] bg-clip-text text-transparent mb-2" data-testid="stat-placement-rate">
                  95%
                </div>
                <div className="text-sm font-medium text-[#495565]">
                  Placement Rate
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-white hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                  <Users className="w-6 h-6 text-[#6d10b0]" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#0075C9] to-[#6d10b0] bg-clip-text text-transparent mb-2" data-testid="stat-students-trained">
                  10K+
                </div>
                <div className="text-sm font-medium text-[#495565]">
                  Students Trained
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-pink-50 to-white hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 mb-4">
                  <Building2 className="w-6 h-6 text-[#E91E63]" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#0075C9] to-[#6d10b0] bg-clip-text text-transparent mb-2" data-testid="stat-partner-companies">
                  500+
                </div>
                <div className="text-sm font-medium text-[#495565]">
                  Partner Companies
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What You'll Get Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1d2838] text-center mb-10">
            What You'll Get
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-md hover:shadow-xl transition-all bg-white group">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7 text-[#0075C9]" />
                </div>
                <h3 className="text-xl font-bold text-[#1d2838] mb-3">
                  Industry-Ready Training
                </h3>
                <p className="text-[#495565] leading-relaxed">
                  60+ hours of practical digital marketing skills designed by industry experts
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-xl transition-all bg-white group">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7 text-[#6d10b0]" />
                </div>
                <h3 className="text-xl font-bold text-[#1d2838] mb-3">
                  Certified Programs
                </h3>
                <p className="text-[#495565] leading-relaxed">
                  Get recognized certificates from Infosys Foundation and industry leaders
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-xl transition-all bg-white group">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-7 h-7 text-[#E91E63]" />
                </div>
                <h3 className="text-xl font-bold text-[#1d2838] mb-3">
                  Job Placement Support
                </h3>
                <p className="text-[#495565] leading-relaxed">
                  Direct placement assistance with 500+ partner companies across industries
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl py-8 px-6">
          <p className="text-sm font-medium text-[#495565] mb-2">
            Trusted by students from
          </p>
          <p className="text-lg font-bold text-[#1d2838]">
            IITs • NITs • Top Universities Across India
          </p>
        </div>
      </div>
    </div>
  );
}
