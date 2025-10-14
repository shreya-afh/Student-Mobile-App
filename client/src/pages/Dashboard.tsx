import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { QrCodeIcon, BriefcaseIcon, AwardIcon, UserIcon, BookOpenIcon, TrendingUpIcon, LogOutIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const quickActions = [
    {
      icon: QrCodeIcon,
      label: "Attendance and Feedback",
      subtitle: "Scan QR & rate your session",
      onClick: () => setLocation("/attendance"),
    },
    {
      icon: BookOpenIcon,
      label: "Enroll in Course",
      subtitle: "Find & join new courses",
      onClick: () => setLocation("/course-enrollment"),
    },
    {
      icon: BriefcaseIcon,
      label: "Job Offers",
      subtitle: "View job offers",
      onClick: () => setLocation("/job-offers"),
    },
    {
      icon: AwardIcon,
      label: "My Certificates",
      subtitle: "View earned certificates",
      onClick: () => setLocation("/certificates"),
    },
    {
      icon: TrendingUpIcon,
      label: "Job Opportunities",
      subtitle: "Explore placement options",
      onClick: () => setLocation("/job-opportunities"),
    },
    {
      icon: UserIcon,
      label: "Profile",
      subtitle: "Manage your account",
      onClick: () => setLocation("/profile"),
    },
  ];

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-xl">
            Welcome back!
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <LogOutIcon className="w-5 h-5 text-[#495565]" />
            </Button>
            <div className="bg-[#eff1ff] rounded-[10px] px-3 py-1.5">
              <span className="font-['Inter',Helvetica] font-normal text-[#1d2838] text-xs">
                Infosys X AspireForHer
              </span>
            </div>
          </div>
        </div>

        {/* Current Course Card */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mb-1">
                  Current Course
                </p>
                <h2 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base">
                  Digital Marketing Fundamentals
                </h2>
                <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                  Trainer: Priya Sharma
                </p>
              </div>
              <div className="bg-[#eff1ff] rounded-lg px-3 py-1">
                <span className="font-['Inter',Helvetica] font-semibold text-[#5C4C7D] text-sm">
                  DM2024B3
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">
                  Progress
                </span>
                <span className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                  39/60 hours
                </span>
              </div>
              <div className="w-full bg-[#e5e7eb] rounded-full h-2">
                <div className="bg-[#5C4C7D] h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-xs mt-1">
                65% completed
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-[#0000001a]">
              <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                Next session: Tomorrow, 10:00 AM
              </p>
            </div>
          </CardContent>
        </Card>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-20 bg-[#faf9fb]">
        {/* Quick Actions */}
        <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-lg mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              onClick={action.onClick}
              className="border-gray-200 cursor-pointer hover:border-[#5C4C7D] hover:shadow-md transition-all"
            >
              <CardContent className="p-4">
                <action.icon className="w-6 h-6 text-[#5C4C7D] mb-2" />
                <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-sm mb-1">
                  {action.label}
                </h3>
                <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">
                  {action.subtitle}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Your Progress */}
        <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-lg mb-4">
          Your Progress
        </h2>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="border-gray-200">
            <CardContent className="p-3 text-center">
              <div className="font-['Inter',Helvetica] font-bold text-[#5C4C7D] text-xl">39</div>
              <div className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                Hours Completed
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-3 text-center">
              <div className="font-['Inter',Helvetica] font-bold text-[#5C4C7D] text-xl">2</div>
              <div className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                Certificates
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-3 text-center">
              <div className="font-['Inter',Helvetica] font-bold text-[#5C4C7D] text-xl">92%</div>
              <div className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mt-1">
                Attendance
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Alert */}
        <Card className="border-[#5C4C7D] bg-[#eff1ff]">
          <CardContent className="p-4">
            <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base mb-1">
              New Job Opportunities!
            </h3>
            <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-3">
              5 new positions available for Digital Marketing professionals. Apply now!
            </p>
            <Button
              onClick={() => setLocation("/job-opportunities")}
              variant="link"
              className="p-0 h-auto font-['Inter',Helvetica] font-medium text-[#5C4C7D] text-sm hover:text-[#4C3C6D]"
            >
              View Jobs →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
