import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { 
      path: '/dashboard', 
      name: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
        </svg>
      )
    },
    { 
      path: '/resumes', 
      name: 'Resumes', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
        </svg>
      )
    },
    { 
      path: '/jobs', 
      name: 'Jobs', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
        </svg>
      )
    },
  ]

  return (
    <nav className="bg-gradient-to-r from-white via-slate-50 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-slate-900 shadow-lg border-b border-slate-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-gray-700 dark:from-slate-500 dark:to-gray-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-800 dark:from-slate-300 dark:to-gray-200 bg-clip-text text-transparent">
              JobTrackr
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex space-x-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`w-32 h-12 px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap transform hover:scale-105 shadow-md ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-slate-600 to-gray-700 dark:from-slate-500 dark:to-gray-600 text-white font-semibold shadow-lg border border-slate-500 dark:border-slate-400'
                    : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-gray-600 font-medium'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="hidden sm:inline text-sm font-medium truncate">{item.name}</span>
              </Link>
            ))}
            
            {/* Profile Button */}
            <Link
              to="/profile"
              className={`w-32 h-12 px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap transform hover:scale-105 shadow-md ${
                location.pathname === '/profile'
                  ? 'bg-gradient-to-r from-slate-600 to-gray-700 dark:from-slate-500 dark:to-gray-600 text-white font-semibold shadow-lg border border-slate-500 dark:border-slate-400'
                  : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-gray-600 font-medium'
              }`}
            >
              <span className="flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </span>
              <span className="hidden sm:inline text-sm font-medium truncate">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation