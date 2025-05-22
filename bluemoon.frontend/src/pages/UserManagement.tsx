
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreHorizontal, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Mock users data
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    name: 'Administrator',
    role: 'admin',
    status: 'active',
    email: 'admin@bluemoon.com',
    phone: '0901234567',
    createdAt: '2024-03-15',
  },
  {
    id: '2',
    username: 'staff_01',
    name: 'Nguyễn Văn A',
    role: 'staff',
    status: 'active',
    email: 'nguyenvana@example.com',
    phone: '0912345678',
    createdAt: '2024-03-20',
  },
  {
    id: '3',
    username: 'staff_02',
    name: 'Trần Thị B',
    role: 'staff',
    status: 'active',
    email: 'tranthib@example.com',
    phone: '0923456789',
    createdAt: '2024-04-02',
  },
  {
    id: '4',
    username: 'staff_03',
    name: 'Lê Văn C',
    role: 'staff',
    status: 'inactive',
    email: 'levanc@example.com',
    phone: '0934567890',
    createdAt: '2024-04-15',
  },
  {
    id: '5',
    username: 'newuser',
    name: 'Phạm Thị D',
    role: 'staff',
    status: 'pending',
    email: 'phamthid@example.com',
    phone: '0945678901',
    createdAt: '2024-05-10',
  },
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(mockUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    password: '',
    confirmPassword: ''
  });

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  const handleCreateUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu và xác nhận mật khẩu không khớp",
        variant: "destructive"
      });
      return;
    }
    
    const id = (users.length + 1).toString();
    const createdAt = new Date().toISOString().split('T')[0];
    
    const createdUser = {
      id,
      username: newUser.username,
      name: newUser.name,
      role: newUser.role as 'admin' | 'staff',
      status: 'active',
      email: newUser.email,
      phone: newUser.phone,
      createdAt
    };
    
    setUsers([...users, createdUser]);
    setOpenDialog(false);
    toast({
      title: "Thành công",
      description: "Tạo người dùng mới thành công"
    });
    
    // Reset form
    setNewUser({
      username: '',
      name: '',
      email: '',
      phone: '',
      role: 'staff',
      password: '',
      confirmPassword: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const handleRoleChange = (value: string) => {
    setNewUser({
      ...newUser,
      role: value
    });
  };

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    
    const statusText = newStatus === 'active' 
      ? 'kích hoạt' 
      : newStatus === 'inactive' 
        ? 'vô hiệu hóa' 
        : 'chờ xét duyệt';
    
    toast({
      title: "Thành công",
      description: `Đã ${statusText} tài khoản người dùng`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Vô hiệu</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Chờ duyệt</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800">Quản trị viên</Badge>;
      case 'staff':
        return <Badge className="bg-purple-100 text-purple-800">Nhân viên</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý người dùng</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách tài khoản người dùng hệ thống
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-accent">
              <Plus className="mr-2 h-4 w-4" />
              Tạo người dùng mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tạo người dùng mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để tạo tài khoản người dùng mới trong hệ thống.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input 
                    id="username" 
                    name="username"
                    value={newUser.username} 
                    onChange={handleInputChange}
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò</Label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                      <SelectItem value="staff">Nhân viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={newUser.name} 
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email"
                    value={newUser.email} 
                    onChange={handleInputChange}
                    placeholder="Nhập email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={newUser.phone} 
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input 
                    id="password" 
                    name="password"
                    type="password"
                    value={newUser.password} 
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type="password"
                    value={newUser.confirmPassword} 
                    onChange={handleInputChange}
                    placeholder="Xác nhận mật khẩu"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Hủy</Button>
              <Button onClick={handleCreateUser}>Tạo người dùng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>
            Tổng số người dùng: {users.length}
          </CardDescription>
          <div className="flex items-center py-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, tên đăng nhập, email, số điện thoại..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Tên đăng nhập</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast({ title: "Thông báo", description: "Chức năng chỉnh sửa đang phát triển" })}>
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Thông báo", description: "Chức năng đổi mật khẩu đang phát triển" })}>
                          Đổi mật khẩu
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status !== 'active' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                            Kích hoạt
                          </DropdownMenuItem>
                        )}
                        {user.status !== 'inactive' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'inactive')}>
                            <X className="h-4 w-4 mr-2 text-red-600" />
                            Vô hiệu hóa
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;