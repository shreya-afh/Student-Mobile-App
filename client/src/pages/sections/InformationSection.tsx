import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const statsData = [
  { value: "1", label: "Courses Completed" },
  { value: "39", label: "Hours Learned" },
  { value: "2", label: "Certificates" },
  { value: "92%", label: "Attendance Rate" },
];

const personalInfoData = [
  {
    icon: "/figmaAssets/icon-3.svg",
    value: "Not provided",
    label: "Full Name",
  },
  {
    icon: "/figmaAssets/icon.svg",
    value: "Not provided",
    label: "Email Address",
  },
  {
    icon: "/figmaAssets/icon-1.svg",
    value: "Not provided",
    label: "Phone Number",
  },
  {
    icon: "/figmaAssets/icon-4.svg",
    value: "undefined, undefined",
    label: "Address",
  },
  {
    icon: "/figmaAssets/icon-6.svg",
    value: "undefined at undefined",
    label: "Education",
  },
];

const guardianInfoData = [
  { value: "Not provided", label: "Guardian Name" },
  { value: "Not provided", label: "Occupation" },
  { value: "Not provided", label: "Contact Number" },
];

const settingsMenuData = [
  {
    icon: "/figmaAssets/icon-5.svg",
    label: "Privacy & Security",
    textColor: "text-neutral-950",
  },
  {
    icon: "/figmaAssets/icon-7.svg",
    label: "App Settings",
    textColor: "text-neutral-950",
  },
  {
    icon: "/figmaAssets/icon-2.svg",
    label: "Help & Support",
    textColor: "text-neutral-950",
  },
  {
    icon: "/figmaAssets/icon-8.svg",
    label: "Logout",
    textColor: "text-[#e7000b]",
  },
];

export const InformationSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-start gap-6 p-4 w-full">
      <Card className="w-full border-[#0000001a]">
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0">
              <div className="flex w-16 h-16 items-center justify-center bg-[#dab2ff] rounded-full">
                <span className="[font-family:'Inter',Helvetica] font-normal text-[#6d10b0] text-xl tracking-[-0.45px] leading-7">
                  S
                </span>
              </div>
              <img
                className="absolute bottom-0 right-0 w-6 h-6"
                alt="Edit button"
                src="/figmaAssets/button-1.svg"
              />
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <h2 className="[font-family:'Inter',Helvetica] font-normal text-neutral-950 text-lg tracking-[-0.44px] leading-7">
                Student Name
              </h2>

              <p className="[font-family:'Inter',Helvetica] font-normal text-[#495565] text-[14.4px] tracking-[-0.18px] leading-[20.6px]">
                email@example.com
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-[#eff1ff] text-violet-900 border-transparent hover:bg-[#eff1ff] h-auto px-2 py-0.5">
                  <span className="[font-family:'Inter',Helvetica] font-medium text-xs">
                    Student
                  </span>
                </Badge>

                <Badge
                  variant="outline"
                  className="border-[#00a63e] text-[#00a63e] hover:bg-transparent h-auto px-2 py-0.5"
                >
                  <span className="[font-family:'Inter',Helvetica] font-medium text-xs">
                    Verified
                  </span>
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 w-full">
        {statsData.map((stat, index) => (
          <Card key={index} className="border-[#0000001a]">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="[font-family:'Inter',Helvetica] font-bold text-[#c17aff] text-2xl tracking-[0.07px] leading-8">
                {stat.value}
              </div>
              <div className="[font-family:'Inter',Helvetica] font-normal text-[#495565] text-xs tracking-[0] leading-4 mt-1">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="w-full border-[#0000001a]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-[30px]">
            <h3 className="[font-family:'Inter',Helvetica] font-normal text-neutral-950 text-sm tracking-[-0.15px] leading-[21px]">
              Personal Information
            </h3>
            <img
              className="w-9 h-8"
              alt="Edit button"
              src="/figmaAssets/button-2.svg"
            />
          </div>

          <div className="flex flex-col gap-3">
            {personalInfoData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <img
                  className="w-4 h-4 flex-shrink-0"
                  alt="Icon"
                  src={item.icon}
                />
                <div className="flex flex-col">
                  <div className="[font-family:'Inter',Helvetica] font-medium text-neutral-950 text-[14.4px] tracking-[-0.18px] leading-[20.6px]">
                    {item.value}
                  </div>
                  <div className="[font-family:'Inter',Helvetica] font-normal text-[#697282] text-xs tracking-[0] leading-4">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full border-[#0000001a]">
        <CardContent className="p-6">
          <h3 className="[font-family:'Inter',Helvetica] font-medium text-neutral-950 text-sm tracking-[-0.15px] leading-[21px] mb-[30px]">
            Guardian Information
          </h3>

          <div className="flex flex-col gap-3">
            {guardianInfoData.map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="[font-family:'Inter',Helvetica] font-medium text-neutral-950 text-[14.4px] tracking-[-0.18px] leading-[20.6px]">
                  {item.value}
                </div>
                <div className="[font-family:'Inter',Helvetica] font-normal text-[#697282] text-xs tracking-[0] leading-4">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <nav className="flex flex-col gap-3 w-full">
        {settingsMenuData.map((item, index) => (
          <Card
            key={index}
            className="w-full border-[#0000001a] cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <img className="w-4 h-4" alt="Icon" src={item.icon} />
                <span
                  className={`[font-family:'Inter',Helvetica] font-medium text-[14.4px] tracking-[-0.18px] leading-[20.6px] ${item.textColor}`}
                >
                  {item.label}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </nav>

      <Card className="w-full bg-gray-50 border-[#0000001a]">
        <CardContent className="p-4">
          <div className="flex flex-col gap-1 items-center">
            <p className="[font-family:'Inter',Helvetica] font-normal text-[#697282] text-xs text-center tracking-[0] leading-4">
              AFH Student App v1.0.0
            </p>
            <p className="[font-family:'Inter',Helvetica] font-normal text-[#697282] text-xs text-center tracking-[0] leading-4">
              © 2024 AFH. All rights reserved.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
