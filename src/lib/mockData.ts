import { Product, Employee, Bill, SalaryPayout } from '../types';

export const initialProducts: Product[] = [
  {
    id: 'p-1',
    name: 'Slim Fit Cotton Formal Shirt',
    category: 'Men',
    size: 'M',
    color: 'Sky Blue',
    barcode: 'CLOTH-8901',
    costPrice: 650,
    sellingPrice: 1299,
    stock: 24,
    minStockAlert: 5,
  },
  {
    id: 'p-2',
    name: 'Printed Silk Anarkali Kurti',
    category: 'Ethnic',
    size: 'L',
    color: 'Crimson Red',
    barcode: 'CLOTH-8902',
    costPrice: 950,
    sellingPrice: 2199,
    stock: 15,
    minStockAlert: 4,
  },
  {
    id: 'p-3',
    name: 'Stretchable Denim Jeans',
    category: 'Men',
    size: '32' as any,
    color: 'Dark Navy',
    barcode: 'CLOTH-8903',
    costPrice: 800,
    sellingPrice: 1799,
    stock: 18,
    minStockAlert: 6,
  },
  {
    id: 'p-4',
    name: 'Embroidered Chanderi Saree',
    category: 'Women',
    size: 'Free',
    color: 'Pastel Peach',
    barcode: 'CLOTH-8904',
    costPrice: 1600,
    sellingPrice: 3499,
    stock: 8,
    minStockAlert: 3,
  },
  {
    id: 'p-5',
    name: 'Casual Floral Summer Dress',
    category: 'Women',
    size: 'S',
    color: 'Sunflower Yellow',
    barcode: 'CLOTH-8905',
    costPrice: 550,
    sellingPrice: 1199,
    stock: 3,
    minStockAlert: 5,
  },
  {
    id: 'p-6',
    name: 'Kids Festive Kurta Pajama Set',
    category: 'Kids',
    size: 'M',
    color: 'Royal Blue',
    barcode: 'CLOTH-8906',
    costPrice: 450,
    sellingPrice: 999,
    stock: 12,
    minStockAlert: 4,
  },
  {
    id: 'p-7',
    name: 'Pure Leather Casual Belt',
    category: 'Accessories',
    size: 'Free',
    color: 'Tan Brown',
    barcode: 'CLOTH-8907',
    costPrice: 220,
    sellingPrice: 599,
    stock: 30,
    minStockAlert: 8,
  },
  {
    id: 'p-8',
    name: 'Heavy Silk Bridal Lehenga',
    category: 'Ethnic',
    size: 'Free',
    color: 'Deep Maroon',
    barcode: 'CLOTH-8908',
    costPrice: 5200,
    sellingPrice: 11999,
    stock: 2,
    minStockAlert: 2,
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 'emp-101',
    name: 'Rajesh Verma',
    role: 'Store Manager',
    phone: '+91 98765 43210',
    email: 'rajesh.verma@clothstore.com',
    joiningDate: '2023-04-10',
    baseSalary: 38000,
    status: 'Active',
    attendanceToday: 'Present',
    salesCommissionRate: 2
  },
  {
    id: 'emp-102',
    name: 'Pooja Sharma',
    role: 'Sales Executive',
    phone: '+91 98112 34567',
    email: 'pooja.sharma@clothstore.com',
    joiningDate: '2024-01-15',
    baseSalary: 22000,
    status: 'Active',
    attendanceToday: 'Present',
    salesCommissionRate: 3
  },
  {
    id: 'emp-103',
    name: 'Mohammad Imran',
    role: 'Tailor / Master',
    phone: '+91 98223 99881',
    email: 'imran.master@clothstore.com',
    joiningDate: '2023-08-01',
    baseSalary: 28000,
    status: 'Active',
    attendanceToday: 'Present',
    salesCommissionRate: 0
  },
  {
    id: 'emp-104',
    name: 'Anita Roy',
    role: 'Cashier',
    phone: '+91 97334 11223',
    email: 'anita.roy@clothstore.com',
    joiningDate: '2024-06-20',
    baseSalary: 20000,
    status: 'Active',
    attendanceToday: 'Late',
    salesCommissionRate: 0.5
  },
  {
    id: 'emp-105',
    name: 'Sunil Kumar',
    role: 'Helper',
    phone: '+91 96554 44332',
    email: 'sunil.kumar@clothstore.com',
    joiningDate: '2024-09-01',
    baseSalary: 14000,
    status: 'Active',
    attendanceToday: 'Present',
    salesCommissionRate: 0
  }
];

export const initialBills: Bill[] = [
  {
    id: 'bill-1001',
    invoiceNo: 'INV-2026-0891',
    customerName: 'Vikas Malhotra',
    customerPhone: '9845012345',
    items: [
      {
        productId: 'p-1',
        productName: 'Slim Fit Cotton Formal Shirt',
        size: 'M',
        quantity: 2,
        price: 1299,
        subtotal: 2598
      },
      {
        productId: 'p-7',
        productName: 'Pure Leather Casual Belt',
        size: 'Free',
        quantity: 1,
        price: 599,
        subtotal: 599
      }
    ],
    subtotal: 3197,
    taxAmount: 160,
    discountAmount: 200,
    totalAmount: 3157,
    paymentMethod: 'UPI',
    createdAt: '2026-10-21 11:45 AM',
    cashierName: 'Anita Roy'
  },
  {
    id: 'bill-1002',
    invoiceNo: 'INV-2026-0892',
    customerName: 'Sneha Patel',
    customerPhone: '9920199201',
    items: [
      {
        productId: 'p-2',
        productName: 'Printed Silk Anarkali Kurti',
        size: 'L',
        quantity: 1,
        price: 2199,
        subtotal: 2199
      }
    ],
    subtotal: 2199,
    taxAmount: 110,
    discountAmount: 100,
    totalAmount: 2209,
    paymentMethod: 'Card',
    createdAt: '2026-10-21 02:15 PM',
    cashierName: 'Anita Roy'
  }
];

export const initialSalaries: SalaryPayout[] = [
  {
    id: 'sal-1',
    employeeId: 'emp-101',
    employeeName: 'Rajesh Verma',
    month: 'September 2026',
    baseSalary: 38000,
    bonus: 3500,
    deductions: 500,
    netSalary: 41000,
    paidDate: '2026-10-01',
    paymentMode: 'Bank Transfer',
    status: 'Paid',
    payslipNo: 'PAY-SEP-101'
  },
  {
    id: 'sal-2',
    employeeId: 'emp-102',
    employeeName: 'Pooja Sharma',
    month: 'September 2026',
    baseSalary: 22000,
    bonus: 2800,
    deductions: 0,
    netSalary: 24800,
    paidDate: '2026-10-01',
    paymentMode: 'UPI',
    status: 'Paid',
    payslipNo: 'PAY-SEP-102'
  },
  {
    id: 'sal-3',
    employeeId: 'emp-103',
    employeeName: 'Mohammad Imran',
    month: 'September 2026',
    baseSalary: 28000,
    bonus: 1000,
    deductions: 0,
    netSalary: 29000,
    paidDate: '2026-10-02',
    paymentMode: 'Bank Transfer',
    status: 'Paid',
    payslipNo: 'PAY-SEP-103'
  }
];
