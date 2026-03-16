'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Save, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, price: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          items,
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
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ 
                    background: 'hsl(var(--input-bg))',
                    border: '1px solid hsl(var(--input-border))',
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
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ 
                    background: 'hsl(var(--input-bg))',
                    border: '1px solid hsl(var(--input-border))',
                    color: 'hsl(var(--foreground))'
                  }}
                  placeholder="customer@example.com"
                />
              </div>
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
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{ 
                        background: 'hsl(var(--input-bg))',
                        border: '1px solid hsl(var(--input-border))',
                        color: 'hsl(var(--foreground))'
                      }}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{ 
                        background: 'hsl(var(--input-bg))',
                        border: '1px solid hsl(var(--input-border))',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{ 
                        background: 'hsl(var(--input-bg))',
                        border: '1px solid hsl(var(--input-border))',
                        color: 'hsl(var(--foreground))'
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="sm:col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-lg transition-colors hover:bg-red-500/20"
                      style={{ color: 'hsl(var(--muted-foreground))' }}
                      disabled={items.length === 1}
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
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-semibold"
                style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
                <span>Total</span>
                <span style={{ color: 'hsl(var(--primary))' }}>${total.toFixed(2)}</span>
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
              disabled={loading}
              className="flex-1 sm:flex-auto px-6 py-3 rounded-xl text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
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
