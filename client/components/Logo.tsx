import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon-only" | "text-only";
  className?: string;
}

const sizeClasses = {
  sm: {
    container: "h-8",
    icon: "w-8 h-8",
    text: "text-lg",
    tagline: "text-xs",
  },
  md: {
    container: "h-10",
    icon: "w-10 h-10",
    text: "text-xl",
    tagline: "text-sm",
  },
  lg: {
    container: "h-12",
    icon: "w-12 h-12",
    text: "text-2xl",
    tagline: "text-base",
  },
  xl: {
    container: "h-16",
    icon: "w-16 h-16",
    text: "text-3xl",
    tagline: "text-lg",
  },
};

export default function Logo({
  size = "md",
  variant = "full",
  className,
}: LogoProps) {
  const classes = sizeClasses[size];

  // PANASERVICE Icon - inspired by GetNinjas but unique
  const LogoIcon = () => (
    <div
      className={cn(
        "relative rounded-2xl gradient-primary flex items-center justify-center shadow-soft",
        classes.icon,
      )}
    >
      {/* Main service icon - wrench/tools */}
      <svg
        viewBox="0 0 24 24"
        className="w-1/2 h-1/2 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        {/* Wrench */}
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>

      {/* Decorative spark/star - top right */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
        <svg
          viewBox="0 0 12 12"
          className="w-2 h-2 text-white"
          fill="currentColor"
        >
          <path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12l-1.5-4.5L0 6l4.5-1.5L6 0z" />
        </svg>
      </div>

      {/* Decorative dot - bottom left */}
      <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-success rounded-full"></div>
    </div>
  );

  if (variant === "icon-only") {
    return <LogoIcon />;
  }

  if (variant === "text-only") {
    return (
      <div className={cn("flex flex-col", className)}>
        <span
          className={cn("font-poppins font-bold text-foreground", classes.text)}
        >
          PANASERVICE
        </span>
        <span
          className={cn(
            "font-montserrat font-medium text-muted-foreground -mt-1",
            classes.tagline,
          )}
        >
          todos os serviços em um só lugar
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center space-x-3",
        classes.container,
        className,
      )}
    >
      <LogoIcon />
      <div className="flex flex-col">
        <span
          className={cn(
            "font-poppins font-bold text-foreground leading-tight",
            classes.text,
          )}
        >
          PANASERVICE
        </span>
        <span
          className={cn(
            "font-montserrat font-medium text-muted-foreground leading-tight -mt-0.5",
            classes.tagline,
          )}
        >
          todos os serviços em um só lugar
        </span>
      </div>
    </div>
  );
}

// Favicon-specific component
export function FaviconLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      {/* Background circle with gradient */}
      <circle cx="16" cy="16" r="16" fill="url(#gradient)" />

      {/* Wrench icon */}
      <path
        d="M19.6 8.4a1.33 1.33 0 0 0 0 1.87l2.13 2.13a1.33 1.33 0 0 0 1.87 0l5.02-5.02a8 8 0 0 1-10.59 10.59L9.21 26.79a2.83 2.83 0 0 1-4-4L14.03 14a8 8 0 0 1 10.59-10.59L19.6 8.43z"
        fill="white"
        stroke="white"
        strokeWidth="1"
      />

      {/* Spark */}
      <circle cx="25" cy="7" r="2" fill="#FFC107" />
      <path
        d="M25 5l0.75 2.25L28 7l-2.25 0.75L25 10l-0.75-2.25L22 7l2.25-0.75L25 5z"
        fill="white"
      />

      {/* Small accent dot */}
      <circle cx="8" cy="25" r="1.5" fill="#10B981" />

      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
