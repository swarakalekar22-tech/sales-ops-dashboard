import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Sales from "@/pages/Sales";
import Operations from "@/pages/Operations";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";
import SignedOut from "@/pages/SignedOut";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/signed-out" element={<SignedOut />} />
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/operations" element={<Operations />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
