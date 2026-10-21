import React, { useState } from 'react';
import { Employee, SalaryPayout } from '@/types';
import {
  Users,
  UserPlus,
  DollarSign,
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  CreditCard,
  Building,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StaffPayrollSectionProps {
  employees: Employee[];
  salaries: SalaryPayout[];
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onAddSalaryPayout: (payout: SalaryPayout) => void;
}

export const StaffPayrollSection: React.FC<StaffPayrollSectionProps> = ({
  employees,
  salaries,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onAddSalaryPayout,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'employees' | 'payroll' | 'attendance'>('employees');

  // Employee modal state
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState<Employee['role']>('Sales Executive');
  const [empPhone, setEmpPhone] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empSalary, setEmpSalary] = useState<number>(20000);
  const [empCommission, setEmpCommission] = useState<number>(2);

  // Salary Payout modal state
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [selectedEmpForPay, setSelectedEmpForPay] = useState<Employee | null>(null);
  const [payMonth, setPayMonth] = useState('October 2026');
  const [payBonus, setPayBonus] = useState<number>(1500);
  const [payDeductions, setPayDeductions] = useState<number>(0);
  const [payMode, setPayMode] = useState<'Bank Transfer' | 'Cash' | 'UPI'>('Bank Transfer');

  // Selected Payslip for viewing
  const [selectedPayslip, setSelectedPayslip] = useState<SalaryPayout | null>(null);
  const [todayFormatted, setTodayFormatted] = useState<string>('');

  React.useEffect(() => {
    setTodayFormatted(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empPhone.trim()) {
      alert('Please fill in employee name and contact phone.');
      return;
    }

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: empName.trim(),
      role: empRole,
      phone: empPhone.trim(),
      email: empEmail.trim() || `${empName.toLowerCase().replace(/\s+/g, '.')}@clothstore.com`,
      joiningDate: new Date().toISOString().split('T')[0],
      baseSalary: Number(empSalary),
      status: 'Active',
      attendanceToday: 'Present',
      salesCommissionRate: Number(empCommission),
    };

    onAddEmployee(newEmp);
    setIsEmpModalOpen(false);
    setEmpName('');
    setEmpPhone('');
    setEmpEmail('');
  };

  const handleUpdateAttendance = (empId: string, status: Employee['attendanceToday']) => {
    const target = employees.find((e) => e.id === empId);
    if (target) {
      onUpdateEmployee({ ...target, attendanceToday: status });
    }
  };

  const openProcessSalaryModal = (emp: Employee) => {
    setSelectedEmpForPay(emp);
    setPayBonus(1000);
    setPayDeductions(0);
    setIsSalaryModalOpen(true);
  };

  const handleDisburseSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpForPay) return;

    const netSalary = selectedEmpForPay.baseSalary + Number(payBonus) - Number(payDeductions);

    const payout: SalaryPayout = {
      id: `sal-${Date.now()}`,
      employeeId: selectedEmpForPay.id,
      employeeName: selectedEmpForPay.name,
      month: payMonth,
      baseSalary: selectedEmpForPay.baseSalary,
      bonus: Number(payBonus),
      deductions: Number(payDeductions),
      netSalary,
      paidDate: new Date().toISOString().split('T')[0],
      paymentMode: payMode,
      status: 'Paid',
      payslipNo: `PAY-${payMonth.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    };

    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    } catch (e) {
      // ignore
    }

    onAddSalaryPayout(payout);
    setIsSalaryModalOpen(false);
  };

  const totalMonthlyPayroll = employees.reduce((sum, e) => sum + e.baseSalary, 0);
  const presentCount = employees.filter((e) => e.attendanceToday === 'Present').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top HR & Salary Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span>Total Staff Headcount</span>
            <Users size={18} style={{ color: '#818cf8' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#f8fafc' }}>
            {employees.length} Staff Members
          </div>
          <span style={{ fontSize: '0.75rem', color: '#818cf8' }}>Managers, Sales, Tailors & Cashiers</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span>Today's Attendance</span>
            <CalendarCheck size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#10b981' }}>
            {presentCount} / {employees.length} Present
          </div>
          <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Live daily shift status</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span>Monthly Salary Expense</span>
            <DollarSign size={18} style={{ color: '#fbbf24' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#fbbf24' }}>
            ₹{totalMonthlyPayroll.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total base monthly payroll</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span>Payslips Disbursed</span>
            <FileText size={18} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#38bdf8' }}>
            {salaries.length} Slips
          </div>
          <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Historical paid records</span>
        </div>
      </div>

      {/* Sub-Tab Navigation & Add Staff Action */}
      <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveSubTab('employees')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeSubTab === 'employees' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: '#fff'
            }}
          >
            Staff Directory
          </button>
          <button
            onClick={() => setActiveSubTab('attendance')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeSubTab === 'attendance' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: '#fff'
            }}
          >
            Daily Attendance
          </button>
          <button
            onClick={() => setActiveSubTab('payroll')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeSubTab === 'payroll' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: '#fff'
            }}
          >
            Salary Payroll & Payslips
          </button>
        </div>

        <button onClick={() => setIsEmpModalOpen(true)} className="btn btn-primary">
          <UserPlus size={16} /> Add New Employee
        </button>
      </div>

      {/* SUB-VIEW 1: Staff Directory */}
      {activeSubTab === 'employees' && (
        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '14px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)', color: '#94a3b8' }}>
                <th style={{ padding: '14px 18px' }}>Staff Name & Code</th>
                <th style={{ padding: '14px 18px' }}>Role / Designation</th>
                <th style={{ padding: '14px 18px' }}>Contact Phone & Email</th>
                <th style={{ padding: '14px 18px' }}>Base Monthly Salary</th>
                <th style={{ padding: '14px 18px' }}>Sales Commission</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Joined: {emp.joiningDate}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      color: '#818cf8'
                    }}>
                      {emp.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ color: '#f1f5f9' }}>{emp.phone}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.email}</div>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#38bdf8' }}>
                    ₹{emp.baseSalary.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 18px', color: '#10b981', fontWeight: 600 }}>
                    {emp.salesCommissionRate ? `${emp.salesCommissionRate}% on sales` : 'N/A'}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="badge badge-success">{emp.status}</span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => openProcessSalaryModal(emp)}
                        className="btn btn-sm btn-success"
                        title="Process Monthly Salary"
                      >
                        <DollarSign size={14} /> Pay Salary
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove employee ${emp.name}?`)) {
                            onDeleteEmployee(emp.id);
                          }
                        }}
                        className="btn btn-sm"
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'none' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUB-VIEW 2: Daily Attendance Management */}
      {activeSubTab === 'attendance' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Today's Shift Attendance Roster</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Date: {todayFormatted || 'Today'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span>🟢 Present: {employees.filter((e) => e.attendanceToday === 'Present').length}</span>
              <span>🟡 Late: {employees.filter((e) => e.attendanceToday === 'Late').length}</span>
              <span>🔴 Absent: {employees.filter((e) => e.attendanceToday === 'Absent').length}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '14px' }}>
            {employees.map((emp) => {
              const currentStatus = emp.attendanceToday || 'Present';
              return (
                <div
                  key={emp.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{emp.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#818cf8' }}>{emp.role}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{emp.phone}</div>
                    </div>
                    <span className={`badge ${
                      currentStatus === 'Present' ? 'badge-success' : currentStatus === 'Late' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {currentStatus}
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '6px' }}>
                      Mark Status:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                      {(['Present', 'Late', 'Absent'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateAttendance(emp.id, st)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: currentStatus === st ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                            backgroundColor: currentStatus === st ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)',
                            color: currentStatus === st ? '#a5b4fc' : '#94a3b8',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Salary Payroll & Payslips History */}
      {activeSubTab === 'payroll' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '14px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)', color: '#94a3b8' }}>
                  <th style={{ padding: '14px 18px' }}>Payslip #</th>
                  <th style={{ padding: '14px 18px' }}>Employee</th>
                  <th style={{ padding: '14px 18px' }}>Salary Month</th>
                  <th style={{ padding: '14px 18px' }}>Base Salary</th>
                  <th style={{ padding: '14px 18px' }}>Bonus & Incentives</th>
                  <th style={{ padding: '14px 18px' }}>Deductions</th>
                  <th style={{ padding: '14px 18px' }}>Net Paid</th>
                  <th style={{ padding: '14px 18px' }}>Payment Mode</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Slip</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((s) => (
                  <tr
                    key={s.id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                  >
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#f8fafc' }}>{s.payslipNo}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 600 }}>{s.employeeName}</td>
                    <td style={{ padding: '14px 18px', color: '#94a3b8' }}>{s.month}</td>
                    <td style={{ padding: '14px 18px', color: '#94a3b8' }}>₹{s.baseSalary.toLocaleString()}</td>
                    <td style={{ padding: '14px 18px', color: '#10b981' }}>+₹{s.bonus.toLocaleString()}</td>
                    <td style={{ padding: '14px 18px', color: '#ef4444' }}>-₹{s.deductions.toLocaleString()}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: '#38bdf8' }}>₹{s.netSalary.toLocaleString()}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="badge badge-info">{s.paymentMode}</span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedPayslip(s)}
                        className="btn btn-secondary btn-sm"
                      >
                        <FileText size={14} /> View Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Add New Employee */}
      {isEmpModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel-elevated animate-fade-in" style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add Store Employee</h3>
              <button onClick={() => setIsEmpModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Role / Position
                  </label>
                  <select
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                  >
                    <option value="Store Manager">Store Manager</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Tailor / Master">Tailor / Master</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Helper">Helper</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 00000"
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="ramesh@clothstore.com"
                  value={empEmail}
                  onChange={(e) => setEmpEmail(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Monthly Base Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={empSalary}
                    onChange={(e) => setEmpSalary(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Sales Incentive (%)
                  </label>
                  <input
                    type="number"
                    value={empCommission}
                    onChange={(e) => setEmpCommission(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsEmpModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Process & Pay Salary */}
      {isSalaryModalOpen && selectedEmpForPay && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel-elevated animate-fade-in" style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Disburse Monthly Salary</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#818cf8' }}>
                  {selectedEmpForPay.name} • {selectedEmpForPay.role}
                </p>
              </div>
              <button onClick={() => setIsSalaryModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDisburseSalary} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Salary Month
                </label>
                <input
                  type="text"
                  value={payMonth}
                  onChange={(e) => setPayMonth(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Base Salary:</span>
                <span style={{ fontWeight: 700, color: '#f8fafc' }}>₹{selectedEmpForPay.baseSalary.toLocaleString()}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#10b981', marginBottom: '4px' }}>
                    + Bonus / Commission (₹)
                  </label>
                  <input
                    type="number"
                    value={payBonus}
                    onChange={(e) => setPayBonus(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#f87171', marginBottom: '4px' }}>
                    - Deductions / Advance (₹)
                  </label>
                  <input
                    type="number"
                    value={payDeductions}
                    onChange={(e) => setPayDeductions(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Payment Mode
                </label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value as any)}
                  style={{ width: '100%', padding: '9px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="UPI">UPI Direct</option>
                  <option value="Cash">Cash Handover</option>
                </select>
              </div>

              {/* Net Payout Summary */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '8px',
                marginTop: '6px'
              }}>
                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>Total Net Payable:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                  ₹{(selectedEmpForPay.baseSalary + Number(payBonus) - Number(payDeductions)).toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsSalaryModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  <CheckCircle2 size={16} /> Confirm & Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: View Full Payslip */}
      {selectedPayslip && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel-elevated animate-fade-in" style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            borderRadius: '14px',
            padding: '24px',
            fontFamily: 'sans-serif'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>VogueCraft Boutique</h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Staff Salary Payslip</p>
              </div>
              <button onClick={() => setSelectedPayslip(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '0.85rem', lineHeight: '1.7', marginBottom: '16px' }}>
              <div><strong>Slip No:</strong> {selectedPayslip.payslipNo}</div>
              <div><strong>Staff Name:</strong> {selectedPayslip.employeeName}</div>
              <div><strong>Month of Salary:</strong> {selectedPayslip.month}</div>
              <div><strong>Disbursement Date:</strong> {selectedPayslip.paidDate}</div>
              <div><strong>Payment Mode:</strong> {selectedPayslip.paymentMode}</div>
            </div>

            <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '10px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Basic Pay:</span>
                <span>₹{selectedPayslip.baseSalary.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#059669' }}>
                <span>Incentives & Bonus:</span>
                <span>+₹{selectedPayslip.bonus.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#dc2626' }}>
                <span>Deductions / Advances:</span>
                <span>-₹{selectedPayslip.deductions.toLocaleString()}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '2px dashed #0f172a',
                paddingTop: '8px',
                marginTop: '8px',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                <span>Net Salary Paid:</span>
                <span>₹{selectedPayslip.netSalary.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                Print Payslip
              </button>
              <button onClick={() => setSelectedPayslip(null)} className="btn btn-secondary btn-sm" style={{ color: '#0f172a' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
