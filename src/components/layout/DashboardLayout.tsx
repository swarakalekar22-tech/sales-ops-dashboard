import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar, MobileSidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SidebarProvider } from "@/components/layout/SidebarContext";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Executive overview",
    description: "Sales and operations performance across India",
  },
  "/sales": {
    title: "Sales",
    description: "Pipeline, revenue, and rep performance",
  },
  "/operations": {
    title: "Operations",
    description: "Fulfillment health and order status",
  },
  "/reports": {
    title: "Reports",
    description: "Saved and scheduled reports",
  },
};

export function DashboardLayout() {
  const { pathname } = useLocation();
  const meta = pageMeta[pathname] ?? {
    title: "Dashboard",
    description: undefined,
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background bg-ambient-glow">
        <Sidebar />
        <MobileSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header title={meta.title} description={meta.description} />
          <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto w-full max-w-[1400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
