import { useState, useEffect, useCallback } from "react";
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
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ViewResidentDialog from "@/components/dialogs/ViewResidentDialog";
import { toast } from "@/components/ui/use-toast";

// Định nghĩa interface
interface Resident {
  _id: string;
  name: string;
  citizenId: string;
  gender: "Nam" | "Nữ" | "Khác";
  dob: string;
  relation: string;
  householdId: string;
  status?: "TEMPORARY_RESIDENCE" | "TEMPORARY_ABSENT" | "PERMANENT";
}

interface Household {
  _id: string;
  apartment: string;
}

interface CitizenHistory {
  changeType: "UPDATE_INFO" | "TEMPORARY_ABSENT" | "TEMPORARY_RESIDENCE" | "DELETE" | "OTHER";
  changedAt: string;
}

// Component AddResidentDialog
const AddResidentDialog = ({
  onAddResident,
  households,
  children,
}: {
  onAddResident: (resident: {
    name: string;
    citizenId: string;
    gender: "Nam" | "Nữ" | "Khác";
    dob: string;
    relation: string;
    householdId: string;
  }) => Promise<void>;
  households: Household[];
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    citizenId: "",
    gender: "Nam" as "Nam" | "Nữ" | "Khác",
    dob: "",
    relation: "",
    householdId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.citizenId ||
      !formData.gender ||
      !formData.dob ||
      !formData.relation ||
      !formData.householdId
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng cung cấp đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }
    if (!/^\d{12}$/.test(formData.citizenId)) {
      toast({
        title: "Lỗi",
        description: "Căn cước công dân phải là 12 số",
        variant: "destructive",
      });
      return;
    }
    const dobDate = new Date(formData.dob);
    if (dobDate > new Date()) {
      toast({
        title: "Lỗi",
        description: "Ngày sinh không thể là ngày trong tương lai",
        variant: "destructive",
      });
      return;
    }
    // Kiểm tra citizenId trùng lặp
    try {
      const response = await fetch(`http://localhost:3000/api/citizens?citizenId=${formData.citizenId}`);
      const data = await response.json();
      if (data?.data?.length > 0) {
        toast({
          title: "Lỗi",
          description: "Căn cước công dân đã được đăng ký",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      console.warn("Error checking citizenId:", error);
    }

    setIsLoading(true);
    try {
      await onAddResident({
        ...formData,
        dob: dobDate.toISOString(),
      });
      setOpen(false);
      setFormData({
        name: "",
        citizenId: "",
        gender: "Nam",
        dob: "",
        relation: "",
        householdId: "",
      });
      toast({
        title: "Thành công",
        description: `Đã thêm nhân khẩu ${formData.name}`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm nhân khẩu",
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
          <DialogTitle>Thêm nhân khẩu mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Họ tên</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Căn cước công dân</Label>
            <Input
              value={formData.citizenId}
              onChange={(e) => setFormData({ ...formData, citizenId: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Giới tính</Label>
            <Select
              value={formData.gender}
              onValueChange={(value: "Nam" | "Nữ" | "Khác") =>
                setFormData({ ...formData, gender: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nam">Nam</SelectItem>
                <SelectItem value="Nữ">Nữ</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ngày sinh</Label>
            <Input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Quan hệ với chủ hộ</Label>
            <Input
              value={formData.relation}
              onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Căn hộ</Label>
            <Select
              value={formData.householdId}
              onValueChange={(value) => setFormData({ ...formData, householdId: value })}
              disabled={isLoading || !households.length}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn căn hộ" />
              </SelectTrigger>
              <SelectContent>
                {households.map((household) => (
                  <SelectItem key={household._id} value={household._id}>
                    {household.apartment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading || !households.length}>
            {isLoading ? "Đang xử lý..." : "Thêm nhân khẩu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Component EditResidentDialog
const EditResidentDialog = ({
  resident,
  onUpdateResident,
  households,
  children,
}: {
  resident: Resident | null;
  onUpdateResident: (resident: {
    name: string;
    citizenId: string;
    gender: "Nam" | "Nữ" | "Khác";
    dob: string;
    relation: string;
    householdId: string;
  }) => Promise<void>;
  households: Household[];
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: resident?.name ?? "",
    citizenId: resident?.citizenId ?? "",
    gender: resident?.gender ?? "Nam" as "Nam" | "Nữ" | "Khác",
    dob: resident?.dob ? new Date(resident.dob).toISOString().split("T")[0] : "",
    relation: resident?.relation ?? "",
    householdId: resident?.householdId ?? "",
  });

  useEffect(() => {
    if (resident) {
      setFormData({
        name: resident.name ?? "",
        citizenId: resident.citizenId ?? "",
        gender: resident.gender ?? "Nam",
        dob: resident.dob ? new Date(resident.dob).toISOString().split("T")[0] : "",
        relation: resident.relation ?? "",
        householdId: resident.householdId ?? "",
      });
    }
  }, [resident]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.citizenId ||
      !formData.gender ||
      !formData.dob ||
      !formData.relation ||
      !formData.householdId
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng cung cấp đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }
    if (!/^\d{12}$/.test(formData.citizenId)) {
      toast({
        title: "Lỗi",
        description: "Căn cước công dân phải là 12 số",
        variant: "destructive",
      });
      return;
    }
    const dobDate = new Date(formData.dob);
    if (dobDate > new Date()) {
      toast({
        title: "Lỗi",
        description: "Ngày sinh không thể là ngày trong tương lai",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await onUpdateResident({
        ...formData,
        dob: dobDate.toISOString(),
      });
      setOpen(false);
      toast({
        title: "Thành công",
        description: `Đã cập nhật nhân khẩu ${formData.name}`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật nhân khẩu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!resident) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa thông tin nhân khẩu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Họ tên</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Căn cước công dân</Label>
            <Input
              value={formData.citizenId}
              onChange={(e) => setFormData({ ...formData, citizenId: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Giới tính</Label>
            <Select
              value={formData.gender}
              onValueChange={(value: "Nam" | "Nữ" | "Khác") =>
                setFormData({ ...formData, gender: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nam">Nam</SelectItem>
                <SelectItem value="Nữ">Nữ</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ngày sinh</Label>
            <Input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Quan hệ với chủ hộ</Label>
            <Input
              value={formData.relation}
              onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Căn hộ</Label>
            <Select
              value={formData.householdId}
              onValueChange={(value) => setFormData({ ...formData, householdId: value })}
              disabled={isLoading || !households.length}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn căn hộ" />
              </SelectTrigger>
              <SelectContent>
                {households.map((household) => (
                  <SelectItem key={household._id} value={household._id}>
                    {household.apartment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading || !households.length}>
            {isLoading ? "Đang xử lý..." : "Cập nhật nhân khẩu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
const ResidentList = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Lấy token từ localStorage
  const getAuthToken = () => localStorage.getItem("token");

  // Fetch households and residents
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch households
        const householdResponse = await fetch("http://localhost:3000/api/households", {
          headers: { "Content-Type": "application/json" },
        });
        if (!householdResponse.ok) throw new Error(`HTTP error! Status: ${householdResponse.status}`);
        const householdData = await householdResponse.json();
        console.log("Fetched households:", householdData);
        const householdsArray = Array.isArray(householdData) ? householdData : householdData?.data || [];
        setHouseholds(householdsArray);

        // Fetch residents
        const response = await fetch("http://localhost:3000/api/citizens", {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const residentsData = await response.json();
        console.log("Fetched residents:", residentsData);
        if (!Array.isArray(residentsData)) throw new Error("Dữ liệu nhân khẩu không hợp lệ");

        const residentsWithStatus = await Promise.all(
          residentsData.map(async (resident: Resident) => {
            try {
              const historyResponse = await fetch(`http://localhost:3000/api/citizens/${resident._id}/history`, {
                headers: { "Content-Type": "application/json" },
              });
              if (!historyResponse.ok) {
                console.warn(`History not found for citizen ID: ${resident._id}`);
                return { ...resident, status: "PERMANENT" as const };
              }
              const historyData = await historyResponse.json();
              console.log(`History for resident ${resident._id}:`, historyData);
              if (!historyData?.data || !Array.isArray(historyData.data) || historyData.data.length === 0) {
                return { ...resident, status: "PERMANENT" as const };
              }

              const latestHistory: CitizenHistory = historyData.data.sort(
                (a: CitizenHistory, b: CitizenHistory) =>
                  new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
              )[0];

              const status: Resident["status"] =
                latestHistory.changeType === "TEMPORARY_RESIDENCE"
                  ? "TEMPORARY_RESIDENCE"
                  : latestHistory.changeType === "TEMPORARY_ABSENT"
                  ? "TEMPORARY_ABSENT"
                  : "PERMANENT";

              return { ...resident, status };
            } catch (error: any) {
              console.warn(`Error fetching history for citizen ID: ${resident._id}`, error.message);
              return { ...resident, status: "PERMANENT" as const };
            }
          })
        );

        setResidents(residentsWithStatus);
      } catch (error: any) {
        console.error("Fetch data error:", error);
        toast({
          title: "Lỗi",
          description: error.message || "Không thể tải dữ liệu",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredResidents = residents.filter((resident) => {
    const name = resident?.name?.toLowerCase() || "";
    const citizenId = resident?.citizenId || "";
    const apartment = households.find((h) => h._id === resident.householdId)?.apartment || "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      citizenId.includes(searchTerm) ||
      apartment.includes(searchTerm)
    );
  });

  const getHouseholdApartment = useCallback((householdId: string): string => {
    const household = households.find((h) => h._id === householdId);
    return household?.apartment || "N/A";
  }, [households]);

  const getStatusBadge = useCallback((status?: string) => {
    switch (status) {
      case "TEMPORARY_RESIDENCE":
        return <Badge className="bg-blue-100 text-blue-800">Tạm trú</Badge>;
      case "TEMPORARY_ABSENT":
        return <Badge className="bg-yellow-100 text-yellow-800">Tạm vắng</Badge>;
      case "PERMANENT":
      default:
        return <Badge className="bg-green-100 text-green-800">Thường trú</Badge>;
    }
  }, []);

  const handleDelete = async (residentId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhân khẩu này?")) return;

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
      const response = await fetch(`http://localhost:3000/api/citizens/${residentId}`, {
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
      setResidents(residents.filter((resident) => resident._id !== residentId));
      toast({
        title: "Thành công",
        description: "Đã xóa nhân khẩu",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Delete resident error:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa nhân khẩu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý nhân khẩu</h1>
          <p className="text-muted-foreground">Quản lý thông tin nhân khẩu trong chung cư BlueMoon</p>
        </div>
        <AddResidentDialog
          households={households}
          onAddResident={async (newResident) => {
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
              const response = await fetch("http://localhost:3000/api/citizens", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newResident),
              });
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
              }
              const data = await response.json();
              console.log("Add resident response:", data);
              setResidents([...residents, { ...data?.data, status: "PERMANENT" as const }]);
              toast({
                title: "Thành công",
                description: `Đã thêm nhân khẩu ${data?.data?.name || "Unknown"}`,
                variant: "default",
              });
            } catch (error: any) {
              console.error("Add resident error:", error);
              toast({
                title: "Lỗi",
                description: error.message || "Không thể thêm nhân khẩu",
                variant: "destructive",
              });
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <Button className="bg-blue-500 text-white hover:bg-blue-600" disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm nhân khẩu mới
          </Button>
        </AddResidentDialog>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Danh sách nhân khẩu</CardTitle>
          <CardDescription>Tổng số nhân khẩu: {residents.length}</CardDescription>
          <div className="flex items-center py-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, căn cước, căn hộ..."
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Căn cước</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Ngày sinh</TableHead>
                  <TableHead>Căn hộ</TableHead>
                  <TableHead>Quan hệ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResidents.map((resident) => (
                  <TableRow key={resident._id}>
                    <TableCell className="font-medium">{resident.name || "N/A"}</TableCell>
                    <TableCell>{resident.citizenId || "N/A"}</TableCell>
                    <TableCell>{resident.gender || "N/A"}</TableCell>
                    <TableCell>
                      {resident.dob ? new Date(resident.dob).toLocaleDateString("vi-VN") : "N/A"}
                    </TableCell>
                    <TableCell>{getHouseholdApartment(resident.householdId)}</TableCell>
                    <TableCell>{resident.relation || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(resident.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={isLoading}>
                            <MoreHorizontal className="h-4 w-4"/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <ViewResidentDialog resident={resident} key={`view-${resident._id}`}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} key={`view-item-${resident._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                          </ViewResidentDialog>
                          <EditResidentDialog
                            resident={resident}
                            households={households}
                            onUpdateResident={async (updatedResident) => {
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
                                const response = await fetch(`http://localhost:3000/api/citizens/${resident._id}`, {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify(updatedResident),
                                });
                                if (!response.ok) {
                                  const errorData = await response.json();
                                  throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
                                }
                                const data = await response.json();
                                console.log("Update resident response:", data);
                                setResidents(
                                  residents.map((r) =>
                                    r._id === resident._id ? { ...data?.data, status: resident.status } : r
                                  )
                                );
                                toast({
                                  title: "Thành công",
                                  description: `Đã cập nhật nhân khẩu ${data?.data?.name || "Unknown"}`,
                                  variant: "default",
                                });
                              } catch (error: any) {
                                console.error("Update resident error:", error);
                                toast({
                                  title: "Lỗi",
                                  description: error.message || "Không thể cập nhật nhân khẩu",
                                  variant: "destructive",
                                });
                              } finally {
                                setIsLoading(false);
                              }
                            }}
                            key={`edit-${resident._id}`}
                          >
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} key={`edit-item-${resident._id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Sửa thông tin
                            </DropdownMenuItem>
                          </EditResidentDialog>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(resident._id)}
                            key={`delete-${resident._id}`}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa nhân khẩu
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentList;