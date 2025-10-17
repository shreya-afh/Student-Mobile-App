import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Course } from "@shared/schema";
import { QrCodeIcon, BriefcaseIcon, AwardIcon, TrendingUpIcon, LogOutIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { logout, user } = useAuth();

  // Redirect to course enrollment if user has no course
  useEffect(() => {
    if (user && !user.courseId) {
      setLocation("/course-enrollment");
    }
  }, [user, setLocation]);

  // Fetch enrolled course details
  const { data: courseData } = useQuery<{ success: boolean; course: Course }>({
    queryKey: [`/api/courses/${user?.courseId}`],
    enabled: !!user?.courseId,
  });

  // Generate initials from user name
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

  const quickActions = [
    {
      icon: QrCodeIcon,
      label: "Attendance and Feedback",
      subtitle: "Scan QR & rate your session",
      onClick: () => setLocation("/attendance"),
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
  ];

  return (
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[#faf9fb] flex-shrink-0">
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
              className="h-8 object-contain"
            />
          </div>
        </div>
        
        {/* Main Header Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-xl">
              Welcome back!
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLocation("/profile")}
                className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#5C4C7D] focus:ring-offset-2"
                data-testid="button-profile"
                aria-label="View profile"
              >
                <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarFallback className="bg-[#5C4C7D] text-white text-sm">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-8 w-8 p-0 hover:bg-gray-100"
                data-testid="button-logout"
                aria-label="Logout"
              >
                <LogOutIcon className="w-5 h-5 text-[#495565]" />
              </Button>
            </div>
          </div>

          {/* Current Course Card */}
          {courseData?.course ? (
            <Card 
              className="border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all" 
              onClick={() => setLocation("/attendance-history")}
              data-testid="card-current-course"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs mb-1">
                      Current Course
                    </p>
                    <h2 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base">
                      {courseData.course.courseName}
                    </h2>
                    <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                      Trainer: {courseData.course.trainerName}
                    </p>
                  </div>
                  <div className="bg-[#eff1ff] rounded-lg px-3 py-1">
                    <span className="font-['Inter',Helvetica] font-semibold text-[#5C4C7D] text-sm">
                      {courseData.course.courseCode}
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
                  <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">
                    Attendance: <span className="text-[#5C4C7D] font-medium">92%</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm text-center">
                  Loading course details...
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-20 bg-[#faf9fb]" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}>
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
              <div className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm mt-1">
                Attendance
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
