import React, { useState } from 'react';
import { Student } from '../types';
import { X, Save, User } from 'lucide-react';

interface EditStudentModalProps {
  student: Student;
  onClose: () => void;
  onSave: (updatedStudent: Student) => void;
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
  'السنة السابعة'
];

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: student.name,
    department: student.department,
    studyLevel: student.studyLevel,
    birthPlace: student.birthPlace,
    roomNumber: student.roomNumber,
    floorNumber: student.floorNumber
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم الطالب مطلوب';
    }
    if (!formData.department.trim()) {
      newErrors.department = 'الكلية مطلوبة';
    }
    if (!formData.studyLevel.trim()) {
      newErrors.studyLevel = 'المرحلة الدراسية مطلوبة';
    }
    if (!formData.birthPlace.trim()) {
      newErrors.birthPlace = 'مكان الميلاد مطلوب';
    }
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'رقم الغرفة مطلوب';
    }
    if (!formData.floorNumber.trim()) {
      newErrors.floorNumber = 'رقم الطابق مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedStudent: Student = {
        ...student,
        ...formData
      };
      onSave(updatedStudent);
      onClose();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" dir="rtl">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/20 dark:border-gray-700/20 transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-2 animate-pulse">
              <User className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">تعديل بيانات الطالب</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              اسم الطالب
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
                errors.name ? 'border-red-300 animate-shake' : 'border-gray-300/50 dark:border-gray-600/50'
              }`}
              placeholder="أدخل اسم الطالب"
              dir="auto"
            />
            {errors.name && <p className="text-red-600 dark:text-red-400 text-sm mt-1 animate-fade-in">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              الكلية
            </label>
            <select
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
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
              value={formData.studyLevel}
              onChange={(e) => handleChange('studyLevel', e.target.value)}
              className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
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
              value={formData.birthPlace}
              onChange={(e) => handleChange('birthPlace', e.target.value)}
              className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
                errors.birthPlace ? 'border-red-300 animate-shake' : 'border-gray-300/50 dark:border-gray-600/50'
              }`}
              placeholder="أدخل مكان الميلاد"
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
                value={formData.roomNumber}
                onChange={(e) => handleChange('roomNumber', e.target.value)}
                className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
                  errors.roomNumber ? 'border-red-300 animate-shake' : 'border-gray-300/50 dark:border-gray-600/50'
                }`}
                placeholder="الغرفة"
              />
              {errors.roomNumber && <p className="text-red-600 dark:text-red-400 text-sm mt-1 animate-fade-in">{errors.roomNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                رقم الطابق
              </label>
              <input
                type="text"
                value={formData.floorNumber}
                onChange={(e) => handleChange('floorNumber', e.target.value)}
                className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-right bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
                  errors.floorNumber ? 'border-red-300 animate-shake' : 'border-gray-300/50 dark:border-gray-600/50'
                }`}
                placeholder="الطابق"
              />
              {errors.floorNumber && <p className="text-red-600 dark:text-red-400 text-sm mt-1 animate-fade-in">{errors.floorNumber}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;