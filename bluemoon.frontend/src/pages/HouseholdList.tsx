import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import ViewHouseholdMembersDialog from "@/components/dialogs/ViewHouseholdMembersDialog";
import { toast } from "@/hooks/use-toast";

// Định nghĩa interface cho Household
interface Household {
  _id: string;
  apartment?: string;
  floor?: number;
  area?: number;
  head?: string;
  phone?: string;
  members?: number;
  userId?: string;
}

// Component AddHouseholdDialog
const AddHouseholdDialog = ({
  onAddHousehold,
  children,
}: {
  onAddHousehold: (household: {
    apartment: string;
    floor: number;
    area: number;
    head: string;
    phone: string;
    members: number;
  }) => Promise<void>;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    apartment: "",
    floor: "",
    area: "",
    head: "",
    phone: "",
    members: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.apartment ||
      !formData.floor ||
      !formData.area ||
      !formData.head ||
      !formData.phone ||
      !formData.members
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }
    const floor = parseInt(formData.floor);
    const area = parseFloat(formData.area);
    const members = parseInt(formData.members);
    if (isNaN(floor) || floor <= 0) {
      toast({
        title: "Lỗi",
        description: "Tầng phải là số dương",
        variant: "destructive",
      });
      return;
    }
    if (isNaN(area) || area <= 0) {
      toast({
        title: "Lỗi",
        description: "Diện tích phải là số dương",
        variant: "destructive",
      });
      return;
    }
    if (isNaN(members) || members < 0) {
      toast({
        title: "Lỗi",
        description: "Số thành viên phải là số không âm",
        variant: "destructive",
      });
      return;
    }
    if (!/^[0][0-9]{9}$/.test(formData.phone)) {
      toast({
        title: "Lỗi",
        description: "Số điện thoại phải là 10 số, bắt đầu bằng 0",
        variant: "destructive",
      });
      return;
    }
    if (!/^[0-9A-Za-z-]+$/.test(formData.apartment)) {
      toast({
        title: "Lỗi",
        description: "Số căn hộ chỉ chứa chữ, số hoặc dấu gạch ngang",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await onAddHousehold({
        apartment: formData.apartment,
        floor,
        area,
        head: formData.head,
        phone: formData.phone,
        members,
      });
      setOpen(false);
      setFormData({
        apartment: "",
        floor: "",
        area: "",
        head: "",
        phone: "",
        members: "",
      });
      toast({
        title: "Thành công",
        description: `Đã thêm hộ khẩu ${formData.apartment}`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm hộ khẩu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm hộ khẩu mới</DialogTitle>
          <DialogDescription>Nhập thông tin hộ khẩu để thêm vào hệ thống.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Số căn hộ</Label>
            <Input
              value={formData.apartment}
              onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Tầng</Label>
            <Input
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Diện tích (m²)</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Chủ hộ</Label>
            <Input
              value={formData.head}
              onChange={(e) => setFormData({ ...formData, head: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Số điện thoại</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Số thành viên</Label>
            <Input
              type="number"
              value={formData.members}
              onChange={(e) => setFormData({ ...formData, members: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Thêm hộ khẩu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Component EditHouseholdDialog
const EditHouseholdDialog = ({
  household,
  onUpdateHousehold,
  children,
}: {
  household: Household;
  onUpdateHousehold: (household: {
    apartment: string;
    floor: number;
    area: number;
    head: string;
    phone: string;
    members: number;
  }) => Promise<void>;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    apartment: household.apartment || "",
    floor: household.floor?.toString() || "",
    area: household.area?.toString() || "",
    head: household.head || "",
    phone: household.phone || "",
    members: household.members?.toString() || "",
  });

  useEffect(() => {
    setFormData({
      apartment: household.apartment || "",
      floor: household.floor?.toString() || "",
      area: household.area?.toString() || "",
      head: household.head || "",
      phone: household.phone || "",
      members: household.members?.toString() || "",
    });
  }, [household]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.apartment ||
      !formData.floor ||
      !formData.area ||
      !formData.head ||
      !formData.phone ||
      !formData.members
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }
    const floor = parseInt(formData.floor);
    const area = parseFloat(formData.area);
    const members = parseInt(formData.members);
    if (isNaN(floor) || floor <= 0) {
      toast({
        title: "Lỗi",
        description: "Tầng phải là số dương",
        variant: "destructive",
      });
      return;
    }
    if (isNaN(area) || area <= 0) {
      toast({
        title: "Lỗi",
        description: "Diện tích phải là số dương",
        variant: "destructive",
      });
      return;
    }
    if (isNaN(members) || members < 0) {
      toast({
        title: "Lỗi",
        description: "Số thành viên phải là số không âm",
        variant: "destructive",
      });
      return;
    }
    if (!/^[0][0-9]{9}$/.test(formData.phone)) {
      toast({
        title: "Lỗi",
        description: "Số điện thoại phải là 10 số, bắt đầu bằng 0",
        variant: "destructive",
      });
      return;
    }
    if (!/^[0-9A-Za-z-]+$/.test(formData.apartment)) {
      toast({
        title: "Lỗi",
        description: "Số căn hộ chỉ chứa chữ, số hoặc dấu gạch ngang",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await onUpdateHousehold({
        apartment: formData.apartment,
        floor,
        area,
        head: formData.head,
        phone: formData.phone,
        members,
      });
      setOpen(false);
      toast({
        title: "Thành công",
        description: `Đã cập nhật hộ khẩu ${formData.apartment}`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật hộ khẩu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa thông tin hộ khẩu</DialogTitle>
          <DialogDescription>Cập nhật thông tin hộ khẩu trong hệ thống.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Số căn hộ</Label>
            <Input
              value={formData.apartment}
              onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Tầng</Label>
            <Input
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Diện tích (m²)</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Chủ hộ</Label>
            <Input
              value={formData.head}
              onChange={(e) => setFormData({ ...formData, head: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Số điện thoại</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Số thành viên</Label>
            <Input
              type="number"
              value={formData.members}
              onChange={(e) => setFormData({ ...formData, members: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Cập nhật hộ khẩu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
const HouseholdList = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openHouseholdId, setOpenHouseholdId] = useState<string | null>(null);

  // Lấy token từ localStorage
  const getAuthToken = () => localStorage.getItem("token");

  // Fetch households
  useEffect(() => {
    const fetchHouseholds = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch("http://localhost:3000/api/households", {
          headers,
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched households:", data);
        const householdsData = Array.isArray(data) ? data : data?.data || [];
        if (!Array.isArray(householdsData)) throw new Error("Dữ liệu hộ khẩu không hợp lệ");
        // Validate households data
        const validHouseholds = householdsData.filter((household: Household) => {
          if (!household._id) {
            console.warn("Invalid household, missing _id:", household);
            return false;
          }
          return true;
        });
        setHouseholds(validHouseholds);
      } catch (error: any) {
        console.error("Fetch households error:", error);
        toast({
          title: "Lỗi",
          description: error.message || "Không thể tải danh sách hộ khẩu",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchHouseholds();
  }, []);

  const filteredHouseholds = households.filter((household) => {
    const apartment = household.apartment || "";
    const head = household.head || "";
    const phone = household.phone || "";
    return (
      apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      head.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm)
    );
  });

  const handleDelete = async (householdId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa hộ khẩu này?")) return;

    const token = getAuthToken();
    if (!token) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để thực hiện thao tác này",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/api/households/${householdId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
      }
      setHouseholds(households.filter((household) => household._id !== householdId));
      toast({
        title: "Thành công",
        description: "Đã xóa hộ khẩu",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Delete household error:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa hộ khẩu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Debugging log for openHouseholdId
  console.log("openHouseholdId:", openHouseholdId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý hộ khẩu</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin hộ khẩu trong chung cư BlueMoon
          </p>
        </div>
        <AddHouseholdDialog
          onAddHousehold={async (newHousehold) => {
            const token = getAuthToken();
            if (!token) {
              toast({
                title: "Lỗi",
                description: "Vui lòng đăng nhập để thực hiện thao tác này",
                variant: "destructive",
              });
              return;
            }

            try {
              setIsLoading(true);
              const response = await fetch("http://localhost:3000/api/households", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newHousehold),
              });
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
              }
              const data = await response.json();
              console.log("Add household response:", data);
              setHouseholds([...households, data?.data]);
              toast({
                title: "Thành công",
                description: `Đã thêm hộ khẩu ${data?.data?.apartment || "Unknown"}`,
                variant: "default",
              });
            } catch (error: any) {
              console.error("Add household error:", error);
              toast({
                title: "Lỗi",
                description: error.message || "Không thể thêm hộ khẩu",
                variant: "destructive",
              });
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <Button className="bg-blue-500 text-white hover:bg-blue-600" disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm hộ mới
          </Button>
        </AddHouseholdDialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách hộ khẩu</CardTitle>
          <CardDescription>Tổng số hộ khẩu: {households.length}</CardDescription>
          <div className="flex items-center py-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo căn hộ, chủ hộ, số điện thoại..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center">Đang tải...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Căn hộ</TableHead>
                    <TableHead>Tầng</TableHead>
                    <TableHead>Diện tích (m²)</TableHead>
                    <TableHead>Chủ hộ</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Số thành viên</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHouseholds.map((household) => (
                    <TableRow key={household._id}>
                      <TableCell className="font-medium">{household.apartment || "N/A"}</TableCell>
                      <TableCell>{household.floor ?? "N/A"}</TableCell>
                      <TableCell>{household.area ?? "N/A"}</TableCell>
                      <TableCell>{household.head || "N/A"}</TableCell>
                      <TableCell>{household.phone || "N/A"}</TableCell>
                      <TableCell>{household.members ?? 0}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={isLoading}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                console.log(`Opening ViewHouseholdMembersDialog for householdId: ${household._id}, apartment: ${household.apartment}`);
                                setOpenHouseholdId(household._id);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem thành viên
                            </DropdownMenuItem>
                            <EditHouseholdDialog
                              household={household}
                              onUpdateHousehold={async (updatedHousehold) => {
                                const token = getAuthToken();
                                if (!token) {
                                  toast({
                                    title: "Lỗi",
                                    description: "Vui lòng đăng nhập để thực hiện thao tác này",
                                    variant: "destructive",
                                  });
                                  return;
                                }

                                try {
                                  setIsLoading(true);
                                  const response = await fetch(
                                    `http://localhost:3000/api/households/${household._id}`,
                                    {
                                      method: "PUT",
                                      headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                      },
                                      body: JSON.stringify(updatedHousehold),
                                    }
                                  );
                                  if (!response.ok) {
                                    const errorData = await response.json();
                                    throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
                                  }
                                  const data = await response.json();
                                  console.log("Update household response:", data);
                                  setHouseholds(
                                    households.map((h) =>
                                      h._id === household._id ? data?.data : h
                                    )
                                  );
                                  toast({
                                    title: "Thành công",
                                    description: `Đã cập nhật hộ khẩu ${data?.data?.apartment || "Unknown"}`,
                                    variant: "default",
                                  });
                                } catch (error: any) {
                                  console.error("Update household error:", error);
                                  toast({
                                    title: "Lỗi",
                                    description: error.message || "Không thể cập nhật hộ khẩu",
                                    variant: "destructive",
                                  });
                                } finally {
                                  setIsLoading(false);
                                }
                              }}
                            >
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="mr-2 h-4 w-4" />
                                Sửa thông tin
                              </DropdownMenuItem>
                            </EditHouseholdDialog>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(household._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa hộ khẩu
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {openHouseholdId && (
                <ViewHouseholdMembersDialog
                  key={`view-dialog-${openHouseholdId}`}
                  householdId={openHouseholdId}
                  apartmentNumber={
                    households.find((h) => h._id === openHouseholdId)?.apartment || "Unknown"
                  }
                  open={!!openHouseholdId}
                  onOpenChange={(open) => {
                    if (!open) setOpenHouseholdId(null);
                  }}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HouseholdList;

