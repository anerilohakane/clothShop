export interface Product {
  id: string;
  name: string;
  category: 'Men' | 'Women' | 'Kids' | 'Ethnic' | 'Accessories';
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free';
  color: string;
  barcode: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStockAlert: number;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discountPercent: number;
}

export interface Bill {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerPhone: string;
  items: {
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Split';
  createdAt: string;
  cashierName: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'Store Manager' | 'Sales Executive' | 'Tailor / Master' | 'Cashier' | 'Helper';
  phone: string;
  email: string;
  joiningDate: string;
  baseSalary: number; // Monthly
  status: 'Active' | 'On Leave' | 'Inactive';
  attendanceToday?: 'Present' | 'Absent' | 'Half-Day' | 'Late';
  salesCommissionRate?: number; // %
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'Present' | 'Absent' | 'Half-Day' | 'Leave';
  notes?: string;
}

export interface SalaryPayout {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string; // e.g. "October 2026"
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  paidDate: string;
  paymentMode: 'Bank Transfer' | 'Cash' | 'UPI';
  status: 'Paid' | 'Pending';
  payslipNo: string;
}
