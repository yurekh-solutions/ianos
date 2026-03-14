'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, Search, X, DollarSign, Tag, TrendingUp, Grid3X3, List } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Product } from '@/types/product';

const chartData = [
  { category: 'Electronics', sales: 45 },
  { category: 'Services', sales: 32 },
  { category: 'Software', sales: 28 },
  { category: 'Hardware', sales: 18 },
  { category: 'Other', sales: 12 },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', taxRate: '0', sku: '' });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          taxRate: parseFloat(newProduct.taxRate),
        }),
      });
      if (res.ok) {
        setNewProduct({ name: '', description: '', price: '', taxRate: '0', sku: '' });
        setShowForm(false);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const avgPrice = products.length > 0 ? totalValue / products.length : 0;

  return (
    <div className="p-6 h-full overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-white/50 text-sm">Manage your product catalog</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40'}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg text-white text-sm font-medium shadow-lg shadow-amber-500/25">
              <Plus className="w-4 h-4" /> Add Product
            </motion.button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Products', value: products.length, icon: Package, gradient: 'from-amber-500 to-orange-500' },
            { label: 'Avg Price', value: `$${avgPrice.toFixed(2)}`, icon: DollarSign, gradient: 'from-emerald-500 to-teal-500' },
            { label: 'Total Value', value: `$${totalValue.toLocaleString()}`, icon: TrendingUp, gradient: 'from-indigo-500 to-purple-500' },
            { label: 'Categories', value: '5', icon: Tag, gradient: 'from-pink-500 to-rose-500' },
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
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" /> Sales by Category
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <YAxis dataKey="category" type="category" stroke="rgba(255,255,255,0.3)" fontSize={11} width={80} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Bar dataKey="sales" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500/50" />
        </div>

        {/* Add Product Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                className="w-full max-w-md rounded-xl bg-slate-900 border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Add New Product</h3>
                  <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-white/10 text-white/60">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input type="text" placeholder="Product Name *" value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500/50" required />
                  <input type="text" placeholder="SKU" value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500/50" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Price *" value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500/50" required min="0" step="0.01" />
                    <input type="number" placeholder="Tax Rate %" value={newProduct.taxRate}
                      onChange={(e) => setNewProduct({ ...newProduct, taxRate: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500/50" min="0" max="100" />
                  </div>
                  <input type="text" placeholder="Description" value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500/50" />
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium">Save Product</button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-lg bg-white/5 text-white/60 text-sm hover:bg-white/10">Cancel</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-white/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {filteredProducts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 rounded-xl bg-white/5 border border-white/10">
                <Package className="w-12 h-12 text-white/20 mb-4" />
                <p className="text-white/60">No products found</p>
                <p className="text-white/40 text-sm mt-1">Add your first product to get started</p>
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  className={`rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-all group ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'flex items-center gap-4 flex-1' : ''}`}>
                    <div className={`rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg ${viewMode === 'list' ? 'w-12 h-12' : 'w-14 h-14 mb-3'}`}>
                      <Package className={`text-white ${viewMode === 'list' ? 'w-6 h-6' : 'w-7 h-7'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          {product.sku && <p className="text-white/40 text-xs">SKU: {product.sku}</p>}
                        </div>
                        <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
                      </div>
                      {product.description && <p className="text-white/50 text-sm mt-1 line-clamp-2">{product.description}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-white/40 text-xs">Tax: {product.taxRate}%</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">Active</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
