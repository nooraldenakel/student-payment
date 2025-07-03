import React from 'react';
import { Student } from '../types';
import { X, CheckCircle, XCircle, Calendar, DollarSign, Trash2, Clock } from 'lucide-react';

interface PaymentHistoryModalProps {
  student: Student;
  onClose: () => void;
  onConfirmPayment: (studentId: string, paymentId: string) => void;
  onDeletePayment: (studentId: string, paymentId: string) => void;
}

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  student,
  onClose,
  onConfirmPayment,
  onDeletePayment
}) => {
  const generateMonthsFromStart = () => {
    const months = [];
    const start = new Date(student.dateAdded);
    const now = new Date();
    
    let current = new Date(start);
    
    while (current <= now) {
      const monthKey = `${current.getFullYear()}-${current.getMonth()}`;
      const monthName = current.toLocaleDateString('ar', { month: 'long', year: 'numeric' });
      
      // البحث عن جميع الدفعات لهذا الشهر (مؤكدة وغير مؤكدة)
      const monthPayments = student.payments.filter(p => 
        p.month === current.toLocaleDateString('en-US', { month: 'long' }) && 
        p.year === current.getFullYear()
      );
      
      // إذا كان هناك دفعات لهذا الشهر
      if (monthPayments.length > 0) {
        monthPayments.forEach((payment, index) => {
          months.push({
            key: `${monthKey}-${index}`,
            name: monthPayments.length > 1 ? `${monthName} (دفعة ${index + 1})` : monthName,
            payment: payment,
            isPaid: payment.confirmed,
            isPending: !payment.confirmed,
            isMissed: false
          });
        });
      } else {
        // إذا لم تكن هناك دفعات لهذا الشهر
        months.push({
          key: monthKey,
          name: monthName,
          payment: null,
          isPaid: false,
          isPending: false,
          isMissed: current < now
        });
      }
      
      current.setMonth(current.getMonth() + 1);
    }
    
    return months.reverse();
  };

  const monthsHistory = generateMonthsFromStart();
  const totalPaid = student.payments
    .filter(p => p.confirmed)
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pendingPayments = student.payments.filter(p => !p.confirmed);

  const handleDeletePayment = (paymentId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
      onDeletePayment(student.id, paymentId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" dir="rtl">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transition-all duration-300 shadow-2xl border border-white/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div>
            <div className="flex items-center mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-3 animate-pulse">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-300 bg-clip-text text-transparent text-right" dir="auto">
                سجل المدفوعات - {student.name}
              </h2>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                إجمالي المدفوع: <span className="font-bold text-green-600 dark:text-green-400">{totalPaid.toLocaleString()}</span>
              </span>
              {pendingPayments.length > 0 && (
                <span className="text-gray-600 dark:text-gray-400">
                  في الانتظار: <span className="font-bold text-orange-600 dark:text-orange-400">{pendingPayments.length}</span>
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            {monthsHistory.map((month, index) => (
              <div
                key={month.key}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in ${
                  month.isPaid
                    ? 'bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/50'
                    : month.isPending
                    ? 'bg-gradient-to-r from-orange-50/50 to-yellow-50/50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200/50 dark:border-orange-700/50'
                    : month.isMissed
                    ? 'bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200/50 dark:border-red-700/50'
                    : 'bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/20 border-gray-200/50 dark:border-gray-600/50'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 ml-3 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">{month.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 space-x-reverse">
                    {month.payment && (
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 ml-1 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">{month.payment.amount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      {month.isPaid ? (
                        <div className="flex items-center text-green-600 dark:text-green-400 animate-pulse">
                          <CheckCircle className="h-5 w-5 ml-1" />
                          <span className="text-sm font-medium">مدفوع</span>
                        </div>
                      ) : month.isPending ? (
                        <div className="flex items-center text-orange-600 dark:text-orange-400 animate-pulse">
                          <Clock className="h-5 w-5 ml-1" />
                          <span className="text-sm font-medium">في الانتظار</span>
                        </div>
                      ) : month.isMissed ? (
                        <div className="flex items-center text-red-600 dark:text-red-400">
                          <XCircle className="h-5 w-5 ml-1" />
                          <span className="text-sm font-medium">متأخر</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar className="h-5 w-5 ml-1" />
                          <span className="text-sm font-medium">معلق</span>
                        </div>
                      )}
                    </div>

                    {month.payment && (
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {!month.payment.confirmed && (
                          <button
                            onClick={() => onConfirmPayment(student.id, month.payment.id)}
                            className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            تأكيد
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePayment(month.payment.id)}
                          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-900/30 rounded transition-all duration-300 transform hover:scale-110"
                          title="حذف الدفعة"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {month.payment && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    تاريخ الدفع: {new Date(month.payment.date).toLocaleDateString('en-GB')}
                    {!month.payment.confirmed && (
                      <span className="mr-4 text-orange-600 dark:text-orange-400 font-medium animate-pulse">• يحتاج تأكيد</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {monthsHistory.length === 0 && (
            <div className="text-center py-8 animate-fade-in">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-bounce" />
              <p className="text-gray-600 dark:text-gray-400">لا توجد سجلات دفع حتى الآن</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryModal;