'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminNewsfeedManager from '@/components/AdminNewsfeedManager';
import DatabaseManager from '@/components/DatabaseManager';

interface DashboardStats {
  elections: {
    total: number;
    active: number;
    completed: number;
  };
  candidates: {
    total: number;
    verified: number;
    pending: number;
  };
  constituencies: {
    total: number;
    with_results: number;
    without_results: number;
  };
  system: {
    total_users: number;
    admin_logins: number;
    last_backup: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'newsfeed' | 'elections' | 'candidates' | 'database'>('dashboard');

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid or expired, remove it and redirect to login
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">Fetching latest analytics data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="h-10 w-10 text-red-500">⚠</div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchDashboardStats} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Image
                  src="/assets/election_logo.png"
                  alt="Election Admin"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">Election Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href="/admin/settings"
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                ⚙️ Settings
              </a>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                🛡️ Admin
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('newsfeed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'newsfeed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📰 Newsfeed Manager
            </button>
            <button
              onClick={() => setActiveTab('elections')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'elections'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🗳️ Elections
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'candidates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👥 Candidates
            </button>
            <a
              href="/admin/users"
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
            >
              👤 Admin Users
            </a>
            <button
              onClick={() => setActiveTab('database')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'database'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🗄️ Database Manager
            </button>
            <a
              href="/admin/settings"
              className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
            >
              ⚙️ Settings
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && stats && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Elections */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Total Elections</p>
                    <p className="text-3xl font-bold text-blue-900">{formatNumber(stats.elections.total)}</p>
                    <p className="text-xs text-blue-700">
                      {stats.elections.active} active, {stats.elections.completed} completed
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">🗳️</span>
                  </div>
                </div>
              </div>

              {/* Candidates */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-800">Total Candidates</p>
                    <p className="text-3xl font-bold text-green-900">{formatNumber(stats.candidates.total)}</p>
                    <p className="text-xs text-green-700">
                      {stats.candidates.verified} verified, {stats.candidates.pending} pending
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">👥</span>
                  </div>
                </div>
              </div>

              {/* Constituencies */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-800">Constituencies</p>
                    <p className="text-3xl font-bold text-purple-900">{formatNumber(stats.constituencies.total)}</p>
                    <p className="text-xs text-purple-700">
                      {stats.constituencies.with_results} with results
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">🏛️</span>
                  </div>
                </div>
              </div>

              {/* System */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-orange-800">System Users</p>
                    <p className="text-3xl font-bold text-orange-900">{formatNumber(stats.system.total_users)}</p>
                    <p className="text-xs text-orange-700">
                      Last backup: {new Date(stats.system.last_backup).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">⚙️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('newsfeed')}
                  className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 text-left"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📰</span>
                    <div>
                      <p className="font-medium text-blue-800">Manage Newsfeed</p>
                      <p className="text-sm text-blue-600">Add news and media for candidates</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('elections')}
                  className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200 text-left"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🗳️</span>
                    <div>
                      <p className="font-medium text-green-800">Manage Elections</p>
                      <p className="text-sm text-green-600">View and edit election data</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('candidates')}
                  className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200 text-left"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">👥</span>
                    <div>
                      <p className="font-medium text-purple-800">Manage Candidates</p>
                      <p className="text-sm text-purple-600">View and edit candidate profiles</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('database')}
                  className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all duration-200 text-left"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🗄️</span>
                    <div>
                      <p className="font-medium text-orange-800">Database Manager</p>
                      <p className="text-sm text-orange-600">Seed, clear, and manage database</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'newsfeed' && (
          <AdminNewsfeedManager onBack={() => setActiveTab('dashboard')} />
        )}

        {activeTab === 'elections' && (
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Election Management</h3>
            <p className="text-gray-600">Election management features coming soon...</p>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Candidate Management</h3>
            <p className="text-gray-600">Candidate management features coming soon...</p>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Database Management</h3>
            <DatabaseManager />
          </div>
        )}
      </main>
    </div>
  );
}
