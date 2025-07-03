    import React, { useState, useMemo } from 'react';
    import { Student, SortField, SortOrder, PaymentSummary } from '../types';
    import { 
      Search, 
      Plus, 
      ArrowUpDown, 
      Users, 
      UserCheck, 
      UserX, 
      TrendingUp,
      Download,
      RotateCcw,
      AlertTriangle,
      X
    } from 'lucide-react';
    import StudentCard from './StudentCard';
    import AddPaymentModal from './AddPaymentModal';
    import EditStudentModal from './EditStudentModal';

    interface StudentsPageProps {
      students: Student[];
      deletedStudents: Student[];
      onUpdateStudent: (student: Student) => void;
      onDeleteStudent: (studentId: string) => void;
      onRestoreStudent: (student: Student) => void;
      onAddPayment: (studentId: string, amount: number) => void;
      onAddStudent: (student: Omit<Student, 'id' | 'payments' | 'dateAdded'>) => void;
      onConfirmPayment: (studentId: string, paymentId: string) => void;
      onDeletePayment: (studentId: string, paymentId: string) => void;
    }

    const StudentsPage: React.FC<StudentsPageProps> = ({
      students,
      deletedStudents,
      onUpdateStudent,
      onDeleteStudent,
      onRestoreStudent,
      onAddPayment,
      onAddStudent,
      onConfirmPayment,
      onDeletePayment
    }) => {
      const [searchTerm, setSearchTerm] = useState('');
      const [sortField, setSortField] = useState<SortField>('name');
      const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
      const [showAddPayment, setShowAddPayment] = useState(false);
      const [editingStudent, setEditingStudent] = useState<Student | null>(null);
      const [showDeletedStudents, setShowDeletedStudents] = useState(false);
      const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; student: Student | null }>({
        show: false,
        student: null
      });

      const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
      const currentYear = new Date().getFullYear();

      const paymentSummary = useMemo((): PaymentSummary => {
        const totalStudents = students.length;
        const activeStudents = students.filter(student => 
          student.payments.some(p => 
            p.month === currentMonth && 
            p.year === currentYear && 
            p.confirmed
          )
        ).length;
        const inactiveStudents = totalStudents - activeStudents;
        const currentMonthTotal = students.reduce((total, student) => {
          const monthPayment = student.payments.find(p => 
            p.month === currentMonth && 
            p.year === currentYear && 
            p.confirmed
          );
          return total + (monthPayment?.amount || 0);
        }, 0);

        return {
          totalStudents,
          activeStudents,
          inactiveStudents,
          currentMonthTotal
        };
      }, [students, currentMonth, currentYear]);

      const filteredAndSortedStudents = useMemo(() => {
        const studentsToFilter = showDeletedStudents ? deletedStudents : students;
    
        let filtered = studentsToFilter.filter(student =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.roomNumber.includes(searchTerm)
        );

        filtered.sort((a, b) => {
          let aValue: string | number;
          let bValue: string | number;

          switch (sortField) {
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'date':
              aValue = new Date(a.dateAdded).getTime();
              bValue = new Date(b.dateAdded).getTime();
              break;
            case 'room':
              aValue = parseInt(a.roomNumber);
              bValue = parseInt(b.roomNumber);
              break;
            case 'floor':
              aValue = parseInt(a.floorNumber);
              bValue = parseInt(b.floorNumber);
              break;
            case 'amount':
              aValue = a.payments.filter(p => p.confirmed).reduce((sum, p) => sum + p.amount, 0);
              bValue = b.payments.filter(p => p.confirmed).reduce((sum, p) => sum + p.amount, 0);
              break;
            default:
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
          }

          if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });

        return filtered;
      }, [students, deletedStudents, searchTerm, sortField, sortOrder, showDeletedStudents]);

      const handleSort = (field: SortField) => {
        if (sortField === field) {
          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
          setSortField(field);
          setSortOrder('asc');
        }
      };

      const handleDeleteRequest = (student: Student) => {
        setDeleteConfirmation({ show: true, student });
      };

      const handleConfirmDelete = () => {
        if (deleteConfirmation.student) {
          onDeleteStudent(deleteConfirmation.student.id);
          setDeleteConfirmation({ show: false, student: null });
        }
      };

      const handleCancelDelete = () => {
        setDeleteConfirmation({ show: false, student: null });
      };

      const handlePrintReceipt = (student: Student) => {
        const latestPayment = student.payments
          .filter(p => p.confirmed)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        if (!latestPayment) {
          alert('لا توجد مدفوعات مؤكدة لهذا الطالب.');
          return;
        }

        const receiptContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <title>إيصال دفع</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');
            @page {
                size: A4;
                margin: 15mm;
            }
            body {
                font-family: 'Cairo', sans-serif;
                max-width: 180mm;
                margin: 0 auto;
                padding: 10px;
                line-height: 1.4;
                direction: rtl;
                text-align: right;
                background: white;
                color: black;
                font-size: 12pt;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
                margin-bottom: 15px;
            }
            .title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
                color: #000;
            }
            .subtitle {
                font-size: 14px;
                color: #333;
            }
            .section {
                margin: 12px 0;
            }
            .row {
                display: flex;
                justify-content: space-between;
                margin: 8px 0;
                padding: 3px 0;
            }
            .label {
                font-weight: bold;
                color: #000;
                min-width: 100px;
            }
            .value {
                color: #000;
                flex: 1;
                text-align: left;
            }
            .amount-box {
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                border: 2px solid #000;
                padding: 10px;
                margin: 15px 0;
                background: #f9f9f9;
            }
            .footer {
                border-top: 1px solid #000;
                padding-top: 10px;
                margin-top: 20px;
                text-align: center;
                font-size: 11px;
            }
            .copy-section {
                border-top: 2px dashed #000;
                margin-top: 25px;
                padding-top: 15px;
            }
            @media print {
                body { 
                    margin: 0; 
                    padding: 10mm;
                    font-size: 11pt;
                }
                .copy-section {
                    margin-top: 20px;
                }
            }
        </style>
    </head>
    <body>
        <!-- نسخة الموظف -->
        <div class="header">
            <div class="title">إيصال دفع الطالب</div>
            <div class="subtitle">نظام إدارة الطلاب</div>
        </div>

        <div class="section">
            <div class="row">
                <span class="label">رقم الإيصال:</span>
                <span class="value">${latestPayment.id.toUpperCase()}</span>
            </div>
            <div class="row">
                <span class="label">التاريخ:</span>
                <span class="value">${new Date().toLocaleDateString('en-GB')}</span>
            </div>
            <div class="row">
                <span class="label">الوقت:</span>
                <span class="value">${new Date().toLocaleTimeString('en-GB')}</span>
            </div>
        </div>

        <div class="section">
            <div class="row">
                <span class="label">اسم الطالب:</span>
                <span class="value">${student.name}</span>
            </div>
            <div class="row">
                <span class="label">الكلية:</span>
                <span class="value">${student.department}</span>
            </div>
            <div class="row">
                <span class="label">المرحلة الدراسية:</span>
                <span class="value">${student.studyLevel}</span>
            </div>
            <div class="row">
                <span class="label">الغرفة:</span>
                <span class="value">${student.roomNumber}</span>
            </div>
            <div class="row">
                <span class="label">الطابق:</span>
                <span class="value">${student.floorNumber}</span>
            </div>
        </div>

        <div class="section">
            <div class="row">
                <span class="label">الدفع عن شهر:</span>
                <span class="value">${new Date().toLocaleDateString('ar', { month: 'long', year: 'numeric' })}</span>
            </div>
            <div class="row">
                <span class="label">تاريخ الدفع:</span>
                <span class="value">${new Date(latestPayment.date).toLocaleDateString('en-GB')}</span>
            </div>
        </div>

        <div class="amount-box">
            المبلغ المدفوع: ${latestPayment.amount.toLocaleString()}
        </div>

        <div class="footer">
            <div><strong>نسخة الموظف</strong></div>
        </div>

        <!-- نسخة الطالب -->
        <div class="copy-section">
            <div class="header">
                <div class="title">إيصال دفع الطالب</div>
                <div class="subtitle">نظام إدارة الطلاب</div>
            </div>

            <div class="section">
                <div class="row">
                    <span class="label">رقم الإيصال:</span>
                    <span class="value">${latestPayment.id.toUpperCase()}</span>
                </div>
                <div class="row">
                    <span class="label">التاريخ:</span>
                    <span class="value">${new Date().toLocaleDateString('en-GB')}</span>
                </div>
                <div class="row">
                    <span class="label">الوقت:</span>
                    <span class="value">${new Date().toLocaleTimeString('en-GB')}</span>
                </div>
            </div>

            <div class="section">
                <div class="row">
                    <span class="label">اسم الطالب:</span>
                    <span class="value">${student.name}</span>
                </div>
                <div class="row">
                    <span class="label">الكلية:</span>
                    <span class="value">${student.department}</span>
                </div>
                <div class="row">
                    <span class="label">المرحلة الدراسية:</span>
                    <span class="value">${student.studyLevel}</span>
                </div>
                <div class="row">
                    <span class="label">الغرفة:</span>
                    <span class="value">${student.roomNumber}</span>
                </div>
                <div class="row">
                    <span class="label">الطابق:</span>
                    <span class="value">${student.floorNumber}</span>
                </div>
            </div>

            <div class="section">
                <div class="row">
                    <span class="label">الدفع عن شهر:</span>
                    <span class="value">${new Date().toLocaleDateString('ar', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div class="row">
                    <span class="label">تاريخ الدفع:</span>
                    <span class="value">${new Date(latestPayment.date).toLocaleDateString('en-GB')}</span>
                </div>
            </div>

            <div class="amount-box">
                المبلغ المدفوع: ${latestPayment.amount.toLocaleString()}
            </div>

            <div class="footer">
                <div><strong>نسخة الطالب</strong></div>
            </div>
        </div>
    </body>
    </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(receiptContent);
          printWindow.document.close();
        }
      };

      const exportToExcel = () => {
        const csvContent = [
          ['الاسم', 'الكلية', 'المرحلة الدراسية', 'مكان الميلاد', 'الغرفة', 'الطابق', 'إجمالي المدفوع', 'الحالة'],
          ...students.map(student => [
            student.name,
            student.department,
            student.studyLevel,
            student.birthPlace,
            student.roomNumber,
            student.floorNumber,
            student.payments.filter(p => p.confirmed).reduce((sum, p) => sum + p.amount, 0),
            student.payments.some(p => p.month === currentMonth && p.year === currentYear && p.confirmed) ? 'نشط' : 'غير نشط'
          ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'بيانات_الطلاب.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      };

      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
          {/* Summary Cards */}
          {!showDeletedStudents && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي الطلاب</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{paymentSummary.totalStudents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الطلاب النشطون</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{paymentSummary.activeStudents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الطلاب غير النشطين</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{paymentSummary.inactiveStudents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">هذا الشهر</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{paymentSummary.currentMonthTotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 transition-colors duration-300">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="البحث عن الطلاب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="name">ترتيب حسب الاسم</option>
                  <option value="date">ترتيب حسب التاريخ</option>
                  <option value="room">ترتيب حسب الغرفة</option>
                  <option value="floor">ترتيب حسب الطابق</option>
                  <option value="amount">ترتيب حسب المبلغ</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 text-gray-900 dark:text-white"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </button>

                {!showDeletedStudents && (
                  <>
                    <button
                      onClick={() => setShowAddPayment(true)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة دفعة
                    </button>

                    <button
                      onClick={exportToExcel}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4 ml-2" />
                      تصدير
                    </button>
                  </>
                )}

                <button
                  onClick={() => setShowDeletedStudents(!showDeletedStudents)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    showDeletedStudents
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  <RotateCcw className="h-4 w-4 ml-2" />
                  {showDeletedStudents ? 'عرض النشطين' : `المحذوفين (${deletedStudents.length})`}
                </button>
              </div>
            </div>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedStudents.map((student) => (
              <div key={student.id} className="relative">
                <StudentCard
                  student={student}
                  onEdit={setEditingStudent}
                  onDelete={handleDeleteRequest}
                  onConfirmPayment={onConfirmPayment}
                  onDeletePayment={onDeletePayment}
                  onPrintReceipt={handlePrintReceipt}
                />
                {showDeletedStudents && (
                  <div className="absolute top-2 left-2">
                    <button
                      onClick={() => onRestoreStudent(student)}
                      className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <RotateCcw className="h-3 w-3 ml-1" />
                      استعادة
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredAndSortedStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {showDeletedStudents ? 'لا توجد طلاب محذوفين' : 'لا توجد طلاب'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {showDeletedStudents ? 'جميع الطلاب نشطون' : 'جرب تعديل معايير البحث'}
              </p>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmation.show && deleteConfirmation.student && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
              <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-300 scale-100">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full">
                    <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                </div>
            
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    تأكيد حذف الطالب
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    هل أنت متأكد من حذف الطالب؟
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                    <p className="font-semibold text-gray-900 dark:text-white text-right" dir="auto">
                      {deleteConfirmation.student.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-right" dir="auto">
                      {deleteConfirmation.student.department}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-right">
                      غرفة {deleteConfirmation.student.roomNumber}، طابق {deleteConfirmation.student.floorNumber}
                    </p>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    ⚠️ سيتم نقل الطالب إلى قائمة المحذوفين ويمكن استعادته لاحقاً
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCancelDelete}
                    className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium"
                  >
                    <X className="h-4 w-4 ml-2" />
                    إلغاء
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    <AlertTriangle className="h-4 w-4 ml-2" />
                    تأكيد الحذف
                  </button>
                </div>
              </div>
            </div>
          )}

          {showAddPayment && (
            <AddPaymentModal
              students={students}
              onClose={() => setShowAddPayment(false)}
              onAddPayment={onAddPayment}
              onAddStudent={onAddStudent}
            />
          )}

          {editingStudent && (
            <EditStudentModal
              student={editingStudent}
              onClose={() => setEditingStudent(null)}
              onSave={onUpdateStudent}
            />
          )}
        </div>
      );
    };

    export default StudentsPage;