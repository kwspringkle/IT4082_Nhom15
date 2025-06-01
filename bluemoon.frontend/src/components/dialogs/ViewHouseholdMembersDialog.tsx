import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

// Định nghĩa interface cho Resident
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

interface ViewHouseholdMembersDialogProps {
  householdId: string;
  apartmentNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewHouseholdMembersDialog = ({
  householdId,
  apartmentNumber,
  open,
  onOpenChange,
}: ViewHouseholdMembersDialogProps) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchResidents = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const response = await fetch(
          `http://localhost:3000/api/citizens?householdId=${householdId}`,
          { headers }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData?.message || `HTTP error! Status: ${response.status}`
          );
        }
        const data = await response.json();
        // Chuẩn hóa dữ liệu trả về
        const residentsData = Array.isArray(data) ? data : data?.data || [];
        if (!Array.isArray(residentsData)) {
          throw new Error("Dữ liệu nhân khẩu không hợp lệ");
        }
        setResidents(residentsData);
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error.message || "Không thể tải danh sách thành viên",
          variant: "destructive",
        });
        setResidents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResidents();
  }, [open, householdId]);

  const getStatusBadge = (status?: string): JSX.Element | null => {
    switch (status) {
      case "TEMPORARY_RESIDENCE":
        return <Badge className="bg-blue-100 text-blue-800">Tạm trú</Badge>;
      case "TEMPORARY_ABSENT":
        return <Badge className="bg-yellow-100 text-yellow-800">Tạm vắng</Badge>;
      case "PERMANENT":
        return <Badge className="bg-green-100 text-green-800">Thường trú</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thành viên hộ khẩu - Căn hộ {apartmentNumber}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center">Đang tải...</div>
        ) : residents.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Không có thành viên nào trong căn hộ này.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Căn cước</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Quan hệ</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {residents.map((resident) => (
                <TableRow key={resident._id}>
                  <TableCell className="font-medium">
                    {resident.name || "N/A"}
                  </TableCell>
                  <TableCell>{resident.citizenId || "N/A"}</TableCell>
                  <TableCell>{resident.gender || "N/A"}</TableCell>
                  <TableCell>
                    {resident.dob
                      ? new Date(resident.dob).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </TableCell>
                  <TableCell>{resident.relation || "N/A"}</TableCell>
                  <TableCell>{getStatusBadge(resident.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewHouseholdMembersDialog;