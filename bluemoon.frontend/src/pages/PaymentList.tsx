import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import { Payment, PaymentFormData } from "@/types/payment";
import { fetchPayments, updatePayment, createPayment, deletePayment } from "@/api/paymentApi";
import { fetchHouseholds } from "@/api/household";
import { normalizePaymentData } from "@/utils/paymentUtils";

import PaymentFormDialog from "@/components/dialogs/PaymentFormDialog";
import PaymentFilters from "@/components/ui/PaymentFilters";
import PaymentTable from "@/components/ui/PaymentTable";
import { fetchFees } from "@/api/feeAPI";

interface HouseholdOption {
  id: string;
  label: string;
}

const PaymentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [fees, setFees] = useState<{ id: string; label: string }[]>([]);
  const [households, setHouseholds] = useState<HouseholdOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editFormData, setEditFormData] = useState<PaymentFormData>({
    householdId: "",
    feeId: "",
    amount: "",
    status: "PAID",
    paidDate: "",
    note: "",
  });
  const [newPayment, setNewPayment] = useState<PaymentFormData>({
    householdId: "",
    feeId: "",
    amount: "",
    status: "PAID",
    paidDate: "",
    note: "",
  });

  // Helper function để chuyển đổi single payment record
  const normalizePaymentRecord = (paymentData: any) => {
    // Tìm thông tin household
    const household = households.find(h => h.id === paymentData.householdId);
    const fee = fees.find(f => f.id === paymentData.feeId);

    return {
      ...paymentData,
      household: household ? household.label : paymentData.household || "",
      feeName: fee ? fee.label : paymentData.feeName || "",
      amount: Number(paymentData.amount) || 0,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const paymentsRes = await fetchPayments();
        const paymentData = normalizePaymentData(paymentsRes);
        setPayments(paymentData);

        const householdsRes = await fetchHouseholds();
        const householdOptions = householdsRes.map((h: any) => ({
          id: h._id,
          label: `${h.apartment} - ${h.head}`,
        }));
        setHouseholds(householdOptions);

        const feesRes = await fetchFees();
        const feeOptions = feesRes.map((f: any) => ({
          id: f._id,
          label: f.name,
          amount: f.amount
        }));
        setFees(feeOptions);

      } catch (error: any) {
        console.error("Fetch error details:", error.response?.data || error.message);
        toast({
          title: "Lỗi",
          description: `Không thể tải dữ liệu: ${error.response?.data?.message || error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const statusMatch =
      statusFilter === "all" ||
      (payment.status && payment.status.toLowerCase() === statusFilter);
    const feeMatch =
      feeFilter === "all" ||
      (payment.feeName && payment.feeName === feeFilter);
    const searchMatch =
      !searchTerm ||
      (payment.household &&
        payment.household.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.feeName &&
        payment.feeName.toLowerCase().includes(searchTerm.toLowerCase()));

    return statusMatch && feeMatch && searchMatch;
  });

  const handleMarkAsPaid = async (payment: Payment) => {
    try {
      const updatedPayment = {
        ...payment,
        status: "PAID" as const,
        paidAt: new Date().toISOString(),
      };
      const response = await updatePayment(payment.id, updatedPayment);
      
      // Normalize dữ liệu trả về
      const normalizedPayment = normalizePaymentRecord(response);
      
      setPayments((prevPayments) =>
        prevPayments.map((p) =>
          p.id === payment.id ? normalizedPayment : p
        )
      );
      toast({
        title: "Thành công",
        description: "Đã đánh dấu khoản phí đã nộp",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật trạng thái: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setEditFormData({
      household: payment.household || "",
      feeName: payment.feeName || "",
      amount: payment.amount ? payment.amount : 0,
      status: payment.status ? payment.status.toLowerCase() : "",
      paidAt: payment.paidAt ? payment.paidAt.split("T")[0] : "",
      note: payment.note || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedPayment) return;
    try {
      const updatedPaymentData = {
        ...editFormData,
        amount: Number(editFormData.amount) || 0,
        status: editFormData.status.toUpperCase() as "PAID" | "UNPAID" | "LATE",
        paidAt: editFormData.paidDate || null,
      };
      const response = await updatePayment(selectedPayment.id, updatedPaymentData);
      const updatedRecord = response.data;

      // Normalize dữ liệu trả về để có thông tin household và feeName
      const normalizedPayment = normalizePaymentRecord(updatedRecord);

      setPayments((prevPayments) =>
        prevPayments.map((p) =>
          p.id === selectedPayment.id ? normalizedPayment : p
        )
      );

      setIsEditModalOpen(false);
      toast({ title: "Thành công", description: "Đã cập nhật khoản thu phí" });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật khoản thu: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (payment: Payment) => {
    try {
      await deletePayment(payment.id);
      setPayments((prevPayments) => prevPayments.filter((p) => p.id !== payment.id));
      toast({
        title: "Đã xóa",
        description: "Đã xóa khoản thu phí",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể xóa khoản thu: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleNewPaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });
  };

  const handleNewPaymentStatusChange = (value: string) => {
    setNewPayment({ ...newPayment, status: value });
  };

  const handleCreatePayment = async () => {
    try {
      const response = await createPayment(newPayment);
      const newRecord = response.data;

      // Normalize dữ liệu trả về để có thông tin household và feeName
      const normalizedPayment = normalizePaymentRecord(newRecord);

      setPayments((prevPayments) => [
        ...prevPayments,
        normalizedPayment,
      ]);
      setOpenCreateDialog(false);
      toast({ title: "Thành công", description: "Tạo khoản thu phí mới thành công" });

      setNewPayment({
        householdId: "",
        feeId: "",
        amount: 0,
        status: "paid",
        paidAt: null,
        note: "",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tạo khoản thu: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý thu phí</h1>
          <p className="text-muted-foreground">
            Quản lý các khoản thu phí của các hộ gia đình
          </p>
        </div>
        <Button className="bg-blue-600" onClick={() => setOpenCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo khoản thu phí mới
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách khoản thu phí</CardTitle>
          <CardDescription>
            Quản lý việc thu phí từ các hộ gia đình
          </CardDescription>
          <PaymentFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            periodFilter={periodFilter}
            setPeriodFilter={setPeriodFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            feeFilter={feeFilter}
            setFeeFilter={setFeeFilter}
            allFeeNames={[...new Set(payments.map((p) => p.feeName).filter(name => name !== null && name !== undefined && name !== ""))]}
          />
        </CardHeader>
        <CardContent>
          <PaymentTable
            payments={filteredPayments}
            //onMarkAsPaid={handleMarkAsPaid}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <PaymentFormDialog
        isOpen={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        formData={newPayment}
        onInputChange={handleNewPaymentInputChange}
        onStatusChange={handleNewPaymentStatusChange}
        onSubmit={handleCreatePayment}
        title="Tạo khoản thu phí mới"
        description="Nhập thông tin để tạo khoản thu phí mới trong hệ thống."
        households={households}
        fees={fees.map(f => ({ id: f.id, name: f.label }))}
      />

      <PaymentFormDialog
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        formData={editFormData}
        onInputChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })}
        onStatusChange={(value) => setEditFormData({ ...editFormData, status: value })}
        onSubmit={handleEditSubmit}
        title="Chỉnh sửa khoản thu phí"
        description="Cập nhật thông tin khoản thu phí cho hộ gia đình."
        isEditMode={true}
        households={households}
        fees={fees.map(f => ({ id: f.id, name: f.label }))}
      />
    </div>
  );
};

export default PaymentList;