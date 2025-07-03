import { Student, Payment } from '../types';

const departments = [
  'كلية الطب',
  'كلية الهندسة',
  'كلية العلوم',
  'كلية الآداب',
  'كلية إدارة الأعمال'
];

const studyLevels = [
  'السنة الأولى',
  'السنة الثانية',
  'السنة الثالثة',
  'السنة الرابعة',
  'السنة الخامسة'
];

const generatePaymentHistory = (startDate: string): Payment[] => {
  const payments: Payment[] = [];
  const start = new Date(startDate);
  const now = new Date();
  
  let current = new Date(start);
  let paymentId = 1;
  
  while (current <= now) {
    // 80% chance of payment being made
    const isPaid = Math.random() > 0.2;
    
    if (isPaid) {
      payments.push({
        id: `payment-${paymentId++}`,
        amount: Math.floor(Math.random() * 500) + 200,
        date: current.toISOString().split('T')[0],
        month: current.toLocaleDateString('en-US', { month: 'long' }),
        year: current.getFullYear(),
        confirmed: Math.random() > 0.1 // 90% confirmed
      });
    }
    
    current.setMonth(current.getMonth() + 1);
  }
  
  return payments;
};

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'أحمد محمد علي',
    department: 'كلية الهندسة',
    studyLevel: 'السنة الثالثة',
    birthPlace: 'الرياض',
    roomNumber: '101',
    floorNumber: '1',
    payments: generatePaymentHistory('2023-09-01'),
    dateAdded: '2023-09-01'
  },
  {
    id: '2',
    name: 'سارة جونسون',
    department: 'كلية الطب',
    studyLevel: 'السنة الخامسة',
    birthPlace: 'نيويورك',
    roomNumber: '205',
    floorNumber: '2',
    payments: generatePaymentHistory('2023-08-15'),
    dateAdded: '2023-08-15'
  },
  {
    id: '3',
    name: 'فاطمة أحمد الزهراني',
    department: 'كلية الآداب',
    studyLevel: 'السنة الثانية',
    birthPlace: 'جدة',
    roomNumber: '312',
    floorNumber: '3',
    payments: generatePaymentHistory('2023-09-10'),
    dateAdded: '2023-09-10'
  },
  {
    id: '4',
    name: 'مايكل تشين',
    department: 'كلية العلوم',
    studyLevel: 'السنة الرابعة',
    birthPlace: 'لوس أنجلوس',
    roomNumber: '108',
    floorNumber: '1',
    payments: generatePaymentHistory('2023-07-20'),
    dateAdded: '2023-07-20'
  },
  {
    id: '5',
    name: 'عبدالله سعد القحطاني',
    department: 'كلية إدارة الأعمال',
    studyLevel: 'السنة الأولى',
    birthPlace: 'الدمام',
    roomNumber: '220',
    floorNumber: '2',
    payments: generatePaymentHistory('2023-08-01'),
    dateAdded: '2023-08-01'
  }
];