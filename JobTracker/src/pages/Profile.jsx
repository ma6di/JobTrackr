import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

function Profile() {
  const { isDarkMode, toggleDarkMode } = useTheme()
  
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    joinDate: '2024-01-01',
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA'
  })

  const [settings, setSettings] = useState({
    darkMode: isDarkMode
  })

  // Sync settings with theme context when theme changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      darkMode: isDarkMode
    }))
  }, [isDarkMode])

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...')
    // Redirect to login or clear auth state
  }

  const handleSettingChange = (setting) => {
    if (setting === 'darkMode') {
      toggleDarkMode()
    }
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    console.log('Updating profile...')
    // Add profile update logic here
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-light text-slate-700 dark:text-slate-300 mb-2">Profile & Settings</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-light">Manage your account and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-2 border-slate-300 dark:border-gray-600 transition-colors duration-300 h-full flex flex-col">
              <div className="flex flex-col items-center text-center flex-grow">
                {/* Avatar */}
                <div className="w-24 h-24 bg-slate-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 transition-colors duration-300">
                  <svg className="w-12 h-12 text-slate-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                </div>
                
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-1">{user.name}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-2">{user.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">{user.location}</p>
                
                <div className="w-full space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                    <svg className="w-4 h-4 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                    <svg className="w-4 h-4 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                    <span>Joined {user.joinDate}</span>
                  </div>
                </div>

                {/* Spacer to push button to bottom */}
                <div className="flex-grow"></div>

                <button className="w-full bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-md flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                  </svg>
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Settings & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notification Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-2 border-slate-300 dark:border-gray-600 transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                </svg>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Theme Settings</h3>
              </div>
              
              <div className="space-y-4">
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-gray-600 last:border-b-0">
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {key === 'darkMode' && 'Switch to dark theme for better viewing'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSettingChange(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isDarkMode ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-slate-400 dark:bg-gray-500'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                          isDarkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-2 border-slate-300 dark:border-gray-600 transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
                </svg>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Account Actions</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md border-2 border-slate-300 dark:border-gray-500 hover:border-slate-400 dark:hover:border-gray-400 flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>Change Password</span>
                </button>
                
                <button className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md border-2 border-slate-300 dark:border-gray-500 hover:border-slate-400 dark:hover:border-gray-400 flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  <span>Export Data</span>
                </button>
                
                <button className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md border-2 border-slate-300 dark:border-gray-500 hover:border-slate-400 dark:hover:border-gray-400 flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  <span>Help & Support</span>
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md border-2 border-rose-300 dark:border-rose-700/50 hover:border-rose-400 dark:hover:border-rose-600 flex items-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 001-1h10.586l-2.293 2.293a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414l-4-4a1 1 0 10-1.414 1.414L15.586 2H4a1 1 0 00-1 1z" clipRule="evenodd"></path>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
