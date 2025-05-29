
import React, { useState, useEffect } from 'react';
import { Plus, Search, BarChart3, Users, Clock, CheckCircle } from 'lucide-react';
import AdminDashboard from '../components/AdminDashboard';
import ClientLookup from '../components/ClientLookup';
import AddRepairForm from '../components/AddRepairForm';
import { getRepairs, getStats } from '../utils/storage';
import { Repair, RepairStats } from '../types';

const Index = () => {
  const [activeView, setActiveView] = useState<'admin' | 'client'>('admin');
  const [showAddForm, setShowAddForm] = useState(false);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [stats, setStats] = useState<RepairStats>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
    total: 0
  });

  const loadData = () => {
    const repairData = getRepairs();
    const statsData = getStats();
    setRepairs(repairData);
    setStats(statsData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRepairAdded = () => {
    setShowAddForm(false);
    loadData();
  };

  const handleRepairUpdated = () => {
    loadData();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <header className="shadow-lg" style={{ backgroundColor: '#002B5B', color: 'white' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">JBV Repair Flow Tracker</h1>
              <p className="mt-1 opacity-80">Professional Device Repair Management</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setActiveView('admin')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeView === 'admin'
                    ? 'text-white shadow-lg'
                    : 'bg-blue-700 hover:bg-blue-600'
                }`}
                style={{
                  backgroundColor: activeView === 'admin' ? '#00C4B3' : undefined,
                  color: activeView === 'admin' ? '#002B5B' : undefined
                }}
              >
                Admin Dashboard
              </button>
              <button
                onClick={() => setActiveView('client')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeView === 'client'
                    ? 'text-white shadow-lg'
                    : 'bg-blue-700 hover:bg-blue-600'
                }`}
                style={{
                  backgroundColor: activeView === 'client' ? '#00C4B3' : undefined,
                  color: activeView === 'client' ? '#002B5B' : undefined
                }}
              >
                <Search className="w-4 h-4" />
                Track Repair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      {activeView === 'admin' && (
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Today</p>
                  <p className="text-2xl font-bold" style={{ color: '#002B5B' }}>{stats.today}</p>
                </div>
                <Clock className="w-8 h-8" style={{ color: '#00C4B3' }} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">This Week</p>
                  <p className="text-2xl font-bold" style={{ color: '#002B5B' }}>{stats.thisWeek}</p>
                </div>
                <BarChart3 className="w-8 h-8" style={{ color: '#00C4B3' }} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">This Month</p>
                  <p className="text-2xl font-bold" style={{ color: '#002B5B' }}>{stats.thisMonth}</p>
                </div>
                <Users className="w-8 h-8" style={{ color: '#00C4B3' }} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">This Year</p>
                  <p className="text-2xl font-bold" style={{ color: '#002B5B' }}>{stats.thisYear}</p>
                </div>
                <CheckCircle className="w-8 h-8" style={{ color: '#00C4B3' }} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-2xl font-bold" style={{ color: '#002B5B' }}>{stats.total}</p>
                </div>
                <BarChart3 className="w-8 h-8" style={{ color: '#00C4B3' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        {activeView === 'admin' && !showAddForm && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">Active Repairs</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                style={{ backgroundColor: '#00C4B3' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#009B8B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00C4B3'}
              >
                <Plus className="w-5 h-5" />
                Add New Repair
              </button>
            </div>
            <AdminDashboard repairs={repairs} onRepairUpdated={handleRepairUpdated} />
          </div>
        )}

        {activeView === 'admin' && showAddForm && (
          <AddRepairForm
            onBack={() => setShowAddForm(false)}
            onSaved={handleRepairAdded}
          />
        )}

        {activeView === 'client' && (
          <ClientLookup />
        )}
      </main>
    </div>
  );
};

export default Index;
