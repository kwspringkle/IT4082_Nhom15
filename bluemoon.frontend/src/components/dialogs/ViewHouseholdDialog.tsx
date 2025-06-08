import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface ViewHouseholdDialogProps {
  children: React.ReactNode;
  household: { _id: string };
}

const ViewHouseholdDialog: React.FC<ViewHouseholdDialogProps> = ({ children, household }) => {
  const [history, setHistory] = useState<Record<string, string[] | string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!household?._id) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/history/household/${household._id}`
        );
        setHistory(response.data.data || {});
      } catch (error) {
        console.error("Lỗi khi tải lịch sử hộ khẩu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [household]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Lịch sử chỉnh sửa hộ khẩu</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Thông tin chỉnh sửa
            </p>
            <div className="border rounded p-3 text-sm text-muted-foreground space-y-2">
              {loading ? (
                <p>Đang tải...</p>
              ) : Object.keys(history).length === 0 ? (
                <p>Chưa có lịch sử thay đổi</p>
              ) : (
                Object.entries(history).map(([key, value], index) => (
                  <div key={index}>
                    <p className="font-medium">• {key}</p>
                    {Array.isArray(value) ? (
                      value.map((line, i) => (
                        <p key={i} className="ml-4">- {line}</p>
                      ))
                    ) : (
                      <p className="ml-4">{value}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewHouseholdDialog;
