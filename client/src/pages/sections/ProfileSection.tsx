import { ChevronLeftIcon, UserIcon } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ProfileSection = (): JSX.Element => {
  return (
    <header className="flex flex-col items-start pt-4 pb-0 px-4 w-full bg-white border-b border-gray-200">
      <div className="text-center mb-3 w-full">
        <p className="[font-family:'Inter',Helvetica] font-medium text-[#697282] text-xs tracking-wide">
          INFOSYS × ASPIREFORHER
        </p>
      </div>
      <div className="flex h-8 items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-9 p-0 hover:bg-gray-100"
          >
            <ChevronLeftIcon className="w-6 h-6 text-[#495565]" />
          </Button>

          <div className="flex h-6 items-center gap-2">
            <UserIcon className="w-5 h-5 text-[#5C4C7D]" />
            <span className="[font-family:'Inter',Helvetica] font-normal text-[#1d2838] text-base tracking-[-0.31px] leading-6 whitespace-nowrap">
              My Profile
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
