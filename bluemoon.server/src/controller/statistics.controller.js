import { payments } from '../seed/fakePayments.js';
import { households } from '../seed/fakeHouseholds.js';

// Thống kê số tiền đã thu theo đợt (theo dueDate)
export const getCollectionRoundsStatistics = async (req, res) => {
  try {
    // Gom nhóm các khoản nộp theo dueDate (đợt thu)
    const rounds = {};
    payments.forEach(payment => {
      const round = payment.dueDate;
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
      rounds[round].totalAmount += payment.amount;
      rounds[round].totalPayments += 1;
      if (payment.status === 'PAID' || payment.status === 'PARTIAL') {
        rounds[round].collectedAmount += payment.paidAmount || 0;
        if (payment.status === 'PAID') {
          rounds[round].paidPayments += 1;
        } else if (payment.status === 'PARTIAL') {
          rounds[round].paidPayments += 1; // Đếm cả khoản đã thu một phần
        }
      } else {
        rounds[round].unpaidPayments += 1;
      }
    });

    // Chuyển object thành mảng và tính tỷ lệ hoàn thành
    const result = Object.values(rounds).map(r => ({
      ...r,
      completionRate: r.totalAmount > 0 ? Math.round((r.collectedAmount / r.totalAmount) * 100) : 0
    }));

    res.status(200).json({
      success: true,
      data: result,
      message: 'Thống kê số tiền đã thu theo đợt thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thống kê số tiền đã thu theo đợt',
      error: error.message
    });
  }
};

// Thống kê hộ đã nộp / chưa nộp
export const getPaymentStatusStatistics = async (req, res) => {
  try {
    // Gom nhóm theo householdId
    const statusByHousehold = households.map(household => {
      // Lấy tất cả khoản nộp của hộ này
      const householdPayments = payments.filter(p => p.householdId === household.id);
      // Đã nộp: có ít nhất 1 khoản có status PAID hoặc PARTIAL
      const hasPaid = householdPayments.some(p => p.status === 'PAID' || p.status === 'PARTIAL');
      return {
        householdId: household.id,
        apartment: household.apartment,
        head: household.head,
        paid: hasPaid
      };
    });

    const paidHouseholds = statusByHousehold.filter(h => h.paid);
    const unpaidHouseholds = statusByHousehold.filter(h => !h.paid);

    res.status(200).json({
      success: true,
      data: {
        paid: paidHouseholds,
        unpaid: unpaidHouseholds
      },
      message: 'Thống kê hộ đã nộp / chưa nộp thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thống kê hộ đã nộp / chưa nộp',
      error: error.message
    });
  }
};
