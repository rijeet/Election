'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  is_active: boolean;
  last_login?: string;
  created_at: string;
  login_attempts?: Array<{
    ip_address: string;
    user_agent: string;
    success: boolean;
    timestamp: string;
  }>;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch admin users');
      }

      const data = await response.json();
      setAdmins(data.admins);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      setError('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderator':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading admin users...</p>
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchAdmins} 
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
                  Admin Users
                </h1>
                <p className="text-sm text-gray-600">Manage administrator accounts</p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/admin')}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Administrator Accounts</h2>
            <div className="text-sm text-gray-600">
              Total: {admins.length} users
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins.map((admin) => (
              <div key={admin._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {admin.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(admin.role)}`}>
                    {admin.role.replace('_', ' ').toUpperCase()}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      admin.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {admin.last_login && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Login:</span>
                      <span className="text-sm text-gray-900">{formatDate(admin.last_login)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm text-gray-900">{formatDate(admin.created_at)}</span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Permissions:</span>
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.map((permission, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {permission.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {admin.login_attempts && admin.login_attempts.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600 block mb-2">Recent Activity:</span>
                      <div className="text-xs text-gray-500">
                        {admin.login_attempts.slice(-3).map((attempt, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{attempt.success ? '✅' : '❌'} Login</span>
                            <span>{formatDate(attempt.timestamp)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
