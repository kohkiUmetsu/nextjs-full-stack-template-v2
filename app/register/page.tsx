'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { signup } from './actions';
import { RegisterFormData, registerSchema } from '@/types/auth';

// Loading component
function RegisterLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Sign Up</h1>
        <div className="space-y-6">
          <div className="h-12 animate-pulse rounded bg-gray-200"></div>
          <div className="h-12 animate-pulse rounded bg-gray-200"></div>
          <div className="h-12 animate-pulse rounded bg-gray-200"></div>
          <div className="h-12 animate-pulse rounded bg-gray-200"></div>
          <div className="h-12 animate-pulse rounded bg-gray-200"></div>
          <div className="h-12 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}

// Registration form component
function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    }
  }, [searchParams]);

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage('');
    
    // Validate with Zod
    const validationResult = registerSchema.safeParse(data);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      setErrorMessage(firstError.message);
      return;
    }

    const result = await signup(data);
    if (result && 'success' in result && !result.success) {
      setErrorMessage(result.error.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Create Account</h1>
        
        {errorMessage && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email address"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {/* Email Confirmation Field */}
          <div>
            <label htmlFor="emailConfirm" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Email Address
            </label>
            <input
              id="emailConfirm"
              type="email"
              {...register('emailConfirm')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm your email address"
            />
            {errors.emailConfirm && <p className="mt-1 text-sm text-red-600">{errors.emailConfirm.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Create a secure password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {/* Password Confirmation Field */}
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="passwordConfirm"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('passwordConfirm')}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {errors.passwordConfirm && <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm.message}</p>}
          </div>

          {/* Terms Checkbox */}
          <div>
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                {...register('terms')}
                className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                I agree to the{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  );
}