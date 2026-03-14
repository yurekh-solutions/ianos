'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Search, Filter, Download, ArrowUpRight, TrendingUp, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Invoice } from '@/types/invoice';

const chartData = [
  { month: 'Jan', paid: 12, pending: 5 },
  { month: 'Feb', paid: 18, pending: 3 },
  { month: 'Mar', paid: 15, pending: 8 },
  { month: 'Apr', paid: 22, pending: 4 },
  { month: 'May', paid: 28, pending: 6 },
  { month: 'Jun', paid: 32, pending: 3 },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchInvoices(); }, []);

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

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => i.status === 'pending').length,
    revenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0),
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      sent: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
      draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="p-6 h-full overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Invoices</h1>
            <p className="text-white/50 text-sm">Manage and track your invoices</p>
          </div>
          <Link href="/invoices/new">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white text-sm font-medium shadow-lg shadow-indigo-500/25">
              <Plus className="w-4 h-4" /> Create Invoice
            </motion.button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Invoices', value: stats.total, icon: FileText, gradient: 'from-indigo-500 to-purple-500' },
            { label: 'Paid', value: stats.paid, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-500' },
            { label: 'Pending', value: stats.pending, icon: Clock, gradient: 'from-amber-500 to-orange-500' },
            { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, gradient: 'from-pink-500 to-rose-500' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 group hover:bg-white/10 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase">{stat.label}</p>
                  <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-50`} />
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> Invoice Overview
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Bar dataKey="paid" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input type="text" placeholder="Search invoices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50">
              <option value="all" className="bg-slate-900">All Status</option>
              <option value="paid" className="bg-slate-900">Paid</option>
              <option value="pending" className="bg-slate-900">Pending</option>
              <option value="sent" className="bg-slate-900">Sent</option>
              <option value="overdue" className="bg-slate-900">Overdue</option>
            </select>
          </div>
        </div>

        {/* Invoices Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FileText className="w-12 h-12 text-white/20 mb-4" />
              <p className="text-white/60">No invoices found</p>
              <p className="text-white/40 text-sm mt-1">Create your first invoice to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr className="text-white/40 text-xs uppercase tracking-wide">
                    <th className="text-left py-3 px-4 font-medium">Invoice</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice, index) => (
                    <motion.tr key={invoice.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                      className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-indigo-400" />
                          </div>
                          <span className="text-white text-sm font-medium">{invoice.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/70 text-sm">{invoice.customerName}</td>
                      <td className="py-3 px-4 text-white/50 text-sm">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-white text-sm font-medium">${invoice.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize border ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <Link href={`/invoices/${invoice.id}`}>
                            <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
