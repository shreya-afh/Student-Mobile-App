import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { RegistrationProvider } from "@/contexts/RegistrationContext";
import { useEffect } from "react";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
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
import AttendanceHistory from "@/pages/AttendanceHistory";
import Certificates from "@/pages/Certificates";
import JobOffers from "@/pages/JobOffers";
import JobOpportunities from "@/pages/JobOpportunities";
import { StudentMobileApp } from "@/pages/StudentMobileApp";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  return isAuthenticated ? <>{children}</> : null;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  return !isAuthenticated ? <>{children}</> : null;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <PublicRoute>
          <Landing />
        </PublicRoute>
      </Route>
      <Route path="/login">
        <PublicRoute>
          <Login />
        </PublicRoute>
      </Route>
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/register/step1" component={RegisterStep1} />
      <Route path="/register/step2" component={RegisterStep2} />
      <Route path="/register/step3" component={RegisterStep3} />
      <Route path="/register/step4" component={RegisterStep4} />
      <Route path="/verify-otp" component={VerifyOTP} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/course-enrollment">
        <ProtectedRoute>
          <CourseEnrollment />
        </ProtectedRoute>
      </Route>
      <Route path="/attendance">
        <ProtectedRoute>
          <AttendanceStep1 />
        </ProtectedRoute>
      </Route>
      <Route path="/attendance/mode">
        <ProtectedRoute>
          <AttendanceStep2 />
        </ProtectedRoute>
      </Route>
      <Route path="/attendance/feedback">
        <ProtectedRoute>
          <AttendanceStep3 />
        </ProtectedRoute>
      </Route>
      <Route path="/attendance-history">
        <ProtectedRoute>
          <AttendanceHistory />
        </ProtectedRoute>
      </Route>
      <Route path="/certificates">
        <ProtectedRoute>
          <Certificates />
        </ProtectedRoute>
      </Route>
      <Route path="/job-offers">
        <ProtectedRoute>
          <JobOffers />
        </ProtectedRoute>
      </Route>
      <Route path="/job-opportunities">
        <ProtectedRoute>
          <JobOpportunities />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <StudentMobileApp />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RegistrationProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </RegistrationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
