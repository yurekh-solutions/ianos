'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Palette, Globe, Moon, Sun, Save, CheckCircle2, Mail, Lock, Smartphone } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    invoiceReminders: true,
    darkMode: true,
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    twoFactor: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button type="button" onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-indigo-500' : 'bg-white/10'}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'left-6' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="p-4 md:p-6 h-full overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-white/50 text-sm">Manage your account preferences</p>
          </div>
          {saved && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4" /> Settings saved
            </motion.div>
          )}
        </div>

        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 md:p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" /> Profile
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">{session?.user?.name?.[0] || 'U'}</span>
            </div>
            <div className="text-center sm:text-left flex-1">
              <p className="text-white font-medium">{session?.user?.name || 'User'}</p>
              <p className="text-white/50 text-sm">{session?.user?.email || 'user@example.com'}</p>
              <p className="text-emerald-400 text-xs mt-1">Google Account Connected</p>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 md:p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-pink-400" /> Notifications
          </h2>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', icon: Mail, label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'pushNotifications', icon: Smartphone, label: 'Push Notifications', desc: 'Browser push notifications' },
              { key: 'invoiceReminders', icon: Bell, label: 'Invoice Reminders', desc: 'Remind customers about pending invoices' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    <p className="text-white/40 text-xs">{item.desc}</p>
                  </div>
                </div>
                <Toggle enabled={settings[item.key as keyof typeof settings] as boolean}
                  onChange={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 md:p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" /> Appearance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                {settings.darkMode ? <Moon className="w-5 h-5 text-white/40" /> : <Sun className="w-5 h-5 text-white/40" />}
                <div>
                  <p className="text-white text-sm font-medium">Dark Mode</p>
                  <p className="text-white/40 text-xs">Use dark theme</p>
                </div>
              </div>
              <Toggle enabled={settings.darkMode} onChange={() => setSettings({ ...settings, darkMode: !settings.darkMode })} />
            </div>
          </div>
        </motion.div>

        {/* Regional */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 md:p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" /> Regional Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs font-medium uppercase">Language</label>
              <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50">
                <option value="en" className="bg-slate-900">English</option>
                <option value="es" className="bg-slate-900">Spanish</option>
                <option value="fr" className="bg-slate-900">French</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs font-medium uppercase">Currency</label>
              <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50">
                <option value="USD" className="bg-slate-900">USD ($)</option>
                <option value="EUR" className="bg-slate-900">EUR (€)</option>
                <option value="GBP" className="bg-slate-900">GBP (£)</option>
                <option value="INR" className="bg-slate-900">INR (₹)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs font-medium uppercase">Date Format</label>
              <select value={settings.dateFormat} onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50">
                <option value="MM/DD/YYYY" className="bg-slate-900">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY" className="bg-slate-900">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD" className="bg-slate-900">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 md:p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-white text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-white/40 text-xs">Add an extra layer of security</p>
                </div>
              </div>
              <Toggle enabled={settings.twoFactor} onChange={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })} />
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="flex justify-end">
          <motion.button onClick={handleSave} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white text-sm font-medium shadow-lg shadow-indigo-500/25">
            <Save className="w-4 h-4" /> Save Settings
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
