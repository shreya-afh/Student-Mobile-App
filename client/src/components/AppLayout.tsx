import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative">
      {/* Main content with bottom padding to prevent overlap with nav */}
      <div className="pb-16">
        {children}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
