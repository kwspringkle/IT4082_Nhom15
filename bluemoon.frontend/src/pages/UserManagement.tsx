import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreHorizontal, Check, X, Trash2} from "lucide-react";
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
  DialogTrigger,
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

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    fullname: '',
    email: '',
    phone: '',
    role: 'Nhân viên',
    password: '',
    confirmPassword: '',
  });
  const [editUser, setEditUser] = useState({
    id: '',
    username: '',
    fullname: '',
    email: '',
    phone: '',
    role: 'Nhân viên',
  });

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/accounts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Không thể lấy danh sách người dùng');
      }
      setUsers(data); // Giả sử API trả về mảng users
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi khi lấy danh sách người dùng",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  const handleCreateUser = async () => {
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu và xác nhận mật khẩu không khớp",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          username: newUser.username,
          fullname: newUser.fullname,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          password: newUser.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Tạo người dùng thất bại');
      }

      setUsers([...users, data]); // Thêm user mới vào danh sách
      setOpenCreateDialog(false);
      toast({
        title: "Thành công",
        description: "Tạo người dùng mới thành công",
      });

      // Reset form
      setNewUser({
        username: '',
        fullname: '',
        email: '',
        phone: '',
        role: 'Nhân viên',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi khi tạo người dùng",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/accounts/${editUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          username: editUser.username,
          fullname: editUser.fullname,
          email: editUser.email,
          phone: editUser.phone,
          role: editUser.role,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Cập nhật người dùng thất bại');
      }

      setUsers(users.map(user => user._id === editUser.id ? data : user));
      setOpenEditDialog(false);
      toast({
        title: "Thành công",
        description: "Cập nhật người dùng thành công",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi khi cập nhật người dùng",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (userId, action) => {
    const endpoint = action === 'lock' 
      ? `http://localhost:3000/api/accounts/${userId}/lock`
      : `http://localhost:3000/api/accounts/${userId}/unlock`;

    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Không thể ${action === 'lock' ? 'khóa' : 'mở khóa'} tài khoản`);
      }

      setUsers(users.map(user => user._id === userId ? { ...user, status: action === 'lock' ? 'inactive' : 'active' } : user));
      toast({
        title: "Thành công",
        description: `Đã ${action === 'lock' ? 'khóa' : 'mở khóa'} tài khoản`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || `Có lỗi khi ${action === 'lock' ? 'khóa' : 'mở khóa'} tài khoản`,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'create') {
      setNewUser({ ...newUser, [name]: value });
    } else {
      setEditUser({ ...editUser, [name]: value });
    }
  };

  const handleRoleChange = (value, type) => {
    if (type === 'create') {
      setNewUser({ ...newUser, role: value });
    } else {
      setEditUser({ ...editUser, role: value });
    }
  };

  const handleOpenEditDialog = (user) => {
    setEditUser({
      id: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setOpenEditDialog(true);
  };

  const getStatusBadge = (status) => {
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

  const getRoleBadge = (user) => {
    switch (user.role) {
      case 'Quản trị viên':
        return <Badge className="bg-blue-100 text-blue-800">Quản trị viên</Badge>;
      case 'Nhân viên':
        return <Badge className="bg-purple-100 text-purple-800">Nhân viên</Badge>;
      default:
        return <Badge>{user.role}</Badge>;
    }
  };
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/accounts/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Xóa người dùng thất bại');
      }

      setUsers(users.filter(user => user._id !== userId));
      toast({
        title: "Thành công",
        description: "Xóa người dùng thành công",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi khi xóa người dùng",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý người dùng</h1>
          <p className="text-muted-foreground">
            Quản trị danh sách tài khoản người dùng hệ thống
          </p>
        </div>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600">
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
                    onChange={(e) => handleInputChange(e, 'create')}
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => handleRoleChange(value, 'create')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quản trị viên">Quản trị viên</SelectItem>
                      <SelectItem value="Nhân viên">Nhân viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullname">Họ và tên</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  value={newUser.fullname}
                  onChange={(e) => handleInputChange(e, 'create')}
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
                    onChange={(e) => handleInputChange(e, 'create')}
                    placeholder="Nhập email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newUser.phone}
                    onChange={(e) => handleInputChange(e, 'create')}
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
                    onChange={(e) => handleInputChange(e, 'create')}
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
                    onChange={(e) => handleInputChange(e, 'create')}
                    placeholder="Xác nhận mật khẩu"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>Hủy</Button>
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
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.fullname}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{getRoleBadge(user)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(user)}>
                          Chỉnh sửa
                        </DropdownMenuItem>
                        {user.status !== 'active' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(user._id, 'unlock')}>
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                            Kích hoạt
                          </DropdownMenuItem>
                        )}
                        {user.status !== 'inactive' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(user._id, 'lock')}>
                            <X className="h-4 w-4 mr-2 text-red-600" />
                            Vô hiệu hóa
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDeleteUser(user._id)}>
                          <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog chỉnh sửa người dùng */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin tài khoản người dùng trong hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Tên đăng nhập</Label>
                <Input
                  id="edit-username"
                  name="username"
                  value={editUser.username}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Vai trò</Label>
                <Select
                  value={editUser.role}
                  onValueChange={(value) => handleRoleChange(value, 'edit')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quản trị viên">Quản trị viên</SelectItem>
                    <SelectItem value="Nhân viên">Nhân viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fullname">Họ và tên</Label>
              <Input
                id="edit-fullname"
                name="fullname"
                value={editUser.fullname}
                onChange={(e) => handleInputChange(e, 'edit')}
                placeholder="Nhập họ và tên"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editUser.email}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  placeholder="Nhập email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Số điện thoại</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={editUser.phone}
                  onChange={(e) => handleInputChange(e, 'edit')}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>Hủy</Button>
            <Button onClick={handleEditUser}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;