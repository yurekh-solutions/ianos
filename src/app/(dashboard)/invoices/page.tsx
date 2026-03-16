'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, Filter, MoreVertical, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customer: { name: string };
  totalAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  createdAt: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices');
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
      pending: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
      overdue: 'bg-red-500/20 text-red-600 border-red-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-600 border-gray-500/30';
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8" style={{ background: 'var(--page-gradient)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>Invoices</h1>
            <p className="text-sm sm:text-base mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Manage and track your invoices
            </p>
          </div>
          <Link
            href="/invoices/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl text-white text-sm font-medium transition-all shadow-lg active:scale-95"
            style={{ 
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))',
              boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.4)'
            }}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>New Invoice</span>
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="glass-card p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm transition-all"
              style={{ 
                background: 'hsl(var(--input-bg))',
                border: '1px solid hsl(var(--input-border))',
                color: 'hsl(var(--foreground))'
              }}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{ 
              background: 'hsl(var(--muted))',
              color: 'hsl(var(--foreground))'
            }}>
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Invoices List */}
        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-t-[hsl(var(--primary))] rounded-full animate-spin mx-auto" 
                style={{ borderColor: 'hsl(var(--border))', borderTopColor: 'hsl(var(--primary))' }} />
            </div>
          ) : filteredInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'hsl(var(--muted))' }}>
                    <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>Invoice</th>
                    <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>Customer</th>
                    <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>Amount</th>
                    <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>Status</th>
                    <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>Date</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t transition-colors hover:bg-[hsl(var(--muted))]"
                      style={{ borderColor: 'hsl(var(--border))' }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'hsl(var(--primary) / 0.1)' }}>
                            <FileText className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                          </div>
                          <span className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                            {invoice.invoiceNumber}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6" style={{ color: 'hsl(var(--foreground))' }}>
                        {invoice.customer?.name || 'N/A'}
                      </td>
                      <td className="py-4 px-6 font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                        ${invoice.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <button className="p-2 rounded-lg transition-colors hover:bg-[hsl(var(--muted))]">
                          <MoreVertical className="w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>No invoices yet</h3>
              <p className="text-sm mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Create your first invoice to get started
              </p>
              <Link
                href="/invoices/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium transition-all"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))',
                  boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.4)'
                }}
              >
                <Plus className="w-4 h-4" />
                Create Invoice
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
