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
import { Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AddResidentDialog } from "../components/AddResidentDialog";
import { EditResidentDialog } from "../components/EditResidentDialog";
import ViewResidentDialog from "@/components/dialogs/ViewResidentDialog";
import { Resident, Household } from "../types";
import { getStatusBadge, getAuthToken } from "../utils/residentUtils";

const ResidentList = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const fetchData = useCallback(async () => {
  setIsLoading(true);
  try {
    // Lấy danh sách hộ khẩu
    const householdResponse = await fetch("http://localhost:3000/api/households", {
      headers: { "Content-Type": "application/json" },
    });
    if (!householdResponse.ok) throw new Error(`HTTP error! Status: ${householdResponse.status}`);
    const householdData = await householdResponse.json();
    const householdsArray = Array.isArray(householdData) ? householdData : householdData?.data || [];
    setHouseholds(householdsArray);

    // Lấy danh sách nhân khẩu
    const response = await fetch("http://localhost:3000/api/citizens", {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const residentsData = await response.json();
    if (!Array.isArray(residentsData)) throw new Error("Dữ liệu nhân khẩu không hợp lệ");

    // Kiểm tra và log dữ liệu từ backend để debug
    console.log("Raw residents data from backend:", residentsData);

    // Không thay đổi status từ backend, chỉ log để kiểm tra
    const residentsWithStatus = residentsData.map((resident: Resident) => {
      console.log(`Resident ${resident.name} has status:`, resident.status);
      return {
        ...resident,
        // Chỉ set mặc định nếu thực sự không có status từ backend
        status: resident.status !== undefined ? resident.status : "Thường trú",
      };
    });

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
}, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
              const response = await fetch("http://localhost:3000/api/citizens/add", {
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
              
              // Log để kiểm tra dữ liệu trả về từ backend
              console.log("New resident data from backend:", data);
              
              // Sử dụng status từ backend hoặc từ form input
              const newResidentWithStatus = {
                ...data?.data,
                status: data?.data?.status || newResident.status || "Thường trú"
              };
              
              setResidents([...residents, newResidentWithStatus]);
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
                  <TableRow key={resident._id || resident.id}>
                    <TableCell className="font-medium">{resident.name || "N/A"}</TableCell>
                    <TableCell>{resident.citizenId || "N/A"}</TableCell>
                    <TableCell>{resident.gender || "N/A"}</TableCell>
                    <TableCell>
                      {resident.dob ? new Date(resident.dob).toLocaleDateString("vi-VN") : "N/A"}
                    </TableCell>
                    <TableCell>{getHouseholdApartment(resident.householdId)}</TableCell>
                    <TableCell>{resident.relation || "N/A"}</TableCell>
                    <TableCell>
                      {/* Debug inline */}
                      {(() => {
                        console.log(`Displaying status for ${resident.name}:`, resident.status);
                        console.log("Status type:", typeof resident.status);
                        console.log("Status length:", resident.status?.length);
                        console.log("Status charCodes:", resident.status?.split('').map(c => c.charCodeAt(0)));
                        
                        // Tạm thời hiển thị trực tiếp để test
                        const normalizedStatus = resident.status?.toString().trim();
                        
                        if (normalizedStatus === "Đã chuyển đi") {
                          return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Đã chuyển đi
                            </span>
                          );
                        } else if (normalizedStatus === "Tạm vắng") {
                          return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Tạm vắng
                            </span>
                          );
                        } else if (normalizedStatus === "Thường trú") {
                          return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Thường trú
                            </span>
                          );
                        } else {
                          return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {normalizedStatus || "Không xác định"} (Debug: "{resident.status}")
                            </span>
                          );
                        }
                      })()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={isLoading}>
                            <MoreHorizontal className="h-4 w-4"/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <ViewResidentDialog resident={resident} key={`view-${resident._id}`}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} key={`view-item-${resident._id || resident.id}`}>
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
                                
                                // Giữ nguyên status từ backend hoặc từ updatedResident
                                const updatedResidentWithStatus = {
                                  ...data?.data,
                                  status: data?.data?.status || updatedResident.status
                                };
                                
                                setResidents(
                                  residents.map((r) =>
                                    r._id === resident._id ? updatedResidentWithStatus : r
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