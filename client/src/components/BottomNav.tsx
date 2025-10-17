import { Link, useLocation } from "wouter";
import { Home, ClipboardCheck, Briefcase, User } from "lucide-react";

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  { path: "/dashboard", icon: Home, label: "Home" },
  { path: "/attendance", icon: ClipboardCheck, label: "Attendance" },
  { path: "/job-offers", icon: Briefcase, label: "Offers" },
  { path: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location === path;
    }
    if (path === "/attendance") {
      return location.startsWith("/attendance");
    }
    if (path === "/job-offers") {
      return location.startsWith("/job-");
    }
    return location === path;
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50"
      data-testid="bottom-navigation"
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full transition-colors"
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <div className={`flex flex-col items-center gap-1 ${active ? 'text-[#6d10b0]' : 'text-[#697282]'}`}>
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                <span className={`text-xs font-['Inter',Helvetica] ${active ? 'font-semibold' : 'font-normal'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
