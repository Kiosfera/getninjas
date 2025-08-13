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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-border shadow-soft px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map(({ icon: Icon, label, path, hasNotification }) => {
          const isActive = location.pathname === path;

          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "relative flex flex-col items-center py-2.5 px-3 rounded-2xl transition-smooth min-w-[64px] group",
                isActive
                  ? "text-primary bg-primary/10 scale-105"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary hover:scale-105",
              )}
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={cn(
                    "mb-1.5 transition-smooth",
                    isActive
                      ? "stroke-[2.5]"
                      : "stroke-[2] group-hover:stroke-[2.5]",
                  )}
                />
                {hasNotification && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center shadow-soft animate-pulse">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                  </div>
                )}
              </div>

              <span
                className={cn(
                  "text-xs transition-smooth",
                  isActive ? "font-semibold" : "font-medium",
                )}
              >
                {label}
              </span>

              {/* Ripple effect on tap */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-active:opacity-20 bg-primary transition-opacity duration-150",
                )}
              ></div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
