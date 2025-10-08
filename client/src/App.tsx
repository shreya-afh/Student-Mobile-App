import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import RegisterStep1 from "@/pages/register/Step1";
import RegisterStep2 from "@/pages/register/Step2";
import RegisterStep3 from "@/pages/register/Step3";
import RegisterStep4 from "@/pages/register/Step4";
import VerifyOTP from "@/pages/VerifyOTP";
import Dashboard from "@/pages/Dashboard";
import CourseEnrollment from "@/pages/CourseEnrollment";
import AttendanceStep1 from "@/pages/attendance/Step1";
import AttendanceStep2 from "@/pages/attendance/Step2";
import AttendanceStep3 from "@/pages/attendance/Step3";
import Certificates from "@/pages/Certificates";
import JobOffers from "@/pages/JobOffers";
import JobOpportunities from "@/pages/JobOpportunities";
import { StudentMobileApp } from "@/pages/StudentMobileApp";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register/step1" component={RegisterStep1} />
      <Route path="/register/step2" component={RegisterStep2} />
      <Route path="/register/step3" component={RegisterStep3} />
      <Route path="/register/step4" component={RegisterStep4} />
      <Route path="/verify-otp" component={VerifyOTP} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/course-enrollment" component={CourseEnrollment} />
      <Route path="/attendance" component={AttendanceStep1} />
      <Route path="/attendance/mode" component={AttendanceStep2} />
      <Route path="/attendance/feedback" component={AttendanceStep3} />
      <Route path="/certificates" component={Certificates} />
      <Route path="/job-offers" component={JobOffers} />
      <Route path="/job-opportunities" component={JobOpportunities} />
      <Route path="/profile" component={StudentMobileApp} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
