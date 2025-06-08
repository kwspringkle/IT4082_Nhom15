import Household from "../model/Household.js";
import Resident from "../model/Citizen.js";
import Payment from "../model/Payment.js";
import Fee from "../model/Fee.js";

// Giả sử bạn có định nghĩa tháng hiện tại
const CURRENT_MONTH = new Date().getMonth() + 1;
const CURRENT_YEAR = new Date().getFullYear();

export const getDashBoardStatistics = async (req, res) => {
  try {
    // Lấy tổng số hộ và tổng số nhân khẩu
    const totalHouseholds = await Household.countDocuments();
    const totalResidents = await Resident.countDocuments();

    // Xác định khoảng thời gian đầu và cuối tháng hiện tại
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Lấy tất cả payment trong tháng hiện tại
    const payments = await Payment.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Tính tổng tiền thu được tháng này
    const monthlyRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Lấy danh sách householdId đã thanh toán trong tháng
    const paidHouseholds = await Payment.distinct("householdId", {
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Tổng số hộ hợp lệ (có chủ hộ)
    const totalValidHouseholds = await Household.countDocuments({ head: { $ne: "" } });

    // Tỉ lệ thanh toán = số hộ đã thanh toán / tổng số hộ hợp lệ
    const paymentRate = totalValidHouseholds > 0
      ? paidHouseholds.length / totalValidHouseholds
      : 0;

    res.status(200).json({
      totalHouseholds,
      totalResidents,
      monthlyRevenue,
      paymentRate
    });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};



export const getCollectionRoundsStatistics = async (req, res) => {
  try {
    const payments = await Payment.find();

    const rounds = {};

    for (const { dueDate, amount, paidAmount = 0, status } of payments) {
      const round = dueDate.toISOString().split('T')[0];

      if (!rounds[round]) {
        rounds[round] = {
          dueDate: round,
          totalAmount: 0,
          collectedAmount: 0,
          totalPayments: 0,
          paidPayments: 0,
          unpaidPayments: 0
        };
      }

      rounds[round].totalAmount += amount;
      rounds[round].totalPayments += 1;

      if (status === 'PAID' || status === 'PARTIAL') {
        rounds[round].collectedAmount += paidAmount;
        rounds[round].paidPayments += 1;
      } else {
        rounds[round].unpaidPayments += 1;
      }
    }

    const result = Object.values(rounds).map(r => ({
      ...r,
      completionRate: r.totalAmount > 0
        ? Math.round((r.collectedAmount / r.totalAmount) * 100)
        : 0
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getPaymentStatusStatistics = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const payments = await Payment.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalMoney = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const paidHouseholds = await Payment.distinct("householdId", {
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalValidHouseholds = await Household.countDocuments({ head: { $ne: "" } });

    const paymentRate = totalValidHouseholds > 0
      ? paidHouseholds.length / totalValidHouseholds
      : 0;

    res.status(200).json({
      Money: totalMoney,
      PaymentRate: paymentRate
    });
  } catch (error) {
    console.error("Lỗi khi thống kê thu phí tháng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};


export const getReport = async (req, res) => {
  try {
    // 1. Lấy danh sách hộ dân hợp lệ
    const households = await Household.find({ head: { $ne: "" } });
    const householdIds = households.map(h => h._id.toString());

    // 2. Lấy danh sách các khoản phí đang hoạt động
    const fees = await Fee.find({ status: "ACTIVE" });

    // 3. Lấy tất cả các khoản thanh toán
    const payments = await Payment.find();

    // 4. Tính tổng số tiền đã thu
    const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // 5. Chuẩn bị thống kê cho từng loại phí
    const feeStats = fees.map(fee => {
      const feeIdStr = fee._id.toString();

      const feePayments = payments.filter(p => p.feeId.toString() === feeIdStr);
      const paidHouseholdIds = new Set(feePayments.map(p => p.householdId.toString()));

      const unpaidCount = householdIds.filter(id => !paidHouseholdIds.has(id)).length;
      const paidAmount = feePayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const unpaidAmount = unpaidCount * fee.amount;
      const expected = households.length * fee.amount;

      const rate = expected > 0 ? Math.round((paidAmount / expected) * 100) : 0;

      return {
        name: fee.name,
        count: households.length,
        paid: paidAmount,
        unpaid: unpaidAmount,
        expected,
        rate,
      };
    });

    // 6. Tính tổng chưa thu
    const totalUnpaid = feeStats.reduce((sum, stat) => sum + stat.unpaid, 0);

    // 7. Tổng dự kiến và tỷ lệ thu
    const totalExpected = totalPaid + totalUnpaid;
    const paymentRate = totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0;

    // 8. Trả về kết quả
    res.status(200).json({
      totalExpected,
      totalPaid,
      unpaidAmount: totalUnpaid,
      paymentRate,
      totalHouseholds: householdIds.length,
      feeStats,
    });

  } catch (error) {
    console.error("Lỗi khi tạo báo cáo:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
