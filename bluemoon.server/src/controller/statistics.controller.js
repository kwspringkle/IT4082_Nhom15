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
    // Lấy tất cả bản ghi Payment và populate thông tin liên quan
    const payments = await Payment.find()
      .populate('feeId', 'name type')
      .lean();

    // Lấy tổng số hộ gia đình
    const totalHouseholds = await Household.countDocuments({ head: { $ne: '' } });

    // Khởi tạo các biến tổng quan
    let totalPaid = 0;
    let unpaidAmount = 0;
    let totalExpected = 0;

    // Tính toán tổng quan
    payments.forEach(payment => {
      totalExpected += payment.amount || 0;
      if (payment.status === 'PAID') {
        totalPaid += payment.amount || 0;
      } else if (payment.status === 'UNPAID') {
        unpaidAmount += payment.amount || 0;
      } else if (payment.status === 'PARTIAL') {
        unpaidAmount += payment.amount || 0; 
      }
    });

    // Tính tỷ lệ thu phí
    const paymentRate = totalExpected > 0 ? (totalPaid / totalExpected) * 100 : 0;

    // Tính thống kê theo loại phí
    const feeStatsMap = new Map();

    for (const payment of payments) {
      const feeId = payment.feeId?._id?.toString();
      const feeName = payment.feeId?.name || 'Không xác định';

      if (!feeId) continue;

      if (!feeStatsMap.has(feeId)) {
        feeStatsMap.set(feeId, {
          name: feeName,
          count: 0,
          paid: 0,
          unpaid: 0,
          expected: 0,
          rate: 0,
        });
      }

      const stats = feeStatsMap.get(feeId);
      stats.count += 1;
      stats.expected += payment.amount || 0;

      if (payment.status === 'PAID') {
        stats.paid += payment.amount || 0;
      } else if (payment.status === 'UNPAID') {
        stats.unpaid += payment.amount || 0;
      } else if (payment.status === 'PARTIAL') {
        stats.unpaid += payment.amount || 0; 
      }
    }

    // Tính tỷ lệ thu cho từng loại phí
    const feeStats = Array.from(feeStatsMap.values()).map(stats => ({
      ...stats,
      rate: stats.expected > 0 ? (stats.paid / stats.expected) * 100 : 0,
    }));

    // Chuẩn bị dữ liệu phản hồi
    const reportData = {
      paymentRate: Math.round(paymentRate * 100) / 100, // Làm tròn 2 chữ số
      totalPaid,
      unpaidAmount,
      totalExpected,
      totalHouseholds,
      feeStats,
    };

    res.status(200).json({
      success: true,
      data: reportData,
      message: 'Lấy báo cáo thống kê thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy báo cáo thống kê',
      error: error.message,
    });
  }
};
