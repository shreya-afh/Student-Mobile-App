import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

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

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Component /> : <Redirect to="/login" />;
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <Component /> : <Redirect to="/dashboard" />;
}

function Router() {
  return (
    <Switch>
      <Route path="/">{() => <PublicRoute component={Landing} />}</Route>
      <Route path="/login">{() => <PublicRoute component={Login} />}</Route>
      <Route path="/register/step1" component={RegisterStep1} />
      <Route path="/register/step2" component={RegisterStep2} />
      <Route path="/register/step3" component={RegisterStep3} />
      <Route path="/register/step4" component={RegisterStep4} />
      <Route path="/verify-otp" component={VerifyOTP} />
      <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
      <Route path="/course-enrollment">{() => <ProtectedRoute component={CourseEnrollment} />}</Route>
      <Route path="/attendance">{() => <ProtectedRoute component={AttendanceStep1} />}</Route>
      <Route path="/attendance/mode">{() => <ProtectedRoute component={AttendanceStep2} />}</Route>
      <Route path="/attendance/feedback">{() => <ProtectedRoute component={AttendanceStep3} />}</Route>
      <Route path="/certificates">{() => <ProtectedRoute component={Certificates} />}</Route>
      <Route path="/job-offers">{() => <ProtectedRoute component={JobOffers} />}</Route>
      <Route path="/job-opportunities">{() => <ProtectedRoute component={JobOpportunities} />}</Route>
      <Route path="/profile">{() => <ProtectedRoute component={StudentMobileApp} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
