import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";
import { Button, Avatar } from "@/components/ui/base-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface TopBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const TopBar = ({ sidebarOpen, setSidebarOpen }: TopBarProps) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("fullname") || "";
    const storedRole = localStorage.getItem("role") || "";
    setUsername(storedUsername);
    setRole(storedRole);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Không có phiên đăng nhập",
        description: "Bạn chưa đăng nhập.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng xuất thất bại");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("fullName");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi hệ thống BlueMoon",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Lỗi đăng xuất",
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi đăng xuất",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="flex h-16 items-center border-b bg-card px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:mr-4"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="flex-1">
        <h2 className="text-lg font-semibold">Chung cư BlueMoon</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Hiển thị role - username */}
        <span className="text-sm font-medium text-muted-foreground">
          {role && username ? `${role} - ${username}` : username}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden">
              <Avatar className="h-9 w-9">
                <img
                  src="/user.png"
                  alt="User Avatar"
                  className="h-9 w-9 object-cover rounded-full"
                />
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Đổi mật khẩu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
