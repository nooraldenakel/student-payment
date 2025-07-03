import React, { useMemo } from 'react';
import { Student } from '../types';
import { 
  Users, 
  UserCheck, 
  UserX, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Download,
  BarChart3,
  PieChart
} from 'lucide-react';

interface ReportsPageProps {
  students: Student[];
  onLogout: () => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ students, onLogout }) => {
  const reports = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    const today = currentDate.toISOString().split('T')[0];

    // Basic counts
    const totalStudents = students.length;
    const activeStudents = students.filter(student => 
      student.payments.some(p => 
        p.month === currentMonth && 
        p.year === currentYear && 
        p.confirmed
      )
    ).length;
    const inactiveStudents = totalStudents - activeStudents;

    // Behind on payments (haven't paid for current month)
    const behindOnPayments = inactiveStudents;

    // Payment totals
    const totalAmountOverall = students.reduce((total, student) => 
      total + student.payments.filter(p => p.confirmed).reduce((sum, p) => sum + p.amount, 0), 0
    );

    const totalAmountMonthly = students.reduce((total, student) => {
      const monthPayment = student.payments.find(p => 
        p.month === currentMonth && 
        p.year === currentYear && 
        p.confirmed
      );
      return total + (monthPayment?.amount || 0);
    }, 0);

    const totalAmountDaily = students.reduce((total, student) => {
      const todayPayments = student.payments.filter(p => 
        p.date === today && p.confirmed
      );
      return total + todayPayments.reduce((sum, p) => sum + p.amount, 0);
    }, 0);

    // Monthly breakdown for the past 12 months
    const monthlyBreakdown = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleDateString('en-US', { month: 'long' });
      const monthArabic = date.toLocaleDateString('ar', { month: 'long' });
      const year = date.getFullYear();
      
      const monthTotal = students.reduce((total, student) => {
        const monthPayment = student.payments.find(p => 
          p.month === month && 
          p.year === year && 
          p.confirmed
        );
        return total + (monthPayment?.amount || 0);
      }, 0);

      const activeThatMonth = students.filter(student => 
        student.payments.some(p => 
          p.month === month && 
          p.year === year && 
          p.confirmed
        )
      ).length;

      monthlyBreakdown.push({
        month: `${monthArabic} ${year}`,
        total: monthTotal,
        activeStudents: activeThatMonth
      });
    }

    // Department breakdown
    const departmentStats = students.reduce((stats, student) => {
      const dept = student.department;
      if (!stats[dept]) {
        stats[dept] = { count: 0, totalPaid: 0, active: 0 };
      }
      stats[dept].count++;
      stats[dept].totalPaid += student.payments.filter(p => p.confirmed).reduce((sum, p) => sum + p.amount, 0);
      if (student.payments.some(p => p.month === currentMonth && p.year === currentYear && p.confirmed)) {
        stats[dept].active++;
      }
      return stats;
    }, {} as Record<string, { count: number; totalPaid: number; active: number }>);

    return {
      totalStudents,
      activeStudents,
      inactiveStudents,
      behindOnPayments,
      totalAmountOverall,
      totalAmountMonthly,
      totalAmountDaily,
      monthlyBreakdown,
      departmentStats
    };
  }, [students]);

  const exportDetailedReport = () => {
    const reportData = [
      ['تقرير شامل عن الطلاب'],
      ['تم إنشاؤه في:', new Date().toLocaleDateString('en-GB')],
      [''],
      ['إحصائيات موجزة'],
      ['إجمالي الطلاب:', reports.totalStudents],
      ['الطلاب النشطون (الشهر الحالي):', reports.activeStudents],
      ['الطلاب غير النشطين:', reports.inactiveStudents],
      ['الطلاب المتأخرون في الدفع:', reports.behindOnPayments],
      [''],
      ['الملخص المالي'],
      ['إجمالي المبلغ المحصل (عام):', reports.totalAmountOverall.toLocaleString()],
      ['إجمالي المبلغ (الشهر الحالي):', reports.totalAmountMonthly.toLocaleString()],
      ['إجمالي المبلغ (اليوم):', reports.totalAmountDaily.toLocaleString()],
      [''],
      ['التفصيل الشهري'],
      ['الشهر', 'إجمالي المبلغ', 'الطلاب النشطون'],
      ...reports.monthlyBreakdown.map(month => [
        month.month,
        month.total.toLocaleString(),
        month.activeStudents
      ]),
      [''],
      ['تفصيل الكليات'],
      ['الكلية', 'عدد الطلاب', 'إجمالي المدفوع', 'الطلاب النشطون'],
      ...Object.entries(reports.departmentStats).map(([dept, stats]) => [
        dept,
        stats.count,
        stats.totalPaid.toLocaleString(),
        stats.active
      ])
    ];

    const csvContent = reportData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `تقرير_مفصل_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Shapes */}
        <div className="absolute top-10 right-10 w-16 h-16 bg-blue-400/10 dark:bg-blue-600/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute top-32 left-20 w-12 h-12 bg-green-400/10 dark:bg-green-600/10 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-20 right-32 w-20 h-20 bg-purple-400/10 dark:bg-purple-600/10 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
        <div className="absolute bottom-32 left-10 w-8 h-8 bg-yellow-400/10 dark:bg-yellow-600/10 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        
        {/* Animated Waves */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-transparent dark:from-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-transparent dark:from-green-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '6s' }}></div>
        </div>

        {/* Geometric Patterns */}
        <div className="absolute top-20 left-1/4 w-6 h-6 border-2 border-blue-400/20 dark:border-blue-600/20 rotate-45 animate-spin" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-40 right-1/4 w-4 h-4 border-2 border-green-400/20 dark:border-green-600/20 rotate-45 animate-spin" style={{ animationDelay: '3s', animationDuration: '15s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg mr-3 animate-pulse">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                التقارير والإحصائيات
              </h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={exportDetailedReport}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Download className="h-5 w-5 ml-2" />
                تصدير التقرير
              </button>
              <button
                onClick={onLogout}
                className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg animate-pulse">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي الطلاب</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{reports.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}>
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الطلاب النشطون</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{reports.activeStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg animate-pulse" style={{ animationDelay: '1s' }}>
                <UserX className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الطلاب غير النشطين</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{reports.inactiveStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg animate-pulse" style={{ animationDelay: '1.5s' }}>
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">متأخرون في الدفع</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{reports.behindOnPayments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg animate-pulse" style={{ animationDelay: '2s' }}>
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي المحصل</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.totalAmountOverall.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg animate-pulse" style={{ animationDelay: '2.5s' }}>
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">هذا الشهر</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.totalAmountMonthly.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg animate-pulse" style={{ animationDelay: '3s' }}>
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">اليوم</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.totalAmountDaily.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl p-6 mb-8 transition-all duration-300 border border-white/20 dark:border-gray-700/20 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-3 animate-pulse" style={{ animationDelay: '3.5s' }}>
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">الأداء الشهري</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
              <thead className="bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الشهر
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    إجمالي المبلغ
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الطلاب النشطون
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {reports.monthlyBreakdown.map((month, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-[1.02]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right">
                      {month.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right font-semibold">
                      {month.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                      {month.activeStudents}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl p-6 transition-all duration-300 border border-white/20 dark:border-gray-700/20 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg mr-3 animate-pulse" style={{ animationDelay: '4s' }}>
              <PieChart className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-green-800 dark:from-white dark:to-green-300 bg-clip-text text-transparent">إحصائيات الكليات</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(reports.departmentStats).map(([department, stats], index) => (
              <div key={department} className="bg-gray-50/70 dark:bg-gray-700/70 backdrop-blur-sm p-4 rounded-xl transition-all duration-300 hover:bg-gray-100/70 dark:hover:bg-gray-600/70 transform hover:scale-105 animate-fade-in" style={{ animationDelay: `${1 + index * 0.1}s` }}>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-right" dir="auto">{department}</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between items-center">
                    <span>الطلاب:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{stats.count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>النشطون:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{stats.active}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>إجمالي المدفوع:</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">{stats.totalPaid.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;