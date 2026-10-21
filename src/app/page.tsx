'use client';

import React, { useState, useEffect } from 'react';
import { Product, Employee, Bill, SalaryPayout } from '@/types';
import {
  initialProducts,
  initialEmployees,
  initialBills,
  initialSalaries,
} from '@/lib/mockData';
import { BillingSection } from '@/components/BillingSection';
import { InventorySection } from '@/components/InventorySection';
import { StaffPayrollSection } from '@/components/StaffPayrollSection';
import { BillingHistory } from '@/components/BillingHistory';
import { DashboardAnalytics } from '@/components/DashboardAnalytics';
import { InvoiceModal } from '@/components/InvoiceModal';
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Users,
  ReceiptText,
  Sparkles,
  Store,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

export default function Home() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'billing' | 'inventory' | 'staff' | 'history'>('billing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // App Master States with LocalStorage fallback
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [salaries, setSalaries] = useState<SalaryPayout[]>([]);

  // Active Invoice Modal
  const [activeInvoice, setActiveInvoice] = useState<Bill | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');

  // Initial load
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    const savedProducts = localStorage.getItem('cloth_app_products');
    const savedEmployees = localStorage.getItem('cloth_app_employees');
    const savedBills = localStorage.getItem('cloth_app_bills');
    const savedSalaries = localStorage.getItem('cloth_app_salaries');

    setProducts(savedProducts ? JSON.parse(savedProducts) : initialProducts);
    setEmployees(savedEmployees ? JSON.parse(savedEmployees) : initialEmployees);
    setBills(savedBills ? JSON.parse(savedBills) : initialBills);
    setSalaries(savedSalaries ? JSON.parse(savedSalaries) : initialSalaries);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (products.length > 0) localStorage.setItem('cloth_app_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (employees.length > 0) localStorage.setItem('cloth_app_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    if (bills.length > 0) localStorage.setItem('cloth_app_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    if (salaries.length > 0) localStorage.setItem('cloth_app_salaries', JSON.stringify(salaries));
  }, [salaries]);

  // Inventory handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateProductStock = (productId: string, quantitySold: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantitySold) } : p
      )
    );
  };

  // Billing checkout handler
  const handleBillingComplete = (newBill: Bill) => {
    setBills((prev) => [newBill, ...prev]);
    setActiveInvoice(newBill);
  };

  // Staff handlers
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);
  };

  const handleUpdateEmployee = (updated: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddSalaryPayout = (payout: SalaryPayout) => {
    setSalaries((prev) => [payout, ...prev]);
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'billing', label: 'POS Billing', icon: ShoppingCart },
    { id: 'inventory', label: 'Clothes Stock', icon: Boxes },
    { id: 'staff', label: 'Staff & Salary', icon: Users },
    { id: 'history', label: 'Bills & Invoices', icon: ReceiptText },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0c1322',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          padding: '24px 16px',
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              color: '#fff'
            }}
          >
            <Store size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
              VogueCraft
            </h1>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#818cf8', fontWeight: 600 }}>
              Cloth Boutique ERP & POS
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} style={{ color: isActive ? '#818cf8' : '#64748b' }} />
                <span>{item.label}</span>
                {item.id === 'billing' && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: '0.68rem',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(99,102,241,0.3)',
                      color: '#a5b4fc'
                    }}
                  >
                    Counter 1
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Store Profile Info */}
        <div
          className="glass-panel"
          style={{
            padding: '14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)'
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>Vogue Boutique</div>
            <div style={{ fontSize: '0.72rem', color: '#10b981' }}>● System Online</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        style={{
          marginLeft: '260px',
          flex: 1,
          padding: '28px 36px',
          maxWidth: '1600px',
          width: 'calc(100% - 260px)'
        }}
      >
        {/* Top Header Bar */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '26px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              {activeTab === 'dashboard' && 'Store Management Dashboard'}
              {activeTab === 'billing' && 'POS Quick Billing Counter'}
              {activeTab === 'inventory' && 'Clothing Stock & Inventory Catalog'}
              {activeTab === 'staff' && 'Employee Staff, Attendance & Salary Payroll'}
              {activeTab === 'history' && 'Sales Billing Archive & Invoices'}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              All-in-one software for apparel boutiques, clothing shops & garment outlets.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              color: '#cbd5e1',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              📅 {currentDate || 'Today'}
            </div>
            <button
              onClick={() => setActiveTab('billing')}
              className="btn btn-primary btn-sm"
            >
              <ShoppingCart size={15} /> Open New Bill
            </button>
          </div>
        </header>

        {/* Tab View Switcher */}
        {activeTab === 'dashboard' && (
          <DashboardAnalytics
            products={products}
            bills={bills}
            employees={employees}
            salaries={salaries}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'billing' && (
          <BillingSection
            products={products}
            onBillingComplete={handleBillingComplete}
            onUpdateProductStock={handleUpdateProductStock}
          />
        )}

        {activeTab === 'inventory' && (
          <InventorySection
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'staff' && (
          <StaffPayrollSection
            employees={employees}
            salaries={salaries}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onAddSalaryPayout={handleAddSalaryPayout}
          />
        )}

        {activeTab === 'history' && (
          <BillingHistory
            bills={bills}
            onSelectBill={(b) => setActiveInvoice(b)}
          />
        )}
      </main>

      {/* Printable Receipt Modal */}
      {activeInvoice && (
        <InvoiceModal
          bill={activeInvoice}
          onClose={() => setActiveInvoice(null)}
        />
      )}
    </div>
  );
}
