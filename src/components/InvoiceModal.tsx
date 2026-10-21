import React, { useState } from 'react';
import { Bill } from '@/types';
import { Printer, X, CheckCircle, Share2, MessageCircle, Send, Check } from 'lucide-react';

interface InvoiceModalProps {
  bill: Bill;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ bill, onClose }) => {
  const [whatsappPhone, setWhatsappPhone] = useState(bill.customerPhone !== 'N/A' ? bill.customerPhone : '');
  const [isCopied, setIsCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  // Generate WhatsApp formatted text message
  const generateWhatsAppMessage = () => {
    let msg = `*VOGUE CRAFT BOUTIQUE - INVOICE*\n`;
    msg += `------------------------------------\n`;
    msg += `📄 *Invoice No:* ${bill.invoiceNo}\n`;
    msg += `👤 *Customer:* ${bill.customerName}\n`;
    msg += `📅 *Date:* ${bill.createdAt}\n`;
    msg += `💳 *Payment Mode:* ${bill.paymentMethod}\n`;
    msg += `------------------------------------\n`;
    msg += `*ITEMS PURCHASED:*\n`;

    bill.items.forEach((item, index) => {
      msg += `${index + 1}. ${item.productName} (Size: ${item.size})\n`;
      msg += `   ${item.quantity} x ₹${item.price} = ₹${item.subtotal.toFixed(2)}\n`;
    });

    msg += `------------------------------------\n`;
    msg += `*Subtotal:* ₹${bill.subtotal.toFixed(2)}\n`;
    if (bill.discountAmount > 0) {
      msg += `*Discount:* -₹${bill.discountAmount.toFixed(2)}\n`;
    }
    msg += `*Taxes / GST:* +₹${bill.taxAmount.toFixed(2)}\n`;
    msg += `*GRAND TOTAL: ₹${bill.totalAmount.toFixed(2)}*\n`;
    msg += `------------------------------------\n`;
    msg += `✨ Thank you for shopping with Vogue Craft!\n`;
    msg += `Exchange valid within 7 days with original tags.\n`;

    return msg;
  };

  // Trigger WhatsApp Web or App
  const handleSendWhatsApp = () => {
    const cleanPhone = whatsappPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number for WhatsApp.');
      return;
    }

    // Default to +91 country code if 10 digits provided without country prefix
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const encodedText = encodeURIComponent(generateWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '540px',
        width: '100%',
        maxHeight: '94vh',
        overflowY: 'auto',
        backgroundColor: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        borderRadius: '16px',
        padding: '22px',
        position: 'relative'
      }}>
        {/* Action Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Bill Generated</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{bill.invoiceNo}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">
              <Printer size={15} /> Print
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '6px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Instant WhatsApp Quick Send Bar */}
        <div style={{
          backgroundColor: 'rgba(37, 211, 102, 0.1)',
          border: '1px solid rgba(37, 211, 102, 0.25)',
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#25d366', fontSize: '0.86rem', fontWeight: 700 }}>
            <MessageCircle size={17} />
            <span>Send Bill Receipt via WhatsApp</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Enter 10-digit phone number"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#0b1120',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
            <button
              onClick={handleSendWhatsApp}
              style={{
                backgroundColor: '#25d366',
                color: '#0f172a',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.84rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
            >
              <Send size={14} /> Send WhatsApp
            </button>
            <button
              onClick={handleCopyMessage}
              className="btn btn-secondary btn-sm"
              title="Copy receipt text to clipboard"
            >
              {isCopied ? <Check size={14} style={{ color: '#10b981' }} /> : <Share2 size={14} />}
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper View */}
        <div id="printable-receipt" style={{
          backgroundColor: '#ffffff',
          color: '#1e293b',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          fontFamily: "'Courier New', Courier, monospace"
        }}>
          {/* Shop Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '16px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '1px', color: '#0f172a' }}>VOGUE CRAFT BOUTIQUE</h2>
            <p style={{ fontSize: '0.78rem', margin: '2px 0', color: '#64748b' }}>Premium Men, Women & Ethnic Wear</p>
            <p style={{ fontSize: '0.75rem', margin: '2px 0', color: '#64748b' }}>MG Road, Fashion Boulevard • GSTIN: 27AABCV1234F1Z0</p>
            <p style={{ fontSize: '0.75rem', margin: '2px 0', color: '#64748b' }}>Contact: +91 98765 00000</p>
          </div>

          {/* Customer & Bill Meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '14px', color: '#334155' }}>
            <div>
              <div><strong>Invoice:</strong> {bill.invoiceNo}</div>
              <div><strong>Date:</strong> {bill.createdAt}</div>
              <div><strong>Cashier:</strong> {bill.cashierName}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div><strong>Customer:</strong> {bill.customerName}</div>
              <div><strong>Phone:</strong> {bill.customerPhone}</div>
              <div><strong>Payment:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{bill.paymentMethod}</span></div>
            </div>
          </div>

          {/* Itemized Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '16px' }}>
            <thead>
              <tr style={{ borderTop: '1px solid #94a3b8', borderBottom: '1px solid #94a3b8' }}>
                <th style={{ textAlign: 'left', padding: '6px 0' }}>Item (Size)</th>
                <th style={{ textAlign: 'center', padding: '6px 0' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '6px 0' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '6px 0' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px dotted #e2e8f0' }}>
                  <td style={{ padding: '7px 0' }}>
                    <div style={{ fontWeight: 600 }}>{item.productName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Size: {item.size}</div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '7px 0' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right', padding: '7px 0' }}>₹{item.price.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', padding: '7px 0', fontWeight: 600 }}>₹{item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculation Breakdown */}
          <div style={{ borderTop: '1px solid #94a3b8', paddingTop: '10px', fontSize: '0.82rem', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Items Subtotal:</span>
              <span>₹{bill.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>GST / Taxes:</span>
              <span>+₹{bill.taxAmount.toFixed(2)}</span>
            </div>
            {bill.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                <span>Discount Applied:</span>
                <span>-₹{bill.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.05rem',
              fontWeight: 800,
              marginTop: '8px',
              borderTop: '2px dashed #94a3b8',
              paddingTop: '8px',
              color: '#0f172a'
            }}>
              <span>GRAND TOTAL:</span>
              <span>₹{bill.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer note & Barcode simulation */}
          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '14px', borderTop: '1px dotted #cbd5e1', fontSize: '0.72rem', color: '#64748b' }}>
            <p style={{ margin: '2px 0', fontWeight: 600 }}>Exchange within 7 days with original bill & tags.</p>
            <p style={{ margin: '2px 0' }}>Thank You for Shopping with Vogue Craft!</p>
            <div style={{
              letterSpacing: '5px',
              fontFamily: "'Libre Barcode 39', monospace",
              fontSize: '1.1rem',
              marginTop: '8px',
              fontWeight: 'bold',
              color: '#334155'
            }}>
              * {bill.invoiceNo} *
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleSendWhatsApp}
            style={{
              backgroundColor: 'rgba(37, 211, 102, 0.15)',
              border: '1px solid #25d366',
              color: '#25d366',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <MessageCircle size={16} /> Send to WhatsApp
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onClose} className="btn btn-secondary">Close</button>
            <button onClick={handlePrint} className="btn btn-primary">
              <Printer size={16} /> Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
