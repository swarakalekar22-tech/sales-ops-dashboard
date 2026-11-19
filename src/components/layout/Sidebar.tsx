import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Boxes,
  FileBarChart,
  LayoutDashboard,
  Settings,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/layout/nav-items";
import { useSidebar } from "@/components/layout/SidebarContext";
import { BRAND_NAME, BRAND_TAGLINE } from "@/config/brand";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  TrendingUp,
  Boxes,
  FileBarChart,
};

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();

  return (
    <nav aria-label="Main navigation" className="flex-1 space-y-0.5 px-3 py-5">
      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
        Menu
      </p>
      {navItems.map((item) => {
        const Icon = icons[item.icon];
        const isActive =
          item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 outline-none transition-colors duration-150 hover:text-white focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            {isActive && (
              <motion.span
                layoutId="sidebar-active-pill"
                className="absolute inset-0 rounded-lg bg-brand-gradient shadow-glow-sm"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-5 w-5 items-center justify-center transition-transform duration-150",
                !isActive && "group-hover:translate-x-0.5"
              )}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <span className={cn("relative z-10", isActive && "font-semibold text-white")}>
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function BrandMark() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient-diagonal text-white shadow-glow-sm">
      <Zap className="h-[18px] w-[18px] fill-white" aria-hidden="true" />
    </span>
  );
}

function SidebarBrand() {
  return (
    <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
      <BrandMark />
      <div className="leading-tight">
        <p className="text-sm font-bold tracking-tight text-white">
          {BRAND_NAME}
        </p>
        <p className="text-[11px] text-sidebar-foreground/50">{BRAND_TAGLINE}</p>
      </div>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="space-y-0.5 border-t border-sidebar-border px-3 py-4">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:text-white"
      >
        <Settings className="h-[18px] w-[18px]" aria-hidden="true" />
        Settings
      </button>
      <p className="px-3 pt-2 text-[11px] text-sidebar-foreground/40">
        Data refreshed 12 min ago
      </p>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <SidebarBrand />
      <SidebarNav />
      <SidebarFooter />
    </aside>
  );
}

export function MobileSidebar() {
  const { isMobileOpen, closeMobile } = useSidebar();

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMobile();
    }
    if (isMobileOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMobileOpen, closeMobile]);

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:hidden"
          >
            <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <BrandMark />
                <p className="text-sm font-bold text-white">{BRAND_NAME}</p>
              </div>
              <button
                type="button"
                onClick={closeMobile}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarNav onNavigate={closeMobile} />
            <SidebarFooter />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
