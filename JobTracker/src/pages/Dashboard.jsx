{/* 
  LEARNING COMMENT: Import statements for React functionality and navigation
  - useState: React hook that allows us to store and update changing data in our component
  - useNavigate: React Router hook that enables programmatic navigation (like clicking links but in code)
*/}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

{/* 
  LEARNING COMMENT: Dashboard Component - The main dashboard page component
  - This is a functional React component that returns JSX (HTML-like code)
  - It displays summary statistics, quick action buttons, and recent job applications
  - Users see this page after logging in to get an overview of their job search progress
*/}
function Dashboard() {
  
  {/* 
    LEARNING COMMENT: Navigation function for programmatic routing
    - useNavigate returns a function that can send users to different pages
    - Example: navigate('/jobs') redirects user to the jobs page
    - This is used in button click handlers to change pages programmatically
  */}
  const navigate = useNavigate()
  
  {/* 
    LEARNING COMMENT: Dashboard statistics state
    - useState creates a state variable 'stats' with job application summary numbers
    - Notice we only destructure 'stats' (not setStats) because this data doesn't change
    - In a real app, this data would come from an API call to get current user stats
    - These numbers drive the 4 colored cards at the top of the dashboard
  */}
  const [stats] = useState({
    // Total number of job applications the user has submitted
    totalApplications: 15,
    // Applications still waiting for a response from the company  
    pending: 6,
    // Applications that resulted in interview invitations
    interviews: 5,
    // Applications that were unfortunately rejected
    rejected: 2
  })

  {/* 
    LEARNING COMMENT: Recent job applications sample data
    - useState creates state for storing recent job application data
    - This is mock data for demonstration - in a real app, this would come from a database
    - Each job object contains all the information needed to display in the table
    - Properties explained:
      * id: unique identifier for each job application
      * title: the job position name
      * company: name of the company
      * status: current stage of the application process
      * appliedDate: when the application was submitted (YYYY-MM-DD format)
      * matchScore: percentage of how well your skills match the job (0-100)
      * salary: the salary range offered for the position
  */}
  const [recentJobs] = useState([
    {
      // Unique identifier for database lookups and React keys
      id: 1,
      // Job position title as listed in the job posting
      title: 'Senior Frontend Developer',
      // Company name where you applied
      company: 'TechCorp Inc.',
      // Current status of your application (drives the colored status badge)
      status: 'Second Interview',
      // Date when you submitted the application
      appliedDate: '2024-01-20',
      // Algorithm-calculated match between your skills and job requirements
      matchScore: 85,
      // Salary range as specified in the job posting
      salary: '$120k - $150k'
    },
    {
      id: 2,
      title: 'React Developer',
      company: 'StartupXYZ',
      // Different status to show variety in the interface
      status: 'Pending',
      appliedDate: '2024-01-18',
      // Higher match score indicates better skill alignment
      matchScore: 92,
      salary: '$100k - $130k'
    },
    {
      id: 3,
      title: 'Full Stack Engineer',
      company: 'BigTech Solutions',
      status: 'First Interview',
      appliedDate: '2024-01-15',
      matchScore: 78,
      salary: '$130k - $160k'
    },
    {
      id: 4,
      title: 'UI/UX Developer',
      company: 'DesignHub',
      // Rejected status to demonstrate different styling
      status: 'Rejected',
      appliedDate: '2024-01-12',
      // Lower match score indicates less ideal fit
      matchScore: 65,
      salary: '$90k - $110k'
    },
    {
      id: 5,
      title: 'Backend Engineer',
      company: 'DataCorp',
      status: 'Third Interview',
      appliedDate: '2024-01-10',
      matchScore: 88,
      salary: '$140k - $170k'
    }
  ])

  // 🎨 LEARNING: Status Color Function - Returns different colors based on job application status
  // This function takes a status string and returns Tailwind CSS classes for styling
  // 🔄 EFFECT: Change 'bg-emerald-100' to 'bg-blue-100' to see different colors
  const getStatusColor = (status) => {
    // 🔄 LEARNING: Switch Statement - Like multiple if/else statements
    // Compares 'status' parameter with each case and returns matching CSS classes
    switch (status) {
      
      // 🟢 LEARNING: Interview Status Colors - Progressive green shades for interview stages
      case 'First Interview': 
        return 'bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-600'
        // 🎨 BREAKDOWN: bg-emerald-100 (light green background) + dark:bg-emerald-800 (dark mode: dark green)
        // 📝 text-emerald-800 (dark green text) + dark:text-emerald-200 (dark mode: light green text)
        // 🔲 border border-emerald-200 (light green border) + dark:border-emerald-600 (dark mode border)
        
      case 'Second Interview': 
        return 'bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-600'
        // 🎨 Teal = blue-green color, shows progression from first interview
        
      case 'Third Interview': 
        return 'bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-600'
        // 🎨 Cyan = lighter blue-green, closer to final stages
        
      case 'Final Interview': 
        return 'bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-600'
        // 🎨 Indigo = purple-blue, indicates final stage before decision
        
      // 🟡 LEARNING: Waiting Status Colors - Amber/yellow for pending states
      case 'Pending': 
        return 'bg-amber-100 dark:bg-blue-800 text-amber-800 dark:text-blue-200 border border-amber-200 dark:border-blue-600'
        // 🎨 Amber (yellow-orange) in light mode, blue in dark mode for better contrast
        
      case 'Applied': 
        return 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-600'
        // 🎨 Blue indicates initial application submitted
        
      // 🔴 LEARNING: Negative Status Colors - Red for rejection
      case 'Rejected': 
        return 'bg-rose-100 dark:bg-rose-800 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-600'
        // 🎨 Rose (red-pink) clearly indicates rejection
        
      // 🟣 LEARNING: Positive Status Colors - Purple for offers
      case 'Offer': 
        return 'bg-violet-100 dark:bg-violet-800 text-violet-800 dark:text-violet-200 border border-violet-200 dark:border-violet-600'
        // 🎨 Violet (purple) indicates success - job offer received
        
      // 🔘 LEARNING: Default Case - Fallback for unknown statuses
      default: 
        return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
        // 🎨 Gray/slate for any status not defined above
    }
  }

  // Main component return statement - Everything inside return() becomes the actual HTML that users see
  return (
    // Main container with full screen height - min-h-screen ensures the content takes at least the full height of the browser window
    <div className="min-h-screen">
      {/* Content wrapper with responsive width and padding */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Dashboard Header Section */}
        <div className="text-center mb-12">
          {/* Main Dashboard Title with gradient text */}
          <h1 className="text-5xl font-light bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800 dark:from-slate-300 dark:via-gray-300 dark:to-slate-200 bg-clip-text text-transparent mb-6">
            Dashboard
          </h1>
          {/* Decorative underline element */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-slate-400 to-gray-500 dark:from-slate-500 dark:to-gray-400 mx-auto rounded-full"></div>
          {/* Subtitle/welcome text */}
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg font-light">Welcome back! Here's your job search overview</p>
        </div>

        {/* Statistics Cards Section */}
        <div className="flex justify-center items-center mb-12">
          {/* Statistics Cards Grid */}
          <div className="grid grid-cols-4 gap-4 w-fit">
            
            {/* Total Applications Card */}
            <div className="bg-gradient-to-br from-white via-slate-50 to-gray-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-4 text-center border border-slate-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm w-28">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total</div>
              </div>
              <div className="text-2xl font-light text-slate-700 dark:text-slate-300 mt-2">{stats.totalApplications}</div>
            </div>
            
            <div className="bg-gradient-to-br from-white via-amber-50 to-yellow-100 dark:from-gray-800 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-4 text-center border border-amber-200 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm w-28">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-amber-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="text-xs text-amber-700 dark:text-blue-400 font-medium">Pending</div>
              </div>
              <div className="text-2xl font-light text-amber-800 dark:text-blue-300 mt-2">{stats.pending}</div>
            </div>
            
            <div className="bg-gradient-to-br from-white via-emerald-50 to-green-100 dark:from-gray-800 dark:via-emerald-900/20 dark:to-green-900/20 rounded-xl shadow-lg p-4 text-center border border-emerald-200 dark:border-emerald-800/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm w-28">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Interviews</div>
              </div>
              <div className="text-2xl font-light text-emerald-800 dark:text-emerald-300 mt-2">{stats.interviews}</div>
            </div>
            
            <div className="bg-gradient-to-br from-white via-rose-50 to-red-100 dark:from-gray-800 dark:via-rose-900/20 dark:to-red-900/20 rounded-xl shadow-lg p-4 text-center border border-rose-200 dark:border-rose-800/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm w-28">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/40 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-rose-600 dark:text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="text-xs text-rose-700 dark:text-rose-400 font-medium">Rejected</div>
              </div>
              <div className="text-2xl font-light text-rose-800 dark:text-rose-300 mt-2">{stats.rejected}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border-2 border-slate-300 dark:border-gray-600 backdrop-blur-sm w-fit">
            <h2 className="text-3xl font-light text-slate-700 dark:text-slate-300 mb-8 text-center">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-6">
              <button 
                onClick={() => navigate('/resumes')}
                className="bg-gradient-to-br from-white to-slate-50 dark:from-gray-700 dark:to-gray-800 hover:from-slate-100 hover:to-slate-150 dark:hover:from-gray-600 dark:hover:to-gray-700 text-slate-700 dark:text-slate-300 font-medium py-8 px-8 rounded-xl transition-all duration-300 flex flex-col items-center justify-center space-y-3 min-h-[140px] shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-slate-300 dark:border-gray-600 hover:border-slate-400 dark:hover:border-gray-500 w-64"
              >
                <div className="w-12 h-12 bg-slate-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="text-lg font-medium">Upload Resume</span>
              </button>
              
              <button 
                onClick={() => navigate('/jobs')}
                className="bg-gradient-to-br from-white to-emerald-50 dark:from-gray-700 dark:to-emerald-900/20 hover:from-emerald-100 hover:to-emerald-150 dark:hover:from-gray-600 dark:hover:to-emerald-900/30 text-slate-700 dark:text-slate-300 font-medium py-8 px-8 rounded-xl transition-all duration-300 flex flex-col items-center justify-center space-y-3 min-h-[140px] shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-emerald-300 dark:border-emerald-800/50 hover:border-emerald-400 dark:hover:border-emerald-700 w-64"
              >
                <div className="w-12 h-12 bg-emerald-200 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-700 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="text-lg font-medium">Add Job Application</span>
              </button>
              
              <button 
                onClick={() => navigate('/jobs')}
                className="bg-gradient-to-br from-white to-violet-50 dark:from-gray-700 dark:to-violet-900/20 hover:from-violet-100 hover:to-violet-150 dark:hover:from-gray-600 dark:hover:to-violet-900/30 text-slate-700 dark:text-slate-300 font-medium py-8 px-8 rounded-xl transition-all duration-300 flex flex-col items-center justify-center space-y-3 min-h-[140px] shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-violet-300 dark:border-violet-800/50 hover:border-violet-400 dark:hover:border-violet-700 w-64"
              >
                <div className="w-12 h-12 bg-violet-200 dark:bg-violet-900/40 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-violet-700 dark:text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                </div>
                <span className="text-lg font-medium">View Analytics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Job Applications - Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-300 dark:border-gray-600">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b-2 border-slate-300 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-light text-slate-700 dark:text-slate-300 mb-1">Recent Applications</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-light">Quick overview of your latest job applications</p>
              </div>
              <button 
                onClick={() => navigate('/jobs')}
                className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-md text-sm"
              >
                View All
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto bg-white dark:bg-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-gray-700 border-b-2 border-slate-300 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
                      </svg>
                      <span>Position</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"></path>
                      </svg>
                      <span>Company</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                      </svg>
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd"></path>
                      </svg>
                      <span>Match</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                      </svg>
                      <span>Quick</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-slate-200 dark:divide-gray-600">
                {recentJobs.slice(0, 3).map((job, index) => (
                  <tr key={job.id} className="hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-slate-400 dark:hover:border-l-gray-500"
                      onClick={() => navigate('/jobs')}>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900 dark:text-slate-200 text-sm">{job.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{job.appliedDate}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">{job.company}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{job.salary}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-slate-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div 
                            className="bg-slate-600 dark:bg-slate-400 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${job.matchScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{job.matchScore}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/jobs');
                        }}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-md transition-all duration-200 text-xs font-medium border border-slate-200 dark:border-gray-600"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
