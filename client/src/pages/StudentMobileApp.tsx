import React from "react";
import { InformationSection } from "./sections/InformationSection";
import { ProfileSection } from "./sections/ProfileSection";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useLocation } from "wouter";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";

export const StudentMobileApp = (): JSX.Element => {
  const [, setLocation] = useLocation();
  useAndroidBackButton("/dashboard");

  return (
    <div className="flex flex-col w-full h-screen bg-[#faf9fb] overflow-hidden">
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
              onClick={() => setLocation("/dashboard")}
              className="h-10 w-10 p-0 hover:bg-gray-100 relative z-10 -ml-2"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#495565]" />
            </Button>
            <h1 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-lg">
              My Profile
            </h1>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <InformationSection />
      </div>
    </div>
  );
};
