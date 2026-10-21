import React from 'react';
import { Bill } from '@/types';
import { Receipt, Calendar, CreditCard, User, Eye, Download, Search } from 'lucide-react';

interface BillingHistoryProps {
  bills: Bill[];
  onSelectBill: (bill: Bill) => void;
}

export const BillingHistory: React.FC<BillingHistoryProps> = ({ bills, onSelectBill }) => {
  const [search, setSearch] = React.useState('');

  const filteredBills = bills.filter(
    (b) =>
      b.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search)
  );

  const totalRevenue = bills.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Sales Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span>Total Invoices Generated</span>
            <Receipt size={18} style={{ color: '#818cf8' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#f8fafc' }}>
            {bills.length} Bills
          </div>
          <span style={{ fontSize: '0.75rem', color: '#818cf8' }}>Lifetime billing transactions</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span>Total Sales Revenue</span>
            <CreditCard size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#10b981' }}>
            ₹{totalRevenue.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Received via UPI, Cash & Cards</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span>Average Order Value</span>
            <Receipt size={18} style={{ color: '#fbbf24' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#fbbf24' }}>
            ₹{bills.length > 0 ? Math.round(totalRevenue / bills.length).toLocaleString() : 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Per transaction average</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search invoice number, customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Bills Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '14px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)', color: '#94a3b8' }}>
              <th style={{ padding: '14px 18px' }}>Invoice No & Date</th>
              <th style={{ padding: '14px 18px' }}>Customer</th>
              <th style={{ padding: '14px 18px' }}>Items Count</th>
              <th style={{ padding: '14px 18px' }}>Payment Mode</th>
              <th style={{ padding: '14px 18px' }}>Discount</th>
              <th style={{ padding: '14px 18px' }}>Total Amount</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((b) => (
              <tr
                key={b.id}
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
              >
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontWeight: 600, color: '#f8fafc' }}>{b.invoiceNo}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{b.createdAt}</div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ color: '#f8fafc', fontWeight: 500 }}>{b.customerName}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{b.customerPhone}</div>
                </td>
                <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>
                  {b.items.reduce((s, it) => s + it.quantity, 0)} pcs ({b.items.length} styles)
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span className="badge badge-info">{b.paymentMethod}</span>
                </td>
                <td style={{ padding: '14px 18px', color: b.discountAmount > 0 ? '#10b981' : '#64748b' }}>
                  {b.discountAmount > 0 ? `₹${b.discountAmount}` : 'None'}
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 800, color: '#38bdf8' }}>
                  ₹{b.totalAmount.toLocaleString()}
                </td>
                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  <button
                    onClick={() => onSelectBill(b)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Eye size={14} /> View / Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
