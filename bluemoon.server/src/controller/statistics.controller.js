import Household from "../model/Household.js";
import Resident from "../model/Citizen.js";
import Payment from "../model/Payment.js";

// Giả sử bạn có định nghĩa tháng hiện tại
const CURRENT_MONTH = new Date().getMonth() + 1;
const CURRENT_YEAR = new Date().getFullYear();

export const getDashBoardStatistics = async (req, res) => {
  try {
    const totalHouseholds = await Household.countDocuments();
    const totalResidents = await Resident.countDocuments();

    // Tính tổng số tiền thu trong tháng hiện tại
    const payments = await Payment.find({
      month: CURRENT_MONTH,
      year: CURRENT_YEAR,
    });

    const monthlyRevenue = payments.reduce((total, p) => total + p.amount, 0);

    // Tính tỉ lệ thanh toán: số hộ đã thanh toán / tổng số hộ
    const paidHouseholds = await Payment.distinct("householdId", {
      month: CURRENT_MONTH,
      year: CURRENT_YEAR,
    });
    const paymentRate = totalHouseholds > 0 ? paidHouseholds.length / totalHouseholds : 0;

    res.json({
      totalHouseholds,
      totalResidents,
      monthlyRevenue,
      paymentRate,
    });
  } catch (err) {
    console.error("Lỗi khi lấy thống kê:", err);
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
    const [households, payments] = await Promise.all([
      Household.find(),
      Payment.find()
    ]);

    const paidSet = new Set(
      payments
        .filter(p => p.status === 'PAID' || p.status === 'PARTIAL')
        .map(p => p.householdId.toString())
    );

    const paid = [], unpaid = [];

    for (const { _id, apartment, head } of households) {
      const household = { householdId: _id, apartment, head };
      (paidSet.has(_id.toString()) ? paid : unpaid).push(household);
    }

    res.status(200).json({
      success: true,
      data: { paid, unpaid }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
