import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#faf9fb] flex flex-col">
      {/* Header */}
      <header className="bg-[linear-gradient(90deg,rgba(218,178,255,1)_0%,rgba(196,180,255,1)_100%)] p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            className="h-8 w-9 p-0 hover:bg-transparent"
          >
            <ChevronLeftIcon className="w-6 h-6 text-[#6d10b0]" />
          </Button>
          <div className="bg-[#ffffffe6] rounded-[10px] px-3 py-1.5">
            <span className="font-['Inter',Helvetica] font-normal text-[#1d2838] text-xs">
              Infosys X AspireForHer
            </span>
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
              className="w-full h-12 bg-[#6d10b0] hover:bg-[#5a0d94] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base mt-6"
            >
              Login
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setLocation("/register/step1")}
              className="font-['Inter',Helvetica] font-normal text-[#6d10b0] text-sm hover:underline"
            >
              Don't have an account? Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
