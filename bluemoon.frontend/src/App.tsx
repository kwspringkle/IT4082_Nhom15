import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

// Import pages
import Dashboard from "@/pages/Dashboard";
import HouseholdList from "@/pages/HouseholdList";
import ResidentList from "@/pages/ResidentList";
import FeeList from "@/pages/FeeList";
import PaymentList from "@/pages/PaymentList";
import ReportPage from "@/pages/ReportPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UserManagement from "@/pages/UserManagement";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/households" element={<HouseholdList />} />
            <Route path="/residents" element={<ResidentList />} />
            <Route path="/fees" element={<FeeList />} />
            <Route path="/payments" element={<PaymentList />} />
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Navigate to="/login" replace />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
