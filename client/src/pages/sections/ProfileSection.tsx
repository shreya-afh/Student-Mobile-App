import { ChevronLeftIcon, UserIcon } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ProfileSection = (): JSX.Element => {
  return (
    <header className="flex flex-col items-start pt-4 pb-0 px-4 w-full bg-[#5C4C7D]">
      <div className="flex h-8 items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-9 p-0 hover:bg-transparent"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </Button>

          <div className="flex h-6 items-center gap-2">
            <UserIcon className="w-5 h-5 text-white" />
            <span className="[font-family:'Inter',Helvetica] font-normal text-white text-base tracking-[-0.31px] leading-6 whitespace-nowrap">
              My Profile
            </span>
          </div>
        </div>

        <Badge
          variant="secondary"
          className="h-8 px-2 pt-[10.5px] pb-0 bg-[#ffffffe6] hover:bg-[#ffffffe6] rounded-[10px]"
        >
          <span className="[font-family:'Inter',Helvetica] font-normal text-[#1d2838] text-xs tracking-[0] leading-4 whitespace-nowrap">
            Infosys X AspireForHer
          </span>
        </Badge>
      </div>
    </header>
  );
};
