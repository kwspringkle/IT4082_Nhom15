import { useNavigate } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";
import { Button, Avatar, AvatarFallback } from "@/components/ui/base-components";
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

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
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
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng xuất thất bại');
      }

      localStorage.removeItem('token');
      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi hệ thống BlueMoon",
      });
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Lỗi đăng xuất",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng xuất",
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
        <h2 className="text-lg font-semibold">Quản lý chung cư BlueMoon</h2>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-bluemoon-500 text-white">
                  BQ
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </DropdownMenuItem>
            <DropdownMenuItem>Đổi mật khẩu</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};