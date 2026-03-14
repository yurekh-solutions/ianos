'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, FileText, Users, Download, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 4200, expenses: 2400 },
  { month: 'Feb', revenue: 3800, expenses: 2200 },
  { month: 'Mar', revenue: 5100, expenses: 2800 },
  { month: 'Apr', revenue: 4800, expenses: 2600 },
  { month: 'May', revenue: 6200, expenses: 3100 },
  { month: 'Jun', revenue: 5800, expenses: 2900 },
];

const invoiceData = [
  { status: 'Paid', value: 65, color: '#10b981' },
  { status: 'Pending', value: 25, color: '#f59e0b' },
  { status: 'Overdue', value: 10, color: '#ef4444' },
];

const customerGrowth = [
  { month: 'Jan', customers: 45 },
  { month: 'Feb', customers: 52 },
  { month: 'Mar', customers: 61 },
  { month: 'Apr', customers: 67 },
  { month: 'May', customers: 78 },
  { month: 'Jun', customers: 89 },
];

const topCustomers = [
  { name: 'Acme Corp', revenue: 12500, invoices: 8 },
  { name: 'Tech Solutions', revenue: 9800, invoices: 6 },
  { name: 'Global Inc', revenue: 8200, invoices: 5 },
  { name: 'StartUp Labs', revenue: 6500, invoices: 4 },
  { name: 'Digital Co', revenue: 5100, invoices: 3 },
];

export default function ReportsPage() {
  const stats = [
    { label: 'Total Revenue', value: '$28,450', change: '+12.5%', up: true, icon: DollarSign, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Total Invoices', value: '156', change: '+8.2%', up: true, icon: FileText, gradient: 'from-indigo-500 to-purple-500' },
    { label: 'Active Customers', value: '89', change: '+15.3%', up: true, icon: Users, gradient: 'from-pink-500 to-rose-500' },
    { label: 'Avg Invoice', value: '$182', change: '-2.4%', up: false, icon: BarChart3, gradient: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="p-4 md:p-6 h-full overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Reports</h1>
            <p className="text-white/50 text-sm">Analytics and insights for your business</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
              <option value="30" className="bg-slate-900">Last 30 days</option>
              <option value="90" className="bg-slate-900">Last 90 days</option>
              <option value="365" className="bg-slate-900">This Year</option>
            </select>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white text-sm font-medium shadow-lg shadow-cyan-500/25">
              <Download className="w-4 h-4" /> Export
            </motion.button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 group hover:bg-white/10 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase">{stat.label}</p>
                  <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.up ? <ArrowUpRight className="w-3 h-3 text-emerald-400" /> : <ArrowDownRight className="w-3 h-3 text-red-400" />}
                    <span className={stat.up ? 'text-emerald-400 text-xs' : 'text-red-400 text-xs'}>{stat.change}</span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-50`} />
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Revenue vs Expenses
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Revenue</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Expenses</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Invoice Status Pie */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Invoice Status
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={invoiceData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                  {invoiceData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-3 mt-2">
              {invoiceData.map((item) => (
                <div key={item.status} className="flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-white/60">{item.status}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Customer Growth */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-400" /> Customer Growth
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="customers" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899', strokeWidth: 0, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Customers */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" /> Top Customers
            </h3>
            <div className="space-y-3">
              {topCustomers.map((customer, index) => (
                <div key={customer.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{customer.name}</p>
                    <p className="text-white/40 text-xs">{customer.invoices} invoices</p>
                  </div>
                  <span className="text-white font-medium text-sm">${customer.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
