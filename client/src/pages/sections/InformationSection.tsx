import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

const statsData = [
  { value: "1", label: "Courses Completed" },
  { value: "39", label: "Hours Learned" },
  { value: "2", label: "Certificates" },
  { value: "92%", label: "Attendance Rate" },
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
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["/api/user", user?.id],
    enabled: !!user?.id,
  });

  const profileData = userData?.user;
  
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  if (isLoading) {
    return (
      <section className="flex flex-col items-start gap-6 p-4 w-full">
        <Card className="w-full border-[#0000001a]">
          <CardContent className="p-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-start gap-6 p-4 w-full">
      <Card className="w-full border-[#0000001a]">
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0">
              <div className="flex w-16 h-16 items-center justify-center bg-[#eff1ff] rounded-full">
                <span className="[font-family:'Inter',Helvetica] font-semibold text-[#5C4C7D] text-xl tracking-[-0.45px] leading-7">
                  {getInitials(profileData?.fullName)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <h2 className="[font-family:'Inter',Helvetica] font-semibold text-neutral-950 text-lg tracking-[-0.44px] leading-7">
                {profileData?.fullName || "Student Name"}
              </h2>

              <p className="[font-family:'Inter',Helvetica] font-normal text-[#495565] text-[14.4px] tracking-[-0.18px] leading-[20.6px]">
                {profileData?.email || "email@example.com"}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-[#eff1ff] text-[#5C4C7D] border-transparent hover:bg-[#eff1ff] h-auto px-2 py-0.5">
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
              <div className="[font-family:'Inter',Helvetica] font-bold text-[#5C4C7D] text-2xl tracking-[0.07px] leading-8">
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
            <h3 className="[font-family:'Inter',Helvetica] font-semibold text-neutral-950 text-sm tracking-[-0.15px] leading-[21px]">
              Personal Information
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <div className="[font-family:'Inter',Helvetica] font-medium text-neutral-950 text-[14.4px] tracking-[-0.18px] leading-[20.6px]">
                {profileData?.id || "Not provided"}
              </div>
              <div className="[font-family:'Inter',Helvetica] font-normal text-[#697282] text-xs tracking-[0] leading-4">
                Registration ID
              </div>
            </div>
            <div className="flex flex-col">
              <div className="[font-family:'Inter',Helvetica] font-medium text-neutral-950 text-[14.4px] tracking-[-0.18px] leading-[20.6px]">
                {profileData?.fullName || "Not provided"}
              </div>
              <div className="[font-family:'Inter',Helvetica] font-normal text-[#697282] text-xs tracking-[0] leading-4">
                Full Name
              </div>
            </div>
            <div className="flex flex-col">
              <div className="[font-family:'Inter',Helvetica] font-medium text-neutral-950 text-[14.4px] tracking-[-0.18px] leading-[20.6px]">
                {profileData?.email || "Not provided"}
              </div>
              <div className="[font-family:'Inter',Helvetica] font-normal text-[#697282] text-xs tracking-[0] leading-4">
                Email Address
              </div>
            </div>
            <div className="flex flex-col">
              <div className="[font-family:'Inter',Helvetica] font-medium text-neutral-950 text-[14.4px] tracking-[-0.18px] leading-[20.6px]">
                {profileData?.studentContact || "Not provided"}
              </div>
              <div className="[font-family:'Inter',Helvetica] font-normal text-[#697282] text-xs tracking-[0] leading-4">
                Phone Number
              </div>
            </div>
            <div className="flex flex-col">
              <div className="[font-family:'Inter',Helvetica] font-medium text-neutral-950 text-[14.4px] tracking-[-0.18px] leading-[20.6px]">
                {profileData ? `${profileData.city}, ${profileData.district}, ${profileData.state} - ${profileData.pincode}` : "Not provided"}
              </div>
              <div className="[font-family:'Inter',Helvetica] font-normal text-[#697282] text-xs tracking-[0] leading-4">
                Address
              </div>
            </div>
            <div className="flex flex-col">
              <div className="[font-family:'Inter',Helvetica] font-medium text-neutral-950 text-[14.4px] tracking-[-0.18px] leading-[20.6px]">
                {profileData ? `${profileData.course} at ${profileData.collegeName}` : "Not provided"}
              </div>
              <div className="[font-family:'Inter',Helvetica] font-normal text-[#697282] text-xs tracking-[0] leading-4">
                Education
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full border-[#0000001a]">
        <CardContent className="p-6">
          <h3 className="[font-family:'Inter',Helvetica] font-semibold text-neutral-950 text-sm tracking-[-0.15px] leading-[21px] mb-[30px]">
            Guardian Information
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <div className="[font-family:'Inter',Helvetica] font-medium text-neutral-950 text-[14.4px] tracking-[-0.18px] leading-[20.6px]">
                {profileData?.guardianName || "Not provided"}
              </div>
              <div className="[font-family:'Inter',Helvetica] font-normal text-[#697282] text-xs tracking-[0] leading-4">
                Guardian Name
              </div>
            </div>
            <div className="flex flex-col">
              <div className="[font-family:'Inter',Helvetica] font-medium text-neutral-950 text-[14.4px] tracking-[-0.18px] leading-[20.6px]">
                {profileData?.guardianOccupation || "Not provided"}
              </div>
              <div className="[font-family:'Inter',Helvetica] font-normal text-[#697282] text-xs tracking-[0] leading-4">
                Occupation
              </div>
            </div>
            <div className="flex flex-col">
              <div className="[font-family:'Inter',Helvetica] font-medium text-neutral-950 text-[14.4px] tracking-[-0.18px] leading-[20.6px]">
                {profileData?.guardianContact || "Not provided"}
              </div>
              <div className="[font-family:'Inter',Helvetica] font-normal text-[#697282] text-xs tracking-[0] leading-4">
                Contact Number
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <nav className="flex flex-col gap-3 w-full">
        {settingsMenuData.map((item, index) => (
          <Card
            key={index}
            onClick={item.label === "Logout" ? handleLogout : undefined}
            className="w-full border-[#0000001a] cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
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
