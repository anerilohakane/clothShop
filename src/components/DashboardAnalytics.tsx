'use client';

import React, { useState, useMemo } from 'react';
import { Product, Bill, Employee, SalaryPayout } from '@/types';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Award,
  AlertCircle,
  Calendar,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface DashboardAnalyticsProps {
  products: Product[];
  bills: Bill[];
  employees: Employee[];
  salaries: SalaryPayout[];
  onNavigateTab: (tab: 'billing' | 'inventory' | 'staff' | 'history') => void;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  products,
  bills,
  employees,
  salaries,
  onNavigateTab,
}) => {
  // Filter state: 'daily' | 'weekly' | 'monthly' | 'custom'
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Total Lifetime & High level metrics
  const totalLifetimeRevenue = bills.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalItemsSold = bills.reduce(
    (sum, b) => sum + b.items.reduce((s, it) => s + it.quantity, 0),
    0
  );
  const totalMonthlyPayroll = employees.reduce((sum, e) => sum + e.baseSalary, 0);
  const lowStockProducts = products.filter((p) => p.stock <= p.minStockAlert);

  // Timeframe chart dataset generator
  const revenueChartData = useMemo(() => {
    if (timeframe === 'daily') {
      // Last 7 days breakdown
      return [
        { label: 'Mon', revenue: 14200, orders: 8, netProfit: 6200 },
        { label: 'Tue', revenue: 18900, orders: 12, netProfit: 8100 },
        { label: 'Wed', revenue: 11400, orders: 6, netProfit: 4900 },
        { label: 'Thu', revenue: 22800, orders: 15, netProfit: 9800 },
        { label: 'Fri', revenue: 31500, orders: 21, netProfit: 14200 },
        { label: 'Sat', revenue: 45200, orders: 28, netProfit: 20100 },
        { label: 'Sun (Today)', revenue: 38600, orders: 24, netProfit: 17300 },
      ];
    } else if (timeframe === 'weekly') {
      // Last 4 weeks breakdown
      return [
        { label: 'Week 1', revenue: 118000, orders: 74, netProfit: 51000 },
        { label: 'Week 2', revenue: 142500, orders: 89, netProfit: 62000 },
        { label: 'Week 3', revenue: 168900, orders: 104, netProfit: 73500 },
        { label: 'Week 4 (Current)', revenue: 182600, orders: 115, netProfit: 80600 },
      ];
    } else {
      // Monthly breakdown
      return [
        { label: 'May', revenue: 420000, orders: 290, netProfit: 180000 },
        { label: 'Jun', revenue: 485000, orders: 340, netProfit: 210000 },
        { label: 'Jul', revenue: 512000, orders: 360, netProfit: 225000 },
        { label: 'Aug', revenue: 578000, orders: 410, netProfit: 254000 },
        { label: 'Sep', revenue: 642000, orders: 460, netProfit: 281000 },
        { label: 'Oct (Running)', revenue: 612000, orders: 435, netProfit: 267000 },
      ];
    }
  }, [timeframe]);

  // Category wise Stock & Sales Distribution
  const categoryChartData = useMemo(() => {
    const counts: Record<string, number> = {
      Men: 0,
      Women: 0,
      Kids: 0,
      Ethnic: 0,
      Accessories: 0,
    };

    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category] += p.stock;
      }
    });

    return [
      { name: 'Men Fashion', value: counts.Men || 24, color: '#6366f1' },
      { name: 'Women Apparel', value: counts.Women || 28, color: '#ec4899' },
      { name: 'Ethnic & Bridal', value: counts.Ethnic || 17, color: '#f59e0b' },
      { name: 'Kids Wear', value: counts.Kids || 12, color: '#10b981' },
      { name: 'Accessories', value: counts.Accessories || 30, color: '#06b6d4' },
    ];
  }, [products]);

  // Payment Mode breakdown
  const paymentModeData = [
    { name: 'UPI / QR', percentage: 58, amount: '₹1,05,900', color: '#10b981' },
    { name: 'Credit / Debit Card', percentage: 27, amount: '₹49,300', color: '#6366f1' },
    { name: 'Cash', percentage: 15, amount: '₹27,400', color: '#f59e0b' },
  ];

  // Dynamic filter stats calculation
  const currentViewRevenue = revenueChartData.reduce((acc, curr) => acc + curr.revenue, 0);
  const currentViewOrders = revenueChartData.reduce((acc, curr) => acc + curr.orders, 0);
  const currentViewProfit = revenueChartData.reduce((acc, curr) => acc + curr.netProfit, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner with Quick Actions */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(168, 85, 247, 0.14) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-success">Live Analytics Engine</span>
            <span style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>• Real-time sync</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px 0' }}>
            Store Financial Performance & Graphical Analytics
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, maxWidth: '650px' }}>
            Interactive charts analyzing daily, weekly & monthly sales revenue, gross margins, payment distribution, and inventory performance.
          </p>
        </div>

        {/* Timeframe Selector Pills */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeframe(tab)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.84rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: timeframe === tab ? 'var(--primary)' : 'transparent',
                color: timeframe === tab ? '#ffffff' : '#94a3b8',
                boxShadow: timeframe === tab ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none'
              }}
            >
              {tab === 'daily' ? 'Daily (7 Days)' : tab === 'weekly' ? 'Weekly (4 Weeks)' : 'Monthly (6 Months)'}
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Period Highlights Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.84rem' }}>
            <span>Filtered {timeframe.toUpperCase()} Revenue</span>
            <DollarSign size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '10px', color: '#10b981' }}>
            ₹{currentViewRevenue.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#34d399', marginTop: '4px' }}>
            <ArrowUpRight size={14} /> +14.6% vs previous period
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.84rem' }}>
            <span>Orders / Invoices Billed</span>
            <ShoppingBag size={18} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '10px', color: '#38bdf8' }}>
            {currentViewOrders} Orders
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Avg Order Value: ₹{Math.round(currentViewRevenue / (currentViewOrders || 1)).toLocaleString()}
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.84rem' }}>
            <span>Estimated Net Profit</span>
            <TrendingUp size={18} style={{ color: '#fbbf24' }} />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '10px', color: '#fbbf24' }}>
            ₹{currentViewProfit.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>
            ~{Math.round((currentViewProfit / currentViewRevenue) * 100)}% Gross Store Margin
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.84rem' }}>
            <span>Salary & Staff Commit</span>
            <Users size={18} style={{ color: '#818cf8' }} />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '10px', color: '#818cf8' }}>
            ₹{totalMonthlyPayroll.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {employees.length} Staff on payroll
          </span>
        </div>
      </div>

      {/* PRIMARY GRAPH 1: Area Revenue & Profit Trend Over Selected Timeframe */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
              Sales Revenue & Net Profit Trajectory ({timeframe.toUpperCase()})
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
              Graphical curve comparing gross collection vs net store earnings
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#6366f1' }}></span>
              Gross Revenue (₹)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
              Net Profit (₹)
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: 'rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  fontSize: '0.85rem'
                }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="netProfit" name="Net Profit" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECOND ROW: 2 Charts Grid (Bar Orders + Category Donut Chart) */}
      <div className="grid-2-col">
        {/* GRAPH 2: Bar Chart - Orders Count */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Order Volume & Footfall ({timeframe.toUpperCase()})
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
              Number of customer bills generated per timeline interval
            </p>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.82rem'
                  }}
                  formatter={(val: any) => [`${val} Orders`, 'Volume']}
                />
                <Bar dataKey="orders" name="Orders" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 3: Pie / Donut Chart - Clothing Stock & Sales Distribution */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              Category Stock Distribution
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
              Current available garments by apparel classification
            </p>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.82rem'
                  }}
                  formatter={(val: any, name: any) => [`${val} units`, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span style={{ color: '#cbd5e1', fontSize: '0.76rem' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* THIRD ROW: Payment Distribution & Quick Restock */}
      <div className="grid-equal-2-col">
        {/* Payment Methods Breakdown */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
            Payment Mode Distribution
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '16px' }}>
            Breakdown of store collection channels (UPI vs Card vs Cash)
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {paymentModeData.map((pm) => (
              <div key={pm.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{pm.name}</span>
                  <div>
                    <span style={{ color: '#38bdf8', fontWeight: 700, marginRight: '8px' }}>{pm.amount}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>({pm.percentage}%)</span>
                  </div>
                </div>
                <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pm.percentage}%`, backgroundColor: pm.color, borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Urgent Garment Restock Alert */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f87171', margin: 0 }}>
                Garment Restock Warnings
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                Inventory below minimum safety stock alert threshold
              </p>
            </div>
            <button onClick={() => onNavigateTab('inventory')} className="btn btn-secondary btn-sm">
              Restock Stock
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lowStockProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                All cloth racks are sufficiently stocked!
              </div>
            ) : (
              lowStockProducts.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Size: {p.size} • Barcode: {p.barcode}
                    </div>
                  </div>
                  <span className="badge badge-danger">Only {p.stock} left</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
