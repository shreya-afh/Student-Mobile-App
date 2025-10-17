import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ChevronLeftIcon, CalendarIcon, ClockIcon, UsersIcon, MonitorIcon } from "lucide-react";
import { useState } from "react";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Course } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";

export default function CourseEnrollment() {
  const [, setLocation] = useLocation();
  const [courseCode, setCourseCode] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const { toast } = useToast();
  const { user, login } = useAuth();
  useAndroidBackButton("/dashboard");

  const { data: courseData, isLoading, error } = useQuery<{ success: boolean; course: Course }>({
    queryKey: ["/api/courses/search", searchCode],
    enabled: !!searchCode,
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !courseData?.course.id) {
        throw new Error("User ID or Course ID missing");
      }
      const response = await apiRequest("POST", "/api/enroll", {
        userId: user.id,
        courseId: courseData.course.id,
      });
      return response.json();
    },
    onSuccess: () => {
      // Update user in AuthContext with courseId
      if (user && courseData?.course.id) {
        login({
          ...user,
          courseId: courseData.course.id,
        });
      }
      
      toast({
        title: "Enrollment Successful",
        description: `You have been enrolled in ${courseData?.course.courseName}`,
      });
      
      // Small delay to ensure context update completes before redirect
      setTimeout(() => {
        setLocation("/dashboard");
      }, 100);
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to enroll in course",
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    if (courseCode.trim()) {
      setSearchCode(courseCode.toUpperCase().trim());
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a course code",
        variant: "destructive",
      });
    }
  };

  const handleEnroll = () => {
    enrollMutation.mutate();
  };

  return (
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-safe flex-shrink-0">
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
        <div className="pb-4 px-4">
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
                Course Enrollment
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-20" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}>
        <div className="max-w-md mx-auto">
          <h2 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-xl mb-2">
            Find Course
          </h2>
          <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-4">
            Enter the course code provided by your mobilization partner
          </p>

          <div className="mb-4">
            <label className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm mb-2 block">
              Course Code
            </label>
            <Input
              placeholder="e.g., DM2024B4"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="mb-3"
            />
            <Button
              onClick={handleSearch}
              className="w-full h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base"
            >
              Search Course
            </Button>
          </div>

          {isLoading && searchCode && (
            <div className="text-center py-8">
              <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm">
                Searching for course...
              </p>
            </div>
          )}

          {error && searchCode && (
            <Card className="border-red-200 bg-red-50 mb-6">
              <CardContent className="p-4 text-center">
                <p className="font-['Inter',Helvetica] font-medium text-red-600 text-sm">
                  Course not found. Please check the course code and try again.
                </p>
              </CardContent>
            </Card>
          )}

          {courseData?.course && (
            <Card className="border-gray-200 hover:shadow-md transition-all mb-6">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-lg">
                      {courseData.course.courseName}
                    </h3>
                    <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                      Code: {courseData.course.courseCode}
                    </p>
                  </div>
                  <Badge className="bg-[#eff1ff] text-[#5C4C7D] border-transparent hover:bg-[#eff1ff]">
                    {courseData.course.mode}
                  </Badge>
                </div>

                <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-4">
                  {courseData.course.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-[#697282]" />
                    <div>
                      <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">{courseData.course.duration}</p>
                      <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">Duration</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#697282]" />
                    <div>
                      <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">{courseData.course.startDate}</p>
                      <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">Start Date</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-[#697282]" />
                    <div>
                      <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                        {courseData.course.enrolledCount}/{courseData.course.totalCapacity} students
                      </p>
                      <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">Capacity</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MonitorIcon className="w-4 h-4 text-[#697282]" />
                    <div>
                      <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">{courseData.course.mode}</p>
                      <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">Mode</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#0000001a]">
                  <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm mb-1">Trainer</p>
                  <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">{courseData.course.trainerName}</p>
                </div>

                <div className="mt-4">
                  <p className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-sm mb-2">
                    Course Modules
                  </p>
                  <ul className="space-y-1">
                    {JSON.parse(courseData.course.modules).map((module: string, i: number) => (
                      <li key={i} className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5C4C7D]"></span>
                        {module}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                  className="w-full h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base mt-4"
                  data-testid="button-enroll"
                >
                  {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="bg-[#f3f4f6] border-gray-200">
            <CardContent className="p-4">
              <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-sm mb-2">
                How to get Course Code?
              </h3>
              <ul className="space-y-1">
                {[
                  "Contact your mobilization partner",
                  "Attend information session",
                  "Check SMS/WhatsApp messages",
                  "Visit local AFH center",
                ].map((item, i) => (
                  <li key={i} className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm flex items-center gap-2">
                    <span className="text-[#5C4C7D]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
