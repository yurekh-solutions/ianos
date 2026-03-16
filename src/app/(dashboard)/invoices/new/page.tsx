'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Save, FileText, Percent } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface InvoiceItem {
  id: string;
  productName: string;
  description: string;
  quantity: string;
  price: string;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', productName: '', description: '', quantity: '', price: '' }
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), productName: '', description: '', quantity: '', price: '' }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    return sum + (qty * price);
  }, 0);
  
  const gstPercentage = parseFloat(gstRate) || 0;
  const tax = subtotal * (gstPercentage / 100);
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Convert items for API
    const apiItems = items.map(item => ({
      productName: item.productName,
      description: item.description,
      quantity: parseFloat(item.quantity) || 0,
      price: parseFloat(item.price) || 0,
    })).filter(item => item.productName || item.description || item.price > 0);

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          items: apiItems,
          gstRate: gstPercentage,
          subtotal,
          tax,
          total,
        }),
      });

      if (res.ok) {
        router.push('/invoices');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8" style={{ background: 'var(--page-gradient)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/invoices"
            className="p-2 rounded-xl transition-colors"
            style={{ background: 'hsl(var(--muted))' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(var(--foreground))' }} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>
              New Invoice
            </h1>
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Create a new invoice for your customer
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
                <FileText className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
              </div>
              Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C17A47]/20"
                  style={{ 
                    background: 'hsl(var(--card-bg))',
                    border: '1px solid hsl(var(--border) / 0.5)',
                    color: 'hsl(var(--foreground))'
                  }}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C17A47]/20"
                  style={{ 
                    background: 'hsl(var(--card-bg))',
                    border: '1px solid hsl(var(--border) / 0.5)',
                    color: 'hsl(var(--foreground))'
                  }}
                  placeholder="customer@example.com"
                />
              </div>
            </div>
          </motion.div>

          {/* GST Rate Setting */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
                <Percent className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
              </div>
              Tax Settings
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-32">
                <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  GST Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={gstRate}
                    onChange={(e) => setGstRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C17A47]/20 pr-8"
                    style={{ 
                      background: 'hsl(var(--card-bg))',
                      border: '1px solid hsl(var(--border) / 0.5)',
                      color: 'hsl(var(--foreground))'
                    }}
                    placeholder="18"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#8B7355]">%</span>
                </div>
              </div>
              <p className="text-sm text-[#8B7355] mt-5">
                Set your GST/Tax rate. Default is 18% for India.
              </p>
            </div>
          </motion.div>

          {/* Invoice Items */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                Invoice Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ 
                  background: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))'
                }}
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div 
                  key={item.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 rounded-xl"
                  style={{ background: 'hsl(var(--muted))' }}
                >
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={item.productName}
                      onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C17A47]/20"
                      style={{ 
                        background: 'hsl(var(--card-bg))',
                        border: '1px solid hsl(var(--border) / 0.5)',
                        color: 'hsl(var(--foreground))'
                      }}
                      placeholder="e.g., Saree"
                      required
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C17A47]/20"
                      style={{ 
                        background: 'hsl(var(--card-bg))',
                        border: '1px solid hsl(var(--border) / 0.5)',
                        color: 'hsl(var(--foreground))'
                      }}
                      placeholder="Item description (optional)"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      Qty
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C17A47]/20"
                      style={{ 
                        background: 'hsl(var(--card-bg))',
                        border: '1px solid hsl(var(--border) / 0.5)',
                        color: 'hsl(var(--foreground))'
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C17A47]/20"
                      style={{ 
                        background: 'hsl(var(--card-bg))',
                        border: '1px solid hsl(var(--border) / 0.5)',
                        color: 'hsl(var(--foreground))'
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                        Total
                      </label>
                      <div className="px-3 py-2 rounded-lg text-sm font-medium bg-[#F5F1EB] text-[#5A4D42]">
                        ₹{((parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)).toFixed(2)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-lg transition-colors hover:bg-red-500/20 mb-0.5"
                      style={{ color: 'hsl(var(--muted-foreground))' }}
                      disabled={items.length === 1}
                      title={items.length === 1 ? "Cannot remove last item" : "Remove item"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Totals */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="space-y-3">
              <div className="flex justify-between text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                <span>GST ({gstRate}%)</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-semibold"
                style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
                <span>Total (INR)</span>
                <span style={{ color: 'hsl(var(--primary))' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/invoices"
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-center text-sm font-medium transition-colors"
              style={{ 
                background: 'hsl(var(--muted))',
                color: 'hsl(var(--foreground))'
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !customerName || items.every(i => !i.description && !i.price)}
              className="flex-1 sm:flex-auto px-6 py-3 rounded-xl text-white text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))',
                boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.4)'
              }}
            >
              <Save className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
