import React from "react";
import { InformationSection } from "./sections/InformationSection";
import { ProfileSection } from "./sections/ProfileSection";

export const StudentMobileApp = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full bg-[#faf9fb]">
      <ProfileSection />
      <InformationSection />
    </div>
  );
};
