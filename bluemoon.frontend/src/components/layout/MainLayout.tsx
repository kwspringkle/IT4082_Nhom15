import React from "react";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";
import { TopBar } from "./Topbar.tsx";

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div 
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 bg-background p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Helper function to combine class names
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
