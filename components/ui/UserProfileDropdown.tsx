"use client";

import React, { useState, useRef } from "react";
import { LogOut, LayoutDashboard, Moon, Sun, Settings } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useRouter } from "next/navigation";

interface UserProfileDropdownProps {
  user: any;
  userRole: string;
  onLogout: () => void;
  onDashboardClick: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function UserProfileDropdown({
  user,
  userRole,
  onLogout,
  onDashboardClick,
  isDarkMode,
  toggleDarkMode,
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
    setIsLocked(false);
  });

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const handleMouseEnter = () => {
    if (!isMobile && !isLocked) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isLocked) {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      if (isLocked) {
        setIsLocked(false);
        setIsOpen(false);
      } else {
        setIsLocked(true);
        setIsOpen(true);
      }
    }
  };

  const displayName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.username ||
    user?.email ||
    "کاربر";
  const roleName = userRole === "admin" ? "مدیر سیستم" : "کاربر";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      ref={dropdownRef}
      className="absolute top-2.5 left-4 z-[35] md:top-6 md:left-6 lg:left-8"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        onClick={handleClick}
        className="flex items-center justify-center rounded-full transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
        dir="ltr"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-border/50" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold shadow-md shrink-0 text-lg md:text-xl">
            {initial}
          </div>
        )}
      </div>

      <div className="absolute top-full left-0 pt-2">
        <div
          className={`w-[160px] bg-card border border-border rounded-2xl shadow-xl overflow-hidden transition-all duration-200 origin-top-left flex flex-col ${isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"}`}
        >
          <div className="px-4 py-3 bg-muted/20 border-b border-border flex flex-col items-start justify-center text-left" dir="ltr">
            <p className="text-sm font-bold text-foreground w-full truncate">{displayName}</p>
            <p className="text-[11px] text-muted-foreground w-full truncate mt-0.5">{user?.email}</p>
          </div>

          <button
            onClick={() => {
              onDashboardClick();
              setIsOpen(false);
              setIsLocked(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border-b border-border"
            dir="rtl"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>داشبورد</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDarkMode();
            }}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border-b border-border"
            dir="rtl"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="w-4 h-4 shrink-0" />
              ) : (
                <Sun className="w-4 h-4 shrink-0 text-warning" />
              )}
              <span>{isDarkMode ? "شب" : "روز"}</span>
            </div>
            <div className="relative flex items-center w-8 h-4 rounded-full bg-secondary transition-colors p-0.5 shrink-0">
              <div
                className={`absolute w-3 h-3 rounded-full bg-card shadow-sm transition-transform duration-300 ${isDarkMode ? "-translate-x-4" : "translate-x-0"}`}
              ></div>
            </div>
          </button>

          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
              setIsLocked(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors"
            dir="rtl"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>خروج</span>
          </button>
        </div>
      </div>
    </div>
  );
}
