import React, { useState } from 'react';
import { Student } from '../types';
import { X, Search, Plus, DollarSign, User } from 'lucide-react';

interface AddPaymentModalProps {
  students: Student[];
  onClose: () => void;
  onAddPayment: (studentId: string, amount: number) => void;
  onAddStudent: (student: Omit<Student, 'id' | 'payments' | 'dateAdded'>) => void;
}

const departments = [
  'كلية الطب',
  'كلية الهندسة',
  'كلية العلوم',
  'كلية الآداب',
  'كلية إدارة الأعمال',
  'كلية الحقوق',
  'كلية التربية',
  'كلية الصيدلة',
  'كلية طب الأسنان',
  'كلية العلوم الطبية التطبيقية',
  'كلية الحاسب الآلي وتقنية المعلومات',
  'كلية العمارة والتخطيط'
];

const studyLevels = [
  'السنة الأولى',
  'السنة الثانية',
  'السنة الثالثة',
  'السنة الرابعة',
  'السنة الخامسة',
  'السنة السادسة',
];

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  students,
  onClose,
  onAddPayment,
  onAddStudent
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewStudentForm, setShowNewStudentForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    department: '',
    studyLevel: '',
    birthPlace: '',
    roomNumber: '',
    floorNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roomNumber.includes(searchTerm)
  );

  const handleAddPayment = async () => {
        if (selectedStudent && amount) {
            const payload = {
                studentId: selectedStudent.id,
                amount: parseFloat(amount),
                date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                month: (new Date().getMonth() + 1).toString(), // JS months start from 0
                year: new Date().getFullYear(),
                confirmed: false
            };
            console.log("payload - information:", payload);
            try {
                const response = await fetch("https://student-payment-app-production.up.railway.app/payments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error("Failed to add payment");
                }

                const data = await response.json();
                console.log("Payment added:", data);
                onAddPayment(selectedStudent.id, parseFloat(amount)); // optional callback
                onClose();
            } catch (error) {
                console.error("Error adding payment:", error);
            }
        }
    };

  const validateNewStudent = () => {
    const newErrors: Record<string, string> = {};

    if (!newStudent.name.trim()) {
      newErrors.name = 'اسم الطالب مطلوب';
    }
    if (!newStudent.department.trim()) {
      newErrors.department = 'الكلية مطلوبة';
    }
    if (!newStudent.studyLevel.trim()) {
      newErrors.studyLevel = 'المرحلة الدراسية مطلوبة';
    }
    if (!newStudent.birthPlace.trim()) {
      newErrors.birthPlace = 'مكان الميلاد مطلوب';
    }
    if (!newStudent.roomNumber.trim()) {
      newErrors.roomNumber = 'رقم الغرفة مطلوب';
    }
    if (!newStudent.floorNumber.trim()) {
      newErrors.floorNumber = 'رقم الطابق مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterNewStudent = async () => {
        if (validateNewStudent()) {
            try {
                const response = await fetch("https://student-payment-app-production.up.railway.app/students", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newStudent)
                });

                if (!response.ok) {
                    throw new Error("Failed to register new student");
                }

                const createdStudent = await response.json();
                console.log("✅ Student added:", createdStudent);

                onAddStudent(createdStudent); // حتى تحدث القائمة بعد الرد
                setShowNewStudentForm(false);
                setNewStudent({
                    name: '',
                    department: '',
                    studyLevel: '',
                    birthPlace: '',
                    roomNumber: '',
                    floorNumber: ''
                });
                setErrors({});
            } catch (error) {
                console.error("Error registering student:", error);
            }
        }
    };

  const handleNewStudentChange = (field: string, value: string) => {
    setNewStudent(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" dir="rtl">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/20 dark:border-gray-700/20 transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-3 animate-pulse">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">إضافة دفعة</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {!selectedStudent ? (
            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="البحث عن طالب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-right" dir="auto">{student.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-right" dir="auto">{student.department}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gray-600 dark:text-gray-400">غرفة {student.roomNumber}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">طابق {student.floorNumber}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                <button
                  onClick={() => setShowNewStudentForm(true)}
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300/50 dark:border-gray-600/50 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  تسجيل طالب جديد
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl backdrop-blur-sm">
                <h3 className="font-medium text-blue-900 dark:text-blue-300 text-right" dir="auto">{selectedStudent.name}</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 text-right" dir="auto">{selectedStudent.department}</p>
                <p className="text-sm text-blue-700 dark:text-blue-400 text-right">غرفة {selectedStudent.roomNumber}، طابق {selectedStudent.floorNumber}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  مبلغ الدفعة
                </label>
                <div className="relative group">
                  <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300"
                    placeholder="أدخل المبلغ"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="flex-1 px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105"
                >
                  رجوع
                </button>
                <button
                  onClick={handleAddPayment}
                  disabled={!amount}
                  className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    amount
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  إضافة الدفعة
                </button>
              </div>
            </div>
          )}

          {showNewStudentForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-60 animate-fade-in">
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg mr-2 animate-pulse">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-green-800 dark:from-white dark:to-green-300 bg-clip-text text-transparent">تسجيل طالب جديد</h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowNewStudentForm(false);
                      setErrors({});
                    }}
                    className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 transform hover:scale-110"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      اسم الطالب
                    </label>
                    <input
                      type="text"
                      placeholder="أدخل اسم الطالب"
                      value={newStudent.name}
                      onChange={(e) => handleNewStudentChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
                        errors.name ? 'border-red-300 animate-shake' : 'border-gray-300/50 dark:border-gray-600/50'
                      }`}
                      dir="auto"
                    />
                    {errors.name && <p className="text-red-600 dark:text-red-400 text-sm mt-1 animate-fade-in">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      الكلية
                    </label>
                    <select
                      value={newStudent.department}
                      onChange={(e) => handleNewStudentChange('department', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
                        errors.department ? 'border-red-300 animate-shake' : 'border-gray-300/50 dark:border-gray-600/50'
                      }`}
                    >
                      <option value="">اختر الكلية</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && <p className="text-red-600 dark:text-red-400 text-sm mt-1 animate-fade-in">{errors.department}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      المرحلة الدراسية
                    </label>
                    <select
                      value={newStudent.studyLevel}
                      onChange={(e) => handleNewStudentChange('studyLevel', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
                        errors.studyLevel ? 'border-red-300 animate-shake' : 'border-gray-300/50 dark:border-gray-600/50'
                      }`}
                    >
                      <option value="">اختر المرحلة الدراسية</option>
                      {studyLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    {errors.studyLevel && <p className="text-red-600 dark:text-red-400 text-sm mt-1 animate-fade-in">{errors.studyLevel}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      مكان الميلاد
                    </label>
                    <input
                      type="text"
                      placeholder="أدخل مكان الميلاد"
                      value={newStudent.birthPlace}
                      onChange={(e) => handleNewStudentChange('birthPlace', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
                        errors.birthPlace ? 'border-red-300 animate-shake' : 'border-gray-300/50 dark:border-gray-600/50'
                      }`}
                      dir="auto"
                    />
                    {errors.birthPlace && <p className="text-red-600 dark:text-red-400 text-sm mt-1 animate-fade-in">{errors.birthPlace}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        رقم الغرفة
                      </label>
                      <input
                        type="text"
                        placeholder="الغرفة"
                        value={newStudent.roomNumber}
                        onChange={(e) => handleNewStudentChange('roomNumber', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
                          errors.roomNumber ? 'border-red-300 animate-shake' : 'border-gray-300/50 dark:border-gray-600/50'
                        }`}
                      />
                      {errors.roomNumber && <p className="text-red-600 dark:text-red-400 text-sm mt-1 animate-fade-in">{errors.roomNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        رقم الطابق
                      </label>
                      <input
                        type="text"
                        placeholder="الطابق"
                        value={newStudent.floorNumber}
                        onChange={(e) => handleNewStudentChange('floorNumber', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
                          errors.floorNumber ? 'border-red-300 animate-shake' : 'border-gray-300/50 dark:border-gray-600/50'
                        }`}
                      />
                      {errors.floorNumber && <p className="text-red-600 dark:text-red-400 text-sm mt-1 animate-fade-in">{errors.floorNumber}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowNewStudentForm(false);
                      setErrors({});
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleRegisterNewStudent}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    تسجيل الطالب
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;