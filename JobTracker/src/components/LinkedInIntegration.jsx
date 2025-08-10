{/* 
  🔗 LEARNING COMMENT: LinkedIn Integration Component
  =================================================
  
  This component provides LinkedIn integration features:
  - Connect to LinkedIn account
  - Auto-fill job application forms
  - Import profile information
  - Parse LinkedIn job URLs
  
  Features:
  - LinkedIn OAuth authentication
  - Profile data import
  - Job URL parsing for auto-fill
  - Auto-populate form fields
*/}

import { useState } from 'react'
import axios from 'axios'

function LinkedInIntegration({ onAutoFill, isJobForm = false }) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [linkedinData, setLinkedinData] = useState(null)
  const [jobUrl, setJobUrl] = useState('')
  const [isParsingJob, setIsParsingJob] = useState(false)

  {/* 
    🔗 LEARNING COMMENT: LinkedIn Authentication
    ===========================================
    
    Initiates LinkedIn OAuth flow by redirecting user to LinkedIn's
    authorization page where they can grant permission.
  */}
  const connectLinkedIn = async () => {
    try {
      setIsConnecting(true)
      
      // Get LinkedIn authorization URL from backend
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://jobtrackr-production.up.railway.app/api'}/auth/linkedin`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      // Redirect user to LinkedIn authorization page
      window.location.href = response.data.authUrl
      
    } catch (error) {
      console.error('LinkedIn connection error:', error)
      alert('Failed to connect to LinkedIn. Please try again.')
      setIsConnecting(false)
    }
  }

  {/* 
    💼 LEARNING COMMENT: LinkedIn Job URL Parser with Smart Instructions
    ===================================================================
    
    Parses a LinkedIn job URL to extract job information and provides
    helpful guidance for manual data entry when automatic scraping isn't possible.
  */}
  const parseLinkedInJob = async () => {
    if (!jobUrl) {
      alert('Please enter a LinkedIn job URL')
      return
    }

    try {
      setIsParsingJob(true)
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'https://jobtrackr-production.up.railway.app/api'}/auth/linkedin/parse-job`, {
        jobUrl: jobUrl
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const jobData = response.data.jobData
      
      // Check if this is a template response (LinkedIn blocked scraping)
      if (jobData.isTemplate) {
        // Show helpful instructions to the user
        const instructions = jobData.instructions.join('\n• ')
        alert(`📋 LinkedIn Job URL Processed!

The URL has been validated and saved. Since LinkedIn blocks automated data extraction, please follow these steps:

• ${instructions}

The form will be populated with the job URL and helpful templates. Click OK to continue.`)
      } else {
        alert('✅ Job information imported successfully!')
      }
      
      // Call parent component's auto-fill function
      if (onAutoFill) {
        onAutoFill(jobData)
      }
      
      // Clear the URL input
      setJobUrl('')
      
    } catch (error) {
      console.error('Job parsing error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to parse LinkedIn job URL'
      alert(`❌ Error: ${errorMessage}

Please check that you've entered a valid LinkedIn job URL in this format:
https://www.linkedin.com/jobs/view/1234567890`)
    } finally {
      setIsParsingJob(false)
    }
  }

  {/* 
    📄 LEARNING COMMENT: Profile Auto-Fill
    =====================================
    
    Uses stored LinkedIn profile data to auto-fill personal
    information in job application forms.
  */}
  const autoFillFromProfile = () => {
    if (!linkedinData) {
      alert('Please connect your LinkedIn account first')
      return
    }

    if (onAutoFill) {
      onAutoFill({
        firstName: linkedinData.personal.firstName,
        lastName: linkedinData.personal.lastName,
        email: linkedinData.personal.email,
        location: linkedinData.personal.location,
        coverLetter: linkedinData.summary,
        type: linkedinData.preferences.type,
        remote: linkedinData.preferences.remote,
        status: linkedinData.preferences.status
      })
    }

    alert('✅ Profile information auto-filled!')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-gray-600">
      <div className="flex items-center space-x-3 mb-6">
        {/* LinkedIn Logo Icon */}
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">LinkedIn Integration</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Auto-fill forms with LinkedIn data</p>
        </div>
      </div>

      {/* LinkedIn Connection Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h4 className="font-medium text-slate-800 dark:text-slate-200">Connect LinkedIn Account</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Import your profile information for auto-filling forms
            </p>
          </div>
          <button
            onClick={connectLinkedIn}
            disabled={isConnecting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>Connect</span>
              </>
            )}
          </button>
        </div>

        {/* Auto-fill from Profile */}
        {linkedinData && (
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-200">Profile Connected ✅</h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                {linkedinData.personal.firstName} {linkedinData.personal.lastName} • {linkedinData.personal.headline}
              </p>
            </div>
            <button
              onClick={autoFillFromProfile}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Auto-Fill Profile
            </button>
          </div>
        )}

        {/* LinkedIn Job URL Parser - Only show for job forms */}
        {isJobForm && (
          <div className="border-t border-slate-200 dark:border-gray-600 pt-4">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Import Job from LinkedIn</h4>
            <div className="flex space-x-3">
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="Paste LinkedIn job URL (e.g., https://linkedin.com/jobs/view/1234567890)"
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={parseLinkedInJob}
                disabled={isParsingJob || !jobUrl}
                className="bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                {isParsingJob ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Parsing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Import</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              💡 Tip: Copy the LinkedIn job URL from your browser's address bar. LinkedIn blocks automatic data extraction, but this will validate the URL and provide helpful templates for manual entry.
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">How LinkedIn Integration Works:</h4>
        <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
          <li>Click "Connect" to link your LinkedIn account (OAuth authentication)</li>
          <li>Grant permission to access your profile information</li>
          <li>Use "Auto-Fill Profile" to populate personal information</li>
          {isJobForm && (
            <>
              <li>Paste LinkedIn job URLs to validate and get helpful templates</li>
              <li>LinkedIn blocks automatic scraping, so you'll get guided templates for manual entry</li>
              <li>Follow the on-screen instructions to copy job details from LinkedIn</li>
            </>
          )}
        </ol>
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            <strong>Note:</strong> LinkedIn actively blocks automated data extraction to protect user privacy. 
            This tool validates URLs and provides structured templates to make manual entry quick and organized.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LinkedInIntegration
