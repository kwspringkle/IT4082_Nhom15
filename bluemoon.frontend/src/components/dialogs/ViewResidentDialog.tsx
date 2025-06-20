import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const ViewResidentDialog = ({ children, resident }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resident?._id) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/history/citizen/${resident._id}`);
        setHistory(res.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi tải lịch sử nhân khẩu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [resident?._id]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Lịch sử chỉnh sửa</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {resident?.name ? `Lịch sử của ${resident.name}` : "Thông tin chỉnh sửa"}
            </p>
            <div className="border rounded p-3 text-sm text-muted-foreground space-y-2">
              {loading ? (
                <p>Đang tải...</p>
              ) : history.length === 0 ? (
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

export default ViewResidentDialog;
