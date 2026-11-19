import * as React from "react";

interface SidebarContextValue {
  isMobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined
);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const value = React.useMemo(
    () => ({
      isMobileOpen,
      openMobile: () => setIsMobileOpen(true),
      closeMobile: () => setIsMobileOpen(false),
    }),
    [isMobileOpen]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider");
  return ctx;
}
