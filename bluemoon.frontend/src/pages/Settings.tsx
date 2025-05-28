import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "../hooks/use-toast";
import { User, Lock, AlertTriangle } from "lucide-react";

const Settings = () => {
  const [profileData, setProfileData] = useState({
    username: "admin",
    email: "admin@bluemoon.com",
    fullName: "Quản trị viên BlueMoon",
    phoneNumber: "0123456789",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast({
      title: "Cập nhật thành công",
      description: "Thông tin hồ sơ đã được cập nhật",
    });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Đổi mật khẩu thành công",
      description: "Mật khẩu của bạn đã được thay đổi",
    });
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleAccountDeactivation = () => {
    toast({
      title: "Tài khoản đã bị vô hiệu hóa",
      description: "Tài khoản của bạn sẽ được vô hiệu hóa trong 24 giờ",
      variant: "destructive",
    });
    setDeactivateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Cài đặt tài khoản</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin cá nhân và cài đặt bảo mật
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin hồ sơ
          </CardTitle>
          <CardDescription>
            Cập nhật thông tin cá nhân của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="fullName">Họ tên</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input
                  id="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                />
              </div>
            </div>
            <Button type="submit">Cập nhật thông tin</Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Đổi mật khẩu
          </CardTitle>
          <CardDescription>
            Thay đổi mật khẩu để bảo mật tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
              />
            </div>
            <Button type="submit">Đổi mật khẩu</Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Deactivation */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Vô hiệu hóa tài khoản
          </CardTitle>
          <CardDescription>
            Tạm thời vô hiệu hóa tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Khi vô hiệu hóa tài khoản, bạn sẽ không thể đăng nhập vào hệ thống. 
            Tài khoản có thể được kích hoạt lại bởi quản trị viên cấp cao.
          </p>
          <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Vô hiệu hóa tài khoản</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận vô hiệu hóa tài khoản</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>Bạn có chắc chắn muốn vô hiệu hóa tài khoản của mình không?</p>
                <p className="text-sm text-muted-foreground">
                  Hành động này sẽ khiến bạn không thể đăng nhập vào hệ thống. 
                  Để kích hoạt lại tài khoản, bạn cần liên hệ với quản trị viên cấp cao.
                </p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setDeactivateDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button variant="destructive" onClick={handleAccountDeactivation}>
                    Xác nhận vô hiệu hóa
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
