import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ phone: formData.phone });
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#faf9fb] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
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
              className="h-6 object-contain"
            />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="h-8 w-9 p-0 hover:bg-gray-100"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#495565]" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto">
          <h1 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-2xl mb-6">
            Welcome Back
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="phone" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your mobile number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base mt-6"
            >
              Login
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setLocation("/register/step1")}
              className="font-['Inter',Helvetica] font-normal text-[#5C4C7D] text-sm hover:underline"
            >
              Don't have an account? Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
