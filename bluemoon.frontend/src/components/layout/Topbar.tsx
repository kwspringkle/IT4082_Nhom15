import { useNavigate } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";

// Import from our consolidated UI components file
import { Button } from "@/components/ui/base-components";
import { Avatar, AvatarFallback } from "@/components/ui/base-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const TopBar = ({ sidebarOpen, setSidebarOpen }: TopBarProps) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    navigate("/login");
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
