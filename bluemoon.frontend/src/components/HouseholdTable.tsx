// components/HouseholdTable.tsx
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Household } from "../types/household";
import EditHouseholdDialog from "./dialogs/EditHouseholdDialog";
import ViewHouseholdDialog from "./dialogs/ViewHouseholdDialog";

interface HouseholdTableProps {
  households: Household[];
  isLoading: boolean;
  onViewMembers: (householdId: string) => void;
  onUpdateHousehold: (householdId: string, householdData: any) => Promise<void>;
  onDeleteHousehold: (householdId: string) => Promise<void>;
}

const HouseholdTable = ({
  households,
  isLoading,
  onViewMembers,
  onUpdateHousehold,
  onDeleteHousehold,
}: HouseholdTableProps) => {
  const handleDelete = async (householdId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa hộ khẩu này?")) return;
    await onDeleteHousehold(householdId);
  };

  return (
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
        {households.map((household) => (
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

                  <ViewHouseholdDialog household={household}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Eye className="mr-2 h-4 w-4" />
                      Xem lịch sử
                    </DropdownMenuItem>
                  </ViewHouseholdDialog>

                  <DropdownMenuItem onClick={() => onViewMembers(household._id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Xem thành viên
                  </DropdownMenuItem>

                  <EditHouseholdDialog
                    household={household}
                    onUpdateHousehold={(householdData) =>
                      onUpdateHousehold(household._id, householdData)
                    }
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
  );
};

export default HouseholdTable;
