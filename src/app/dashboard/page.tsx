'use client';

import { useAuth } from '@/app/components/auth/AuthProvider';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import UserForm from '@/app/components/UserForm';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
              <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="pb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.displayName || 'User'}!</h2>
                    <p className="mt-1 text-sm text-gray-600">
                      You're signed in with: {user?.email}
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <UserForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
