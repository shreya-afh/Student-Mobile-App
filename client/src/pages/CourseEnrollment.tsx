import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ChevronLeftIcon, CalendarIcon, ClockIcon, UsersIcon, MonitorIcon } from "lucide-react";
import { useState } from "react";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";

export default function CourseEnrollment() {
  const [, setLocation] = useLocation();
  const [courseCode, setCourseCode] = useState("");
  const [showCourse, setShowCourse] = useState(false);
  useAndroidBackButton("/dashboard");

  const handleSearch = () => {
    if (courseCode) {
      setShowCourse(true);
    }
  };

  const handleEnroll = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-safe pb-4 px-4 flex-shrink-0">
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
          <div className="bg-[#ffffffe6] rounded-[10px] px-3 py-1.5">
            <span className="font-['Inter',Helvetica] font-normal text-[#1d2838] text-xs">
              Infosys X AspireForHer
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
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

          {showCourse && (
            <Card className="border-gray-200 hover:shadow-md transition-all mb-6">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-['Inter',Helvetica] font-bold text-[#1d2838] text-lg">
                      Digital Marketing Fundamentals
                    </h3>
                    <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                      Code: DM2024B4
                    </p>
                  </div>
                  <Badge className="bg-[#eff1ff] text-[#5C4C7D] border-transparent hover:bg-[#eff1ff]">
                    Digital Marketing
                  </Badge>
                </div>

                <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-4">
                  Learn the fundamentals of digital marketing including SEO, social media marketing, content creation, and analytics.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-[#697282]" />
                    <div>
                      <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">60 hours</p>
                      <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">Duration</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#697282]" />
                    <div>
                      <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">25 Dec 2024</p>
                      <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">Start Date</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-[#697282]" />
                    <div>
                      <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">18/30 students</p>
                      <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">Capacity</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MonitorIcon className="w-4 h-4 text-[#697282]" />
                    <div>
                      <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">Online</p>
                      <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">Mode</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#0000001a]">
                  <p className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm mb-1">Trainer</p>
                  <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">Priya Sharma</p>
                </div>

                <div className="mt-4">
                  <p className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-sm mb-2">
                    Course Modules
                  </p>
                  <ul className="space-y-1">
                    {[
                      "Introduction to Digital Marketing",
                      "Search Engine Optimization (SEO)",
                      "Social Media Marketing",
                      "Content Marketing",
                      "Email Marketing",
                      "Analytics & Reporting",
                    ].map((module, i) => (
                      <li key={i} className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5C4C7D]"></span>
                        {module}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={handleEnroll}
                  className="w-full h-12 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white rounded-lg font-['Inter',Helvetica] font-medium text-base mt-4"
                >
                  Enroll Now
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
