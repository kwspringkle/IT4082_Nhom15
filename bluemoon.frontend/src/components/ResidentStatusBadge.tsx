// components/ResidentStatusBadge.tsx
import { Badge } from "@/components/ui/badge";

interface ResidentStatusBadgeProps {
  status?: string;
}

const ResidentStatusBadge = ({ status }: ResidentStatusBadgeProps) => {
  switch (status) {
    case "Tạm trú":
      return <Badge className="bg-blue-100 text-blue-800">Tạm trú</Badge>;
    case "Tạm vắng":
      return <Badge className="bg-yellow-100 text-yellow-800">Tạm vắng</Badge>;
    case "Đã chuyển đi":
      return <Badge className="bg-gray-100 text-gray-800">Đã chuyển đi</Badge>;
    case "Thường trú":
    default:
      return <Badge className="bg-green-100 text-green-800">Thường trú</Badge>;
  }
};

export default ResidentStatusBadge;
