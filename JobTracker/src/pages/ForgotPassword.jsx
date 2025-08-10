/* 
  LEARNING COMMENT: ForgotPassword Component
  - Handles password reset flow
  - Step 1: Enter email to receive reset code
  - Step 2: Enter reset code and new password
  - Integrated with backend API for secure password reset
*/
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword, resetPassword } from '../services/api'

function ForgotPassword() {
  const [step, setStep] = useState(1) // 1: Enter email, 2: Enter code and new password
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Form data
  const [email, setEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Step 1: Request reset code
  const handleRequestCode = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Email is required')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await forgotPassword(email)
      setMessage(response.message)
      
      // For demo purposes, show the reset code
      if (response.resetCode) {
        setMessage(prev => prev + ` Reset code: ${response.resetCode}`)
      }
      
      setStep(2)
    } catch (error) {
      setError(error.message || 'Failed to send reset code')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Reset password with code
  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    if (!resetCode || !newPassword || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Frontend validation to match backend requirements
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    
    if (!/[A-Z]/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter')
      return
    }
    
    if (!/[a-z]/.test(newPassword)) {
      setError('Password must contain at least one lowercase letter')
      return
    }
    
    if (!/\d/.test(newPassword)) {
      setError('Password must contain at least one number')
      return
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setError('Password must contain at least one special character')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      await resetPassword({
        email,
        resetCode,
        newPassword
      })
      
      setMessage('Password reset successfully! You can now login with your new password.')
      setStep(3) // Success step
    } catch (error) {
      setError(error.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              back to login
            </Link>
          </p>
        </div>

        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleRequestCode}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-gray-600 placeholder-slate-500 dark:placeholder-gray-400 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 focus:z-10 sm:text-sm"
                placeholder="Enter your email address"
              />
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</div>
            )}

            {message && (
              <div className="text-green-600 dark:text-green-400 text-sm mt-2">{message}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900"
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="resetCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Reset Code
              </label>
              <input
                id="resetCode"
                name="resetCode"
                type="text"
                required
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-gray-600 placeholder-slate-500 dark:placeholder-gray-400 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-gray-600 placeholder-slate-500 dark:placeholder-gray-400 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 focus:z-10 sm:text-sm"
                placeholder="Enter new password"
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 space-y-1">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside ml-2 space-y-0.5">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter (A-Z)</li>
                  <li>One lowercase letter (a-z)</li>
                  <li>One number (0-9)</li>
                  <li>One special character (!@#$%^&*)</li>
                </ul>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-gray-600 placeholder-slate-500 dark:placeholder-gray-400 text-slate-900 dark:text-slate-100 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 focus:z-10 sm:text-sm"
                placeholder="Confirm new password"
              />
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</div>
            )}

            {message && (
              <div className="text-green-600 dark:text-green-400 text-sm mt-2">{message}</div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2 px-4 border border-slate-300 dark:border-gray-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="mt-8 space-y-6 text-center">
            <div className="text-green-600 dark:text-green-400 text-lg font-medium">
              ✅ Password Reset Successful!
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Your password has been updated. You can now login with your new password.
            </p>
            <Link
              to="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
