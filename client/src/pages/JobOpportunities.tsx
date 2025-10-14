import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ChevronLeftIcon, SearchIcon, MapPinIcon, CalendarIcon, IndianRupeeIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";

export default function JobOpportunities() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("available");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  useAndroidBackButton("/dashboard");

  const handleApply = (jobTitle: string) => {
    setAppliedJobs([...appliedJobs, jobTitle]);
    toast({
      title: "Application Submitted",
      description: `Your application for ${jobTitle} has been submitted successfully!`,
    });
  };

  const jobs = [
    {
      title: "Digital Marketing Executive",
      company: "TechCorp Solutions",
      location: "Bangalore, Karnataka",
      salary: "₹3-4 LPA",
      postedDays: "2 days ago",
      type: "Full-time",
      match: "92%",
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
      match: "85%",
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
      match: "78%",
      skills: ["Content Writing", "Design", "Social Media"],
      description: "Looking for a creative content creator to develop engaging content...",
    },
  ];

  return (
    <div className="h-screen bg-[#faf9fb] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-safe pb-4 px-4 flex-shrink-0">
        <div className="text-center mb-3">
          <p className="font-['Inter',Helvetica] font-medium text-[#697282] text-xs tracking-wide">
            INFOSYS × ASPIREFORHER
          </p>
        </div>
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
            Available Jobs (3)
          </button>
          <button
            onClick={() => setActiveTab("applied")}
            className={`flex-1 py-2 px-3 rounded-md font-['Inter',Helvetica] font-medium text-sm transition-colors ${
              activeTab === "applied"
                ? "bg-white text-[#5C4C7D] shadow-sm"
                : "text-[#495565]"
            }`}
          >
            Applied (1)
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={`flex-1 py-2 px-3 rounded-md font-['Inter',Helvetica] font-medium text-sm transition-colors ${
              activeTab === "recent"
                ? "bg-white text-[#5C4C7D] shadow-sm"
                : "text-[#495565]"
            }`}
          >
            Recent Placements (2)
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Search and Filters */}
        <div className="mb-4">
          <div className="relative mb-3">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#697282]" />
            <Input
              placeholder="Search jobs or companies"
              className="pl-10 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 h-10 border-gray-200 text-[#495565]">
              All Locations
            </Button>
            <Button variant="outline" className="flex-1 h-10 border-gray-200 text-[#495565]">
              All Types
            </Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.map((job, index) => (
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
                    <Badge className="bg-[#5C4C7D] text-white border-transparent hover:bg-[#5C4C7D]">
                      {job.match} match
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

                <Button 
                  onClick={() => handleApply(job.title)}
                  disabled={appliedJobs.includes(job.title)}
                  className="w-full h-10 bg-[#5C4C7D] hover:bg-[#4C3C6D] text-white disabled:opacity-50"
                >
                  {appliedJobs.includes(job.title) ? "Applied ✓" : "Apply Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
