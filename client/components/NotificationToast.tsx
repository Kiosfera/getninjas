import { CheckCircle, X, AlertCircle, Info } from "lucide-react";
import { useState, useEffect } from "react";

interface NotificationToastProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function NotificationToast({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000,
}: NotificationToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "info":
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-success/10 border-success/20";
      case "error":
        return "bg-destructive/10 border-destructive/20";
      case "info":
        return "bg-primary/10 border-primary/20";
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top duration-300">
      <div
        className={`${getBgColor()} rounded-2xl p-4 shadow-soft border backdrop-blur-sm flex items-center space-x-3`}
      >
        {getIcon()}
        <p className="body-text text-foreground flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-smooth"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
