import { Home, Search, MessageCircle, User, ClipboardList } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Buscar", path: "/search" },
  { icon: ClipboardList, label: "Pedidos", path: "/requests" },
  { icon: MessageCircle, label: "Chat", path: "/chat", hasNotification: true },
  { icon: User, label: "Perfil", path: "/profile" },
];

export default function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map(({ icon: Icon, label, path, hasNotification }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "relative flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-200 min-w-[60px]",
                isActive 
                  ? "text-primary bg-primary/10 scale-105" 
                  : "text-gray-500 hover:text-primary hover:bg-gray-50 hover:scale-105"
              )}
            >
              <div className="relative">
                <Icon 
                  size={22} 
                  className={cn(
                    "mb-1 transition-all duration-200",
                    isActive ? "stroke-[2.5]" : "stroke-[2]"
                  )} 
                />
                {hasNotification && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                isActive ? "font-semibold" : "font-normal"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
