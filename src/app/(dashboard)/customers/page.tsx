'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Search } from 'lucide-react';
import type { Customer } from '@/types/customer';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });
      if (res.ok) {
        setNewCustomer({ name: '', email: '', phone: '', address: '' });
        setShowForm(false);
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 h-full overflow-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <button
            onClick={() => setShowForm(true)}
            className="glass-button px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <Plus className="w-5 h-5" />
            Add Customer
          </button>
        </div>

        <div className="glass-card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search customers..."
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
                placeholder="Name *"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="glass-input px-4 py-2 rounded-lg text-white"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="glass-input px-4 py-2 rounded-lg text-white"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="glass-input px-4 py-2 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Address"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                className="glass-input px-4 py-2 rounded-lg text-white"
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
            {filteredCustomers.length === 0 ? (
              <div className="glass-card p-8 text-center col-span-full">
                <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No customers found</p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <motion.div key={customer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-semibold">{customer.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{customer.name}</p>
                      {customer.email && <p className="text-white/50 text-sm">{customer.email}</p>}
                    </div>
                  </div>
                  {customer.phone && <p className="text-white/60 text-sm">{customer.phone}</p>}
                  {customer.address && <p className="text-white/40 text-sm mt-1">{customer.address}</p>}
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
