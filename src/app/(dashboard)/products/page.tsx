'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, Search } from 'lucide-react';
import type { Product } from '@/types/product';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', taxRate: '0', sku: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

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

  return (
    <div className="p-6 h-full overflow-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <button
            onClick={() => setShowForm(true)}
            className="glass-button px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        <div className="glass-card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-white"
            />
          </div>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 mb-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Name *"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="glass-input px-4 py-2 rounded-lg text-white"
                required
              />
              <input
                type="text"
                placeholder="SKU"
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                className="glass-input px-4 py-2 rounded-lg text-white"
              />
              <input
                type="number"
                placeholder="Price *"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="glass-input px-4 py-2 rounded-lg text-white"
                required
                min="0"
                step="0.01"
              />
              <input
                type="number"
                placeholder="Tax Rate %"
                value={newProduct.taxRate}
                onChange={(e) => setNewProduct({ ...newProduct, taxRate: e.target.value })}
                className="glass-input px-4 py-2 rounded-lg text-white"
                min="0"
                max="100"
              />
              <input
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="glass-input px-4 py-2 rounded-lg text-white col-span-2"
              />
              <div className="col-span-2 flex gap-2">
                <button type="submit" className="glass-button px-4 py-2 rounded-lg text-white">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="glass px-4 py-2 rounded-lg text-white/60">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="glass-card p-8 text-center col-span-full">
                <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No products found</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <motion.div key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      {product.sku && <p className="text-white/40 text-xs">SKU: {product.sku}</p>}
                    </div>
                    <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
                  </div>
                  {product.description && <p className="text-white/50 text-sm mb-2">{product.description}</p>}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white/40">Tax: {product.taxRate}%</span>
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
