import React, { useState } from 'react';
import { Product, CartItem, Bill } from '@/types';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Receipt,
  User,
  Phone,
  CreditCard,
  Banknote,
  QrCode,
  Tag,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BillingSectionProps {
  products: Product[];
  onBillingComplete: (bill: Bill) => void;
  onUpdateProductStock: (productId: string, quantitySold: number) => void;
}

export const BillingSection: React.FC<BillingSectionProps> = ({
  products,
  onBillingComplete,
  onUpdateProductStock
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(5); // 5% GST on apparel
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card'>('UPI');
  const [quickAmountPaid, setQuickAmountPaid] = useState<string>('');

  const categories = ['All', 'Men', 'Women', 'Kids', 'Ethnic', 'Accessories'];

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.color.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Only ${product.stock} units available in inventory!`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, discountPercent: 0 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.stock) {
              alert(`Maximum available stock reached (${item.product.stock})`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity,
    0
  );
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const taxAmount = Math.round((discountedSubtotal * taxPercent) / 100);
  const grandTotal = discountedSubtotal + taxAmount;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty. Please add items to checkout.');
      return;
    }
    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }

    // Deduct stock for all items
    cart.forEach((item) => {
      onUpdateProductStock(item.product.id, item.quantity);
    });

    const newBill: Bill = {
      id: `bill-${Date.now()}`,
      invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || 'N/A',
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        size: item.product.size,
        quantity: item.quantity,
        price: item.product.sellingPrice,
        subtotal: item.product.sellingPrice * item.quantity,
      })),
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount: grandTotal,
      paymentMethod,
      createdAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      cashierName: 'Anita Roy (Cashier Counter 1)',
    };

    // Confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // ignore
    }

    onBillingComplete(newBill);
    // Reset state
    clearCart();
    setCustomerName('');
    setCustomerPhone('');
    setDiscountPercent(0);
    setQuickAmountPaid('');
  };

  return (
    <div className="pos-layout-grid">
      {/* LEFT COLUMN: Product Catalog & Fast Lookup */}
      <div className="pos-product-catalog">
        {/* Search & Filter Header */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search
                size={18}
                style={{ position: 'absolute', left: '14px', color: '#64748b' }}
              />
              <input
                type="text"
                placeholder="Scan Barcode (e.g. CLOTH-8901) or search by dress, color, fabric..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 42px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  backgroundColor:
                    selectedCategory === cat ? 'var(--primary)' : 'rgba(255, 255, 255, 0.06)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="pos-product-cards-grid">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.stock <= 0;
            const isLowStock = p.stock <= p.minStockAlert && p.stock > 0;

            return (
              <div
                key={p.id}
                onClick={() => !isOutOfStock && addToCart(p)}
                className="glass-panel"
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  opacity: isOutOfStock ? 0.45 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(255,255,255,0.07)',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase' }}>
                      {p.category}
                    </span>
                    <span className={`badge ${isOutOfStock ? 'badge-danger' : isLowStock ? 'badge-warning' : 'badge-success'}`}>
                      {isOutOfStock ? 'Sold Out' : `${p.stock} in stock`}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '6px', color: '#f8fafc', lineHeight: 1.3 }}>
                    {p.name}
                  </h4>

                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '10px' }}>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                      Size: <strong>{p.size}</strong>
                    </span>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                      {p.color}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                      ₹{p.sellingPrice}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {p.barcode}
                    </div>
                  </div>
                  <button
                    disabled={isOutOfStock}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'rgba(99, 102, 241, 0.2)',
                      color: '#818cf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: POS Billing Terminal */}
      <div className="glass-panel-elevated pos-terminal-cart" style={{ padding: '22px', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart size={20} style={{ color: '#818cf8' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Active Billing Cart</h3>
          </div>
          <span className="badge badge-info">{cart.length} items</span>
        </div>

        {/* Customer Information Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
              Customer Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Walk-in Client"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 30px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="9876543210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 30px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{
          maxHeight: '260px',
          overflowY: 'auto',
          marginBottom: '16px',
          paddingRight: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 10px', color: '#64748b' }}>
              <ShoppingCart size={36} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
              <p style={{ fontSize: '0.88rem' }}>Cart is empty. Select clothes on the left to begin billing.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.product.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Size: {item.product.size} | ₹{item.product.sellingPrice} each
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0b0f19', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      style={{ padding: '4px 6px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0 6px' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      style={{ padding: '4px 6px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', width: '64px', textAlign: 'right' }}>
                    ₹{item.product.sellingPrice * item.quantity}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pricing Discounts & Tax Toggles */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '16px',
          fontSize: '0.83rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span>Subtotal:</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Discount Offer (%):</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[0, 5, 10, 15].map((d) => (
                <button
                  key={d}
                  onClick={() => setDiscountPercent(d)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: discountPercent === d ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                    color: '#fff'
                  }}
                >
                  {d}%
                </button>
              ))}
            </div>
          </div>

          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
              <span>Savings / Discount:</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
            <span>GST ({taxPercent}%):</span>
            <span>+₹{taxAmount.toFixed(2)}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '8px',
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#38bdf8'
          }}>
            <span>Total Payable:</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
            Payment Mode:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[
              { id: 'UPI', icon: QrCode, label: 'UPI / QR' },
              { id: 'Cash', icon: Banknote, label: 'Cash' },
              { id: 'Card', icon: CreditCard, label: 'Card / POS' },
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: isSelected ? '#a5b4fc' : '#cbd5e1',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={14} />
                  {method.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={clearCart}
            disabled={cart.length === 0}
            className="btn btn-secondary"
            style={{ flex: '0.4' }}
          >
            Clear
          </button>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            <Receipt size={16} /> Complete & Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};
