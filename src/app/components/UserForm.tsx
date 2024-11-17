// app/components/UserForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

// Firebase configuration - replace with your config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// TypeScript interfaces
interface FormData {
  name: string;
  email: string;
  message: string;
}

interface Submission extends FormData {
  id: string;
  createdAt: Timestamp;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

import { useAuth } from './auth/AuthProvider';

export default function UserForm() {
  const { user } = useAuth();
  // State management
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, 'submissions'), {
        ...formData,
        createdAt: Timestamp.now(),
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: '',
      });
      
    } catch (error) {
      setSubmitError('Failed to submit form. Please try again.');
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time submissions updates
  useEffect(() => {
    const q = query(
      collection(db, 'submissions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const submissionsData: Submission[] = [];
        querySnapshot.forEach((doc) => {
          submissionsData.push({
            id: doc.id,
            ...(doc.data() as Omit<Submission, 'id'>),
          });
        });
        setSubmissions(submissionsData);
      },
      (error) => {
        console.error('Error fetching submissions:', error);
        setSubmitError('Failed to fetch submissions');
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              errors.message ? 'border-red-500' : ''
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-500">{errors.message}</p>
          )}
        </div>

        {submitError && (
          <div className="text-red-500 text-sm">{submitError}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {/* Recent Submissions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Submissions</h2>
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="p-4 border rounded-md bg-gray-50"
            >
              <p className="font-medium">{submission.name}</p>
              <p className="text-sm text-gray-600">{submission.email}</p>
              <p className="mt-2">{submission.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {submission.createdAt.toDate().toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}