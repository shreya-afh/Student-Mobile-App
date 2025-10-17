import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ChevronLeftIcon, CalendarIcon, MonitorIcon, MapPinIcon, StarIcon } from "lucide-react";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import type { AttendanceRecord } from "@shared/schema";

export default function AttendanceHistory() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  useAndroidBackButton("/dashboard");

  const { data: attendanceData, isLoading, isError, error, refetch } = useQuery<{ success: boolean; records: AttendanceRecord[] }>({
    queryKey: [`/api/attendance/${user?.id}`],
    enabled: !!user?.id,
  });

  const records = attendanceData?.records || [];

  return (
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 pt-safe flex-shrink-0">
        <div className="bg-[#f8f9fa] border-b border-gray-200 py-2 px-4">
          <div className="flex items-center justify-center gap-3">
            <img src={infosysLogo} alt="Infosys Foundation" className="h-6 object-contain" />
            <span className="text-gray-400 text-sm">×</span>
            <img src={aspireForHerLogo} alt="AspireForHer" className="h-8 object-contain" />
          </div>
        </div>
        <div className="pb-4 px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard")}
              className="h-10 w-10 p-0 hover:bg-gray-100 relative z-10 -ml-2"
              data-testid="button-back"
            >
              <ChevronLeftIcon className="w-6 h-6 text-[#495565]" />
            </Button>
            <h1 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-lg">
              Attendance History
            </h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-20" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}>
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading attendance records...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                <h3 className="font-['Inter',Helvetica] font-semibold text-red-800 text-lg mb-2">
                  Error Loading Records
                </h3>
                <p className="font-['Inter',Helvetica] font-normal text-red-600 text-sm mb-4">
                  {error instanceof Error ? error.message : "Failed to load attendance records. Please try again."}
                </p>
                <Button
                  onClick={() => refetch()}
                  className="bg-[#5C4C7D] hover:bg-[#4C3C6D]"
                  data-testid="button-retry"
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-lg mb-2">
                No Attendance Records
              </h3>
              <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm mb-6">
                You haven't attended any sessions yet
              </p>
              <Button
                onClick={() => setLocation("/attendance")}
                className="bg-[#5C4C7D] hover:bg-[#4C3C6D]"
                data-testid="button-mark-attendance"
              >
                Mark Attendance
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <Card key={record.id} className="border-gray-200" data-testid={`card-attendance-${record.id}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base mb-1">
                          {record.sessionName}
                        </h3>
                        <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm">
                          {record.courseName}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                        <span className="font-['Inter',Helvetica] font-medium text-[#1d2838] text-sm">
                          {record.rating}/5
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-3">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4 text-[#697282]" />
                        <span className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs">
                          {record.sessionDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {record.mode === "online" ? (
                          <MonitorIcon className="w-4 h-4 text-blue-600" />
                        ) : (
                          <MapPinIcon className="w-4 h-4 text-purple-600" />
                        )}
                        <span className="font-['Inter',Helvetica] font-normal text-[#697282] text-xs capitalize">
                          {record.mode}
                        </span>
                      </div>
                    </div>

                    {record.feedback && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm">
                          "{record.feedback}"
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
