import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative">
      {/* Main content - pages manage their own bottom spacing */}
      {children}
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
