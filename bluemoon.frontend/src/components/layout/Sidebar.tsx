import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  Database,
  BarChart,
  LogOut,
  Home,
  CreditCard,
  UserCog,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);
  }, []);

  const isAdmin = role === "Quản trị viên";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 h-full min-h-screen w-64 bg-sidebar transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
      )}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Sidebar Header */}
        <div className="flex h-16 items-center bg-sidebar-primary px-4">
          <div className="flex items-center gap-3">
            {(isOpen || window.innerWidth >= 768) && (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 overflow-hidden">
                  <img
                    src="/luxury.png"
                    alt="Logo"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                {isOpen && <h1 className="font-bold text-white">BlueMoon</h1>}
              </>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            <NavItem to="/" icon={LayoutDashboard} text="Dashboard" isOpen={isOpen} />

            {isAdmin ? (
              <>
                <NavItem to="/households" icon={Home} text="Quản lý hộ khẩu" isOpen={isOpen} />
                <NavItem to="/residents" icon={Users} text="Quản lý nhân khẩu" isOpen={isOpen} />
                <NavItem to="/fees" icon={Database} text="Quản lý khoản phí" isOpen={isOpen} />
                <NavItem to="/payments" icon={CreditCard} text="Quản lý thu phí" isOpen={isOpen} />
                <NavItem to="/reports" icon={BarChart} text="Thống kê" isOpen={isOpen} />
                <NavItem to="/users" icon={UserCog} text="Quản lý người dùng" isOpen={isOpen} />
              </>
            ) : (
              <>
                <NavItem to="/payments" icon={CreditCard} text="Khoản phí của tôi" isOpen={isOpen} />
                <NavItem to="/profile" icon={Users} text="Thông tin cá nhân" isOpen={isOpen} />
              </>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="mt-6 border-t border-sidebar-border pt-6">
            <NavItem to="/settings" icon={Settings} text="Cài đặt" isOpen={isOpen} />
            <NavItem to="/logout" icon={LogOut} text="Đăng xuất" isOpen={isOpen} />
          </div>
        </nav>

        {/* Version Info */}
        {isOpen && (
          <div className="p-4 text-xs text-sidebar-foreground/70">
            <p>BlueMoon Management v1.0</p>
          </div>
        )}
      </div>
    </aside>
  );
};

const NavItem = ({
  to,
  icon: Icon,
  text,
  isOpen,
}: {
  to: string;
  icon: React.ElementType;
  text: string;
  isOpen: boolean;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center rounded-md px-3 py-2 transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-border"
        )
      }
    >
      <Icon
        className={cn(
          "h-5 w-5 flex-shrink-0",
          isOpen ? "mr-3" : "mx-auto"
        )}
      />
      {isOpen && <span>{text}</span>}
    </NavLink>
  );
};
