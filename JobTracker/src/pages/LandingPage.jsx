// 🏠 Landing Page - Explains JobTrackr and provides sign in/sign up options
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

// 🎨 Icons for features
const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const TargetIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

export default function LandingPage() {
  const { darkMode, toggleDarkMode } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showFeatures, setShowFeatures] = useState(false)

  // 🔄 Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-neutral-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      
      {/* 🎨 Header with Dark Mode Toggle */}
      <header className="relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* 🚀 Hero Section */}
      <div className="container mx-auto px-4 py-16">
        
        {/* 🎯 Main Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            JobTrackr
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Take control of your job search. Track applications, manage resumes, and land your dream job with confidence.
          </p>
          
          {/* 🔘 CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transform hover:-translate-y-1 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* 📊 Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          
          {/* 🎯 Benefit 1: Organization */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <TargetIcon className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Stay Organized
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Never lose track of where you applied. See all your applications in one place with status updates.
            </p>
          </div>

          {/* 📄 Benefit 2: Resume Management */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <DocumentIcon className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Manage Resumes
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upload multiple resumes and match the right one to each job application automatically.
            </p>
          </div>

          {/* 📈 Benefit 3: Track Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <ChartIcon className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Track Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your application status from submitted to interviewed to hired.
            </p>
          </div>
        </div>

        {/* 🔍 Features Section */}
        <div className="text-center mb-16">
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline mb-8"
          >
            {showFeatures ? 'Hide' : 'See All'} Features →
          </button>
          
          {showFeatures && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Everything You Need for Your Job Search
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                
                {/* ✅ Feature List */}
                {[
                  'Track unlimited job applications',
                  'Upload and manage multiple resumes',
                  'Set application deadlines and reminders',
                  'Record interview dates and notes',
                  'Track application status changes',
                  'Store company contact information',
                  'Add personal notes for each application',
                  'Dark mode for comfortable viewing',
                  'Mobile-friendly responsive design',
                  'Secure cloud storage for your data'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckIcon />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 🚀 How It Works */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            How JobTrackr Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Add Your Jobs
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Easily add job applications with company details, position, and application date.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Track Progress
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Update status as you progress: Applied → Interview → Offer → Hired.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Land Your Job
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Stay organized and never miss an opportunity. Focus on what matters most.
              </p>
            </div>
          </div>
        </div>

        {/* 🎯 Final CTA */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Take Control of Your Job Search?
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of job seekers who use JobTrackr to land their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Start Tracking Jobs Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transform hover:-translate-y-1 transition-all duration-200"
            >
              Already Have an Account?
            </Link>
          </div>
        </div>
      </div>

      {/* 🦶 Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2025 JobTrackr. Built with ❤️ to help you find your dream job.
          </p>
        </div>
      </footer>
    </div>
  )
}
