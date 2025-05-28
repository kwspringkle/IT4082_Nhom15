import { payments } from '../seed/fakePayments.js'; // dữ liệu giả
import { households } from '../seed/fakeHouseholds.js'; // dữ liệu giả
import { fees } from '../seed/fakeFees.js'; // dữ liệu giả

export const getAllPayments = async (req, res) => {
  try {
    const { householdId, feeId, status, startDate, endDate, search } = req.query;
    
    let results = [...payments];

    // Filter by household
    if (householdId) {
      results = results.filter(p => p.householdId === parseInt(householdId));
    }

    // Filter by fee type
    if (feeId) {
      results = results.filter(p => p.feeId === parseInt(feeId));
    }

    // Filter by status
    if (status) {
      results = results.filter(p => p.status === status.toUpperCase());
    }

    // Filter by date range
    if (startDate && endDate) {
      results = results.filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);
      });
    }

    // Search by payment details or household info
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(p => {
        const household = households.find(h => h.id === p.householdId);
        const fee = fees.find(f => f.id === p.feeId);
        return (
          household?.apartment?.toLowerCase().includes(searchLower) ||
          household?.head?.toLowerCase().includes(searchLower) ||
          fee?.name?.toLowerCase().includes(searchLower) ||
          p.note?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Thêm thông tin chi tiết về hộ và khoản thu
    const detailedResults = results.map(payment => {
      const household = households.find(h => h.id === payment.householdId);
      const fee = fees.find(f => f.id === payment.feeId);
      return {
        ...payment,
        householdInfo: {
          apartment: household.apartment,
          head: household.head,
          floor: household.floor
        },
        feeInfo: {
          name: fee.name,
          type: fee.type,
          mandatory: fee.mandatory
        }
      };
    });    res.status(200).json({
      success: true,
      data: detailedResults,
      total: detailedResults.length,
      message: 'Successfully retrieved payments list'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách khoản nộp',
    error: error.message
  });
  }
};

// Lấy chi tiết một khoản nộp
export const getPaymentById = async (req, res) => {
  try {
    const paymentId = parseInt(req.params.id);
    const payment = payments.find(p => p.id === paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản nộp'
      });
    }

    // Thêm thông tin chi tiết về hộ dân và khoản thu
    const household = households.find(h => h.id === payment.householdId);
    const fee = fees.find(f => f.id === payment.feeId);
    
    const detailedPayment = {
      ...payment,
      householdInfo: {
        apartment: household.apartment,
        head: household.head,
        floor: household.floor
      },
      feeInfo: {
        name: fee.name,
        type: fee.type,
        mandatory: fee.mandatory
      }
    };

    res.status(200).json({
      success: true,
      data: detailedPayment,
      message: 'Lấy chi tiết khoản nộp thành công'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết khoản nộp',
      error: error.message
    });
  }
};
      

// Tạo khoản nộp mới
export const createPayment = async (req, res) => {
  try {
    const { householdId, feeId, amount, dueDate, note } = req.body;

    // Validate input data
    if (!householdId || !feeId || !amount || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing',
        details: {
          householdId: !householdId ? 'Household ID is required' : null,
          feeId: !feeId ? 'Fee ID is required' : null,
          amount: !amount ? 'Amount is required' : null,
          dueDate: !dueDate ? 'Due date is required' : null
        }
      });
    }

    // Validate amount is positive
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Validate due date is not in the past
    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Due date cannot be in the past'
      });
    }

    // Check if household and fee exist
    const household = households.find(h => h.id === parseInt(householdId));
    const fee = fees.find(f => f.id === parseInt(feeId));    if (!household || !fee) {
      return res.status(404).json({
        success: false,
        message: 'Household or fee not found',
        details: {
          household: !household ? 'Invalid household ID' : null,
          fee: !fee ? 'Invalid fee ID' : null
        }
      });
    }

    // Check for duplicate payment
    const existingPayment = payments.find(p => 
      p.householdId === parseInt(householdId) && 
      p.feeId === parseInt(feeId) &&
      p.status !== 'PAID' &&
      new Date(p.dueDate) > new Date()
    );

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'An unpaid payment already exists for this household and fee'
      });
    }

    // Create new payment
    const newPayment = {
      id: payments.length + 1,
      householdId: parseInt(householdId),
      feeId: parseInt(feeId),
      amount: parseFloat(amount),
      dueDate,
      status: 'UNPAID',
      paidDate: null,
      paidAmount: 0,
      note: note || '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    payments.push(newPayment);

    // Trả về kết quả với thông tin chi tiết
    const detailedPayment = {
      ...newPayment,
      householdInfo: {
        apartment: household.apartment,
        head: household.head,
        floor: household.floor
      },
      feeInfo: {
        name: fee.name,
        type: fee.type,
        mandatory: fee.mandatory
      }
    };    res.status(201).json({
      success: true,
      data: detailedPayment,
      message: 'Payment created successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment',
      error: error.message
    });
  }
};

// Cập nhật khoản nộp
export const updatePayment = async (req, res) => {
  try {
    const paymentId = parseInt(req.params.id);
    const { amount, dueDate, status, paidDate, paidAmount, note } = req.body;

    // Tìm khoản nộp cần cập nhật
    const paymentIndex = payments.findIndex(p => p.id === paymentId);
    if (paymentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản nộp'
      });
    }    // Validate status
    if (status && !['PAID', 'UNPAID', 'PARTIAL'].includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
        details: {
          status: 'Must be one of: PAID, UNPAID, PARTIAL'
        }
      });
    }

    // Validate paid amount
    if (status === 'PAID' && (!paidAmount || paidAmount < payments[paymentIndex].amount)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid paid amount for PAID status',
        details: {
          paidAmount: 'Must be equal to or greater than the required amount'
        }
      });
    }

    // Validate paid date
    if (status === 'PAID' && !paidDate) {
      return res.status(400).json({
        success: false,
        message: 'Paid date is required when status is PAID'
      });
    }

    // Update information
    const updatedPayment = {
      ...payments[paymentIndex],
      amount: amount || payments[paymentIndex].amount,
      dueDate: dueDate || payments[paymentIndex].dueDate,
      status: status ? status.toUpperCase() : payments[paymentIndex].status,
      paidDate: paidDate || payments[paymentIndex].paidDate,
      paidAmount: paidAmount !== undefined ? paidAmount : payments[paymentIndex].paidAmount,
      note: note || payments[paymentIndex].note,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // Lưu cập nhật
    payments[paymentIndex] = updatedPayment;

    // Thêm thông tin chi tiết
    const household = households.find(h => h.id === updatedPayment.householdId);
    const fee = fees.find(f => f.id === updatedPayment.feeId);
    
    const detailedPayment = {
      ...updatedPayment,
      householdInfo: {
        apartment: household.apartment,
        head: household.head,
        floor: household.floor
      },
      feeInfo: {
        name: fee.name,
        type: fee.type,
        mandatory: fee.mandatory
      }
    };

    res.status(200).json({
      success: true,
      data: detailedPayment,
      message: 'Cập nhật khoản nộp thành công'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật khoản nộp',
      error: error.message
    });
  }
};

// Xóa khoản nộp
export const deletePayment = async (req, res) => {
  try {
    const paymentId = parseInt(req.params.id);

    // Tìm khoản nộp cần xóa
    const paymentIndex = payments.findIndex(p => p.id === paymentId);
    if (paymentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản nộp'
      });
    }

    // Kiểm tra điều kiện xóa
    if (payments[paymentIndex].status === 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa khoản nộp đã thanh toán'
      });
    }

    // Thực hiện xóa
    payments.splice(paymentIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Xóa khoản nộp thành công'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa khoản nộp',
      error: error.message
    });
    }
}