import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ChevronLeftIcon, SearchIcon, MapPinIcon, CalendarIcon, IndianRupeeIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";
import infosysLogo from "@assets/infosys-foundation-logo-blue_1760417156143.png";
import aspireForHerLogo from "@assets/image_1760420610980.png";

export default function JobOpportunities() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("available");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [recentlyApplied, setRecentlyApplied] = useState<Set<string>>(new Set());
  const [fadingOut, setFadingOut] = useState<Set<string>>(new Set());
  const timersRef = useRef<Map<string, NodeJS.Timeout[]>>(new Map());
  useAndroidBackButton("/dashboard");

  useEffect(() => {
    return () => {
      timersRef.current.forEach(timers => timers.forEach(clearTimeout));
      timersRef.current.clear();
    };
  }, []);

  const handleApply = (jobTitle: string) => {
    setAppliedJobs(prev => prev.includes(jobTitle) ? prev : [...prev, jobTitle]);
    setRecentlyApplied(prev => new Set(prev).add(jobTitle));
    
    toast({
      title: "Application Submitted",
      description: `Your application for ${jobTitle} has been submitted successfully!`,
    });

    const fadeTimer = setTimeout(() => {
      setFadingOut(prev => new Set(prev).add(jobTitle));
      
      const removeTimer = setTimeout(() => {
        setRecentlyApplied(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobTitle);
          return newSet;
        });
        setFadingOut(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobTitle);
          return newSet;
        });
        timersRef.current.delete(jobTitle);
      }, 300);
      
      timersRef.current.set(jobTitle, [fadeTimer, removeTimer]);
    }, 2700);
    
    timersRef.current.set(jobTitle, [fadeTimer]);
  };

  const allJobs = [
    {
      title: "Digital Marketing Executive",
      company: "TechCorp Solutions",
      location: "Bangalore, Karnataka",
      salary: "₹3-4 LPA",
      postedDays: "2 days ago",
      type: "Full-time",
      skills: ["SEO", "Social Media", "Content Creation", "+1 more"],
      description: "We are looking for a Digital Marketing Executive to join our growing team...",
    },
    {
      title: "Social Media Intern",
      company: "Creative Agency",
      location: "Mumbai, Maharashtra",
      salary: "₹15,000/month",
      postedDays: "1 week ago",
      type: "Internship",
      skills: ["Social Media", "Content Creation", "Communication"],
      description: "Great opportunity for freshers to gain experience in social media marketing...",
    },
    {
      title: "Content Creator",
      company: "Digital First Media",
      location: "Delhi NCR",
      salary: "₹2-3 LPA",
      postedDays: "3 days ago",
      type: "Part-time",
      skills: ["Content Writing", "Design", "Social Media"],
      description: "Looking for a creative content creator to develop engaging content...",
    },
  ];

  // Filter jobs based on search query
  const jobs = allJobs.filter(job => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.skills.some(skill => skill.toLowerCase().includes(query))
    );
  });

  const availableJobs = jobs.filter(job => !appliedJobs.includes(job.title));
  const appliedJobsList = jobs.filter(job => appliedJobs.includes(job.title));

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
          <div className="flex items-center justify-between mb-4">
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
                Job Opportunities
              </h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 py-2 px-3 rounded-md font-['Inter',Helvetica] font-medium text-sm transition-colors ${
              activeTab === "available"
                ? "bg-white text-[#5C4C7D] shadow-sm"
                : "text-[#495565]"
            }`}
          >
            Available Jobs ({availableJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("applied")}
            className={`flex-1 py-2 px-3 rounded-md font-['Inter',Helvetica] font-medium text-sm transition-colors ${
              activeTab === "applied"
                ? "bg-white text-[#5C4C7D] shadow-sm"
                : "text-[#495565]"
            }`}
          >
            Applied ({appliedJobs.length})
          </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#697282]" />
            <Input
              placeholder="Search jobs or companies"
              className="pl-10 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {activeTab === "available" ? (
            availableJobs.map((job, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base mb-1">
                        {job.title}
                      </h3>
                      <p className="font-['Inter',Helvetica] font-medium text-[#495565] text-sm">
                        {job.company}
                      </p>
                    </div>
                    <Badge className={`
                      ${job.type === "Full-time" ? "bg-[#eff1ff] text-[#5C4C7D]" : ""}
                      ${job.type === "Internship" ? "bg-[#fef3c7] text-[#92400e]" : ""}
                      ${job.type === "Part-time" ? "bg-[#f0fdf4] text-[#166534]" : ""}
                      border-transparent
                    `}>
                      {job.type}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3 text-[#495565]">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="font-['Inter',Helvetica] font-normal text-sm">
                        {job.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupeeIcon className="w-4 h-4" />
                      <span className="font-['Inter',Helvetica] font-normal text-sm">
                        {job.salary}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="font-['Inter',Helvetica] font-normal text-sm">
                        {job.postedDays}
                      </span>
                    </div>
                  </div>

                  <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="border-gray-200 text-[#495565]">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    onClick={() => handleApply(job.title)}
                    className="w-full h-10 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white"
                    data-testid={`button-apply-${index}`}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : appliedJobs.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="p-8 text-center">
                <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm">
                  You haven't applied to any jobs yet. Switch to Available Jobs to start applying!
                </p>
              </CardContent>
            </Card>
          ) : appliedJobsList.length > 0 ? (
            appliedJobsList.map((job, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-['Inter',Helvetica] font-semibold text-[#1d2838] text-base mb-1">
                        {job.title}
                      </h3>
                      <p className="font-['Inter',Helvetica] font-medium text-[#495565] text-sm">
                        {job.company}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={`
                        ${job.type === "Full-time" ? "bg-[#eff1ff] text-[#5C4C7D]" : ""}
                        ${job.type === "Internship" ? "bg-[#fef3c7] text-[#92400e]" : ""}
                        ${job.type === "Part-time" ? "bg-[#f0fdf4] text-[#166534]" : ""}
                        border-transparent
                      `}>
                        {job.type}
                      </Badge>
                      <Badge className="bg-[#00a63e] text-white border-transparent hover:bg-[#00a63e]">
                        Applied ✓
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3 text-[#495565]">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="font-['Inter',Helvetica] font-normal text-sm">
                        {job.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupeeIcon className="w-4 h-4" />
                      <span className="font-['Inter',Helvetica] font-normal text-sm">
                        {job.salary}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="font-['Inter',Helvetica] font-normal text-sm">
                        {job.postedDays}
                      </span>
                    </div>
                  </div>

                  <p className="font-['Inter',Helvetica] font-normal text-[#495565] text-sm mb-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="border-gray-200 text-[#495565]">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {recentlyApplied.has(job.title) && (
                    <div className={`bg-[#f0fdf4] border border-[#00a63e] rounded-lg p-3 transition-all duration-300 ${
                      fadingOut.has(job.title) 
                        ? 'opacity-0 translate-y-2' 
                        : 'opacity-100 translate-y-0 animate-in fade-in slide-in-from-bottom-2'
                    }`}>
                      <p className="font-['Inter',Helvetica] font-medium text-[#00a63e] text-sm text-center">
                        Application Submitted Successfully
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-gray-200">
              <CardContent className="p-8 text-center">
                <p className="font-['Inter',Helvetica] font-normal text-[#697282] text-sm">
                  No applied jobs match your search. Try a different search term or clear the search.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
