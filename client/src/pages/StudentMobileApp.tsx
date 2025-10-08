import React from "react";
import { InformationSection } from "./sections/InformationSection";
import { ProfileSection } from "./sections/ProfileSection";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useLocation } from "wouter";

export const StudentMobileApp = (): JSX.Element => {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#faf9fb]">
      <header className="bg-[linear-gradient(90deg,rgba(218,178,255,1)_0%,rgba(196,180,255,1)_100%)] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard")}
              className="h-8 w-9 p-0 hover:bg-transparent"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#6d10b0]" />
            </Button>
            <h1 className="font-['Inter',Helvetica] font-semibold text-[#6d10b0] text-lg">
              My Profile
            </h1>
          </div>
          <div className="bg-[#ffffffe6] rounded-[10px] px-3 py-1.5">
            <span className="font-['Inter',Helvetica] font-normal text-[#1d2838] text-xs">
              Infosys X AspireForHer
            </span>
          </div>
        </div>
      </header>
      <InformationSection />
    </div>
  );
};
