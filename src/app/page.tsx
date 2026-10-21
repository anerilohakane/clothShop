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
  Store,
  Menu,
  X,
  ShieldCheck,
  Plus
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
    <div className="app-container">
      {/* Mobile Top Header */}
      <header className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            <Store size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>VogueCraft</div>
            <div style={{ fontSize: '0.68rem', color: '#818cf8' }}>Cloth POS & ERP</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setActiveTab('billing')}
            className="btn btn-primary btn-sm"
            style={{ padding: '5px 10px', fontSize: '0.75rem' }}
          >
            <Plus size={14} /> Bill
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px' }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Backdrop for Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            zIndex: 45,
            backdropFilter: 'blur(3px)'
          }}
        />
      )}

      {/* Row containing Sidebar & Main Content */}
      <div className="content-row">
        {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
        <aside className={`sidebar-desktop ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
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
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
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
            padding: '12px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShieldCheck size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>Vogue Boutique</div>
            <div style={{ fontSize: '0.7rem', color: '#10b981' }}>● System Active</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header Bar */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '22px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              {activeTab === 'dashboard' && 'Store Management Dashboard'}
              {activeTab === 'billing' && 'POS Quick Billing Counter'}
              {activeTab === 'inventory' && 'Clothing Stock & Inventory Catalog'}
              {activeTab === 'staff' && 'Employee Staff, Attendance & Salary Payroll'}
              {activeTab === 'history' && 'Sales Billing Archive & Invoices'}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
              All-in-one software for apparel boutiques, clothing shops & garment outlets.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#cbd5e1',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              📅 {currentDate || 'Today'}
            </div>
            <button
              onClick={() => setActiveTab('billing')}
              className="btn btn-primary btn-sm"
            >
              <ShoppingCart size={15} /> Quick Bill
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
      </div>

      {/* Bottom Mobile Tab Bar (For phone screens) */}
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                background: 'none',
                border: 'none',
                color: isActive ? '#818cf8' : '#64748b',
                padding: '4px',
                fontSize: '0.68rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              <Icon size={18} />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* Printable Receipt & WhatsApp Modal */}
      {activeInvoice && (
        <InvoiceModal
          bill={activeInvoice}
          onClose={() => setActiveInvoice(null)}
        />
      )}
    </div>
  );
}
