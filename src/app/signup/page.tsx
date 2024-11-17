'use client';

import Link from 'next/link';
import SignUp from '@/app/components/auth/SignUp';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Create a new account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignUp />
      </div>
    </div>
  );
}