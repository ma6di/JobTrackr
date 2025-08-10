/* 
  LEARNING COMMENT: Import statements for Profile page functionality
  - useState: React hook for managing component state (data that can change)
  - useEffect: React hook for side effects (runs code when component mounts or data changes)
  - useAuth: Custom hook from AuthContext to access user data and logout function
  - useTheme: Custom hook from our ThemeContext to access dark mode state and toggle function
  - useJobs: Custom hook to access jobs data for export functionality
  - changePassword: API function to change user password
*/
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useJobs } from '../contexts/JobsContext'
import { changePassword, updateProfile } from '../services/api'
import * as XLSX from 'xlsx'

/* 
  LEARNING COMMENT: Profile Component - User profile and settings page
  - This is a functional React component that shows user information and settings
  - Includes user avatar, contact info, and theme toggle functionality
  - Demonstrates how to integrate with our custom context providers
*/
function Profile() {
  /* 
    LEARNING COMMENT: Authentication and theme context integration
    - useAuth() gives us access to user data and logout function
    - useTheme() gives us access to the current dark mode state and toggle function
    - useJobs() gives us access to jobs data for export functionality
    - This connects our Profile page to authentication, theme, and jobs systems
  */
  const { user: authUser, logout, updateUser } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { jobs } = useJobs()
  
  /* 
    LEARNING COMMENT: Modal and editing state management
    - showEditModal: controls whether the edit profile modal is visible
    - showChangePasswordModal: controls whether the change password modal is visible
    - showHelpModal: controls whether the help & support modal is visible
    - showAboutModal: controls whether the about modal is visible
    - showExportDropdown: controls whether the export format dropdown is visible
    - These states control which modals are displayed to the user
  */
  const [showEditModal, setShowEditModal] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  
  /* 
    LEARNING COMMENT: Password change form state
    - Manages the form data for changing user password
    - currentPassword: user's existing password for verification
    - newPassword: the new password user wants to set
    - confirmPassword: confirmation of new password to prevent typos
  */
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  /* 
    LEARNING COMMENT: Edit profile form state
    - Manages the form data for editing user profile
    - Will be populated with current user data when edit modal opens
    - Allows user to update their personal information
  */
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  
  /* 
    LEARNING COMMENT: User display data state
    - Derived from authenticated user data
    - Formats the data for display purposes
    - Provides fallback values if data is missing
  */
  const [user, setUser] = useState({
    name: '',           // User's display name (will be set from authUser)
    email: '',          // User's email address (will be set from authUser)
    avatar: null,       // Profile picture (null = use default icon)
    joinDate: ''        // When the user created their account
  })

  /* 
    LEARNING COMMENT: Settings state management
    - Manages user preferences and settings
    - Initially synced with the current theme context state
    - Could be expanded to include other settings like notifications, language, etc.
  */
  const [settings, setSettings] = useState({
    darkMode: isDarkMode                 // Sync with current theme state
  })

  /* 
    LEARNING COMMENT: useEffect for setting user data from auth context
    - Runs when the component mounts and when authUser changes
    - Updates local user state with data from authenticated user
    - Provides fallback values for optional fields
  */
  useEffect(() => {
    if (authUser) {
      setUser({
        name: `${authUser.firstName} ${authUser.lastName}`,
        email: authUser.email,
        avatar: authUser.profilePicture || null,
        joinDate: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : ''
      })
    }
  }, [authUser])

  /* 
    LEARNING COMMENT: useEffect for syncing settings with theme context
    - useEffect runs when the component mounts and when isDarkMode changes
    - This keeps our local settings state in sync with the global theme state
    - Dependencies array [isDarkMode] means this only runs when isDarkMode changes
    - Ensures UI settings display matches the actual theme state
  */
  useEffect(() => {
    setSettings(prev => ({
      ...prev,                          // Keep all existing settings
      darkMode: isDarkMode              // Update darkMode to match global state
    }))
  }, [isDarkMode])                      // Dependency: re-run when isDarkMode changes

  /* 
    LEARNING COMMENT: Logout handler function
    - Function that handles user logout functionality
    - Uses logout function from AuthContext
    - This will clear authentication tokens, user data, and redirect to login
  */
  const handleLogout = async () => {
    try {
      await logout()
      // AuthContext handles clearing tokens and redirecting to login
    } catch (error) {
      console.error('Logout failed:', error)
      // AuthContext should handle this, but log just in case
    }
  }

  /* 
    LEARNING COMMENT: Settings change handler
    - Handles when user toggles settings in the UI
    - Currently only handles dark mode toggle
    - Could be expanded to handle other settings like notifications, language, etc.
    - Calls the appropriate action based on which setting was changed
  */
  const handleSettingChange = (setting) => {
    if (setting === 'darkMode') {
      toggleDarkMode()                   // Call global theme toggle function
    }
  }

  /* 
    LEARNING COMMENT: Profile update handler
    - Handles form submission for profile updates
    - e.preventDefault() stops the form from refreshing the page
    - Currently just logs to console - in a real app would:
      * Validate form data
      * Make API call to update user profile
      * Show success/error messages
      * Update local state with new data
  */
  const handleProfileUpdate = (e) => {
    e.preventDefault()
    console.log('Updating profile...')
    // Add profile update logic here
  }

  /* 
    LEARNING COMMENT: Enhanced data export functionality
    - Supports two export formats: Excel and JSON
    - Excel: Spreadsheet format for data analysis
    - JSON: Technical format for backup/import
    - Includes jobs data, user info, and export metadata
    - Provides data portability for users (GDPR compliance)
  */
  const handleExportExcel = () => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new()
      
      // User info sheet
      const userInfo = [
        ['Field', 'Value'],
        ['Name', user.name],
        ['Email', user.email],
        ['Join Date', user.joinDate || 'N/A'],
        ['Export Date', new Date().toLocaleDateString()],
        ['Total Jobs', jobs?.length || 0]
      ]
      const userSheet = XLSX.utils.aoa_to_sheet(userInfo)
      XLSX.utils.book_append_sheet(wb, userSheet, 'User Info')
      
      // Jobs sheet
      if (jobs && jobs.length > 0) {
        const jobsData = jobs.map(job => ({
          Company: job.company || '',
          Position: job.position || '',
          Location: job.location || '',
          'Job Type': job.jobType || '',
          'Experience Level': job.experienceLevel || '',
          Remote: job.remote || '',
          Salary: job.salary || '',
          Status: job.status || '',
          Priority: job.priority || '',
          'Applied Date': job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : '',
          'Interview Date': job.interviewDate ? new Date(job.interviewDate).toLocaleDateString() : '',
          'Follow Up Date': job.followUpDate ? new Date(job.followUpDate).toLocaleDateString() : '',
          Notes: job.notes || '',
          'Application URL': job.applicationUrl || '',
          'Created Date': job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ''
        }))
        
        const jobsSheet = XLSX.utils.json_to_sheet(jobsData)
        XLSX.utils.book_append_sheet(wb, jobsSheet, 'Jobs')
      }
      
      // Save file
      XLSX.writeFile(wb, `jobtracker-data-${new Date().toISOString().split('T')[0]}.xlsx`)
      alert('Excel file exported successfully!')
    } catch (error) {
      console.error('Error exporting Excel:', error)
      alert('Error creating Excel export. Please try again.')
    }
  }

  const handleExportJSON = () => {
    try {
      const exportData = {
        user: {
          name: user.name,
          email: user.email,
          joinDate: user.joinDate
        },
        jobs: jobs || [],
        exportDate: new Date().toISOString(),
        version: '1.0'
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `jobtracker-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      alert('JSON data exported successfully!')
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  /* 
    LEARNING COMMENT: Change password handler
    - Validates password form data
    - Checks if new passwords match
    - Validates password strength requirements (8+ chars, uppercase, lowercase, number, special char)
    - Makes API call to update password in the database
    - Provides user feedback on success/failure
  */
  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    
    // Frontend validation to match backend requirements
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!')
      return
    }
    
    if (!/[A-Z]/.test(passwordForm.newPassword)) {
      alert('Password must contain at least one uppercase letter!')
      return
    }
    
    if (!/[a-z]/.test(passwordForm.newPassword)) {
      alert('Password must contain at least one lowercase letter!')
      return
    }
    
    if (!/\d/.test(passwordForm.newPassword)) {
      alert('Password must contain at least one number!')
      return
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword)) {
      alert('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)!')
      return
    }
    
    try {
      // Make API call to change password
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      
      alert('Password changed successfully!')
      setShowChangePasswordModal(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Password change failed:', error)
      
      // Show specific error message from backend
      const errorMessage = error.message || 'Failed to change password. Please try again.'
      alert(errorMessage)
    }
  }

  /* 
    LEARNING COMMENT: Edit profile handler
    - Validates form data and makes API call to update profile
    - Updates local user state with new data
    - Provides user feedback on success/failure
    - Closes modal and refreshes user data
  */
  const handleEditProfile = async (e) => {
    e.preventDefault()
    
    try {
      // Validate form data
      if (!editForm.firstName.trim() || editForm.firstName.trim().length < 2) {
        alert('First name must be at least 2 characters long')
        return
      }
      
      if (!editForm.lastName.trim() || editForm.lastName.trim().length < 2) {
        alert('Last name must be at least 2 characters long')
        return
      }
      
      if (!editForm.email.trim() || !editForm.email.includes('@')) {
        alert('Please enter a valid email address')
        return
      }

      // Make API call to update profile
      const updatedUser = await updateProfile({
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        email: editForm.email.trim()
      })

      // Update auth context with new user data
      updateUser(updatedUser)

      // Update local user state with new data
      setUser(prev => ({
        ...prev,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        email: updatedUser.email
      }))

      alert('Profile updated successfully!')
      setShowEditModal(false)
    } catch (error) {
      console.error('Profile update failed:', error)
      alert(error.message || 'Failed to update profile. Please try again.')
    }
  }

  /* 
    LEARNING COMMENT: Open edit modal handler
    - Populates edit form with current user data
    - Opens the edit profile modal
    - Ensures form has current values when user starts editing
  */
  const openEditModal = () => {
    setEditForm({
      firstName: authUser?.firstName || '',
      lastName: authUser?.lastName || '',
      email: authUser?.email || ''
    })
    setShowEditModal(true)
  }

  /* 
    LEARNING COMMENT: useEffect for click outside handler
    - Closes the export dropdown when user clicks anywhere outside of it
    - Improves user experience by providing intuitive dropdown behavior
  */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportDropdown && !event.target.closest('.export-dropdown')) {
        setShowExportDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showExportDropdown])

  /* 
    LEARNING COMMENT: Main component return - the profile page layout
    - return() contains all the JSX that creates the visual profile page
    - Uses a responsive grid layout for different screen sizes
    - Combines user info display with interactive settings controls
  */
  return (
    // Main container with full screen height
    <div className="min-h-screen">
      {/* Content wrapper with responsive width and padding */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Page Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            {/* Main page title with large text and theme-aware colors */}
            <h1 className="text-4xl font-light text-slate-700 dark:text-slate-300 mb-2">Profile & Settings</h1>
            {/* Subtitle with lighter text color */}
            <p className="text-slate-600 dark:text-slate-400 text-lg font-light">Manage your account and preferences</p>
          </div>
        </div>

        {/* 
          LEARNING COMMENT: Responsive grid layout
          - grid-cols-1: single column on mobile/small screens
          - lg:grid-cols-3: three columns on large screens
          - gap-8: 32px space between grid items
          - This creates a responsive layout that stacks on mobile, expands on desktop
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 
            LEARNING COMMENT: Profile Card (left side on desktop)
            - lg:col-span-1: takes 1 column out of 3 on large screens
            - Contains user avatar, name, title, and contact information
            - Uses flex layout to push edit button to bottom of card
          */}
          <div className="lg:col-span-1">
            {/* Profile card container with white/dark background and border */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-2 border-slate-300 dark:border-gray-600 transition-colors duration-300 h-full flex flex-col">
              {/* 
                LEARNING COMMENT: Profile card content container
                - flex flex-col: arranges items vertically
                - items-center: centers items horizontally
                - text-center: centers all text
                - flex-grow: takes up available space (pushes button to bottom)
              */}
              <div className="flex flex-col items-center text-center flex-grow">
                
                {/* 
                  LEARNING COMMENT: User Avatar Section
                  - Circular container for user profile picture
                  - Currently shows default user icon since avatar is null
                  - bg-slate-200: light gray background in light mode
                  - dark:bg-gray-700: darker background in dark mode
                  - w-24 h-24: 96px square size
                  - rounded-full: makes it circular
                */}
                <div className="w-24 h-24 bg-slate-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 transition-colors duration-300">
                  {/* Default user icon SVG */}
                  <svg className="w-12 h-12 text-slate-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                </div>
                
                {/* 
                  LEARNING COMMENT: User Information Display
                  - Shows user name, title, and location in a hierarchy
                  - {user.name}, {user.title}, {user.location} display data from our state
                  - Different text sizes and colors create visual hierarchy
                */}
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-1">{user.name}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-2">{user.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">{user.location}</p>
                
                {/* 
                  LEARNING COMMENT: Contact Information Section
                  - Shows email and join date with icons
                  - Uses flex layout to align icons with text
                  - Icons help users quickly identify different types of information
                */}
                <div className="w-full space-y-3 mb-6">
                  {/* Email row with envelope icon */}
                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                    <svg className="w-4 h-4 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    <span>{user.email}</span>
                  </div>
                  {/* Join date row with calendar icon */}
                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                    <svg className="w-4 h-4 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                    <span>Joined {user.joinDate}</span>
                  </div>
                </div>

                {/* 
                  LEARNING COMMENT: Spacer element
                  - flex-grow: takes up all remaining vertical space
                  - This pushes the edit button to the bottom of the card
                  - Creates consistent card heights even with different content amounts
                */}
                <div className="flex-grow"></div>

                {/* 
                  LEARNING COMMENT: Edit Profile Button
                  - Full width button at bottom of profile card
                  - onClick calls openEditModal to show edit form
                  - w-full: takes full width of container
                  - hover:scale-105: slightly enlarges on hover for interactive feedback
                  - flex items-center justify-center space-x-2: centers icon and text with spacing
                  - transition-all duration-300: smooth animation for all changes
                */}
                <button 
                  onClick={openEditModal}
                  className="w-full bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-md flex items-center justify-center space-x-2"
                >
                  {/* Edit/pencil icon */}
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                  </svg>
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* 
            LEARNING COMMENT: Settings & Actions Section (right side on desktop)
            - lg:col-span-2: takes 2 columns out of 3 on large screens
            - space-y-6: adds 24px vertical spacing between child cards
            - Contains theme settings and account action buttons
          */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 
              LEARNING COMMENT: Theme Settings Card
              - Dedicated card for user preferences like dark mode
              - Uses the same styling pattern as profile card for consistency
              - Contains toggle switch for dark mode setting
            */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-2 border-slate-300 dark:border-gray-600 transition-colors duration-300">
              
              {/* 
                LEARNING COMMENT: Card header with icon and title
                - flex items-center space-x-3: horizontally aligns icon and text with spacing
                - mb-6: adds 24px bottom margin to separate from content
                - Bell icon represents notification/settings functionality
              */}
              <div className="flex items-center space-x-3 mb-6">
                {/* Theme settings icon (bell icon) */}
                <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                </svg>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Theme Settings</h3>
              </div>
              
              {/* 
                LEARNING COMMENT: Settings list container
                - space-y-4: adds 16px vertical spacing between settings items
                - Each setting gets its own row with consistent formatting
              */}
              <div className="space-y-4">
                
                {/* 
                  LEARNING COMMENT: Dynamic settings rendering
                  - Object.entries(settings): converts settings object to array of [key, value] pairs
                  - .map(): creates a UI element for each setting
                  - key={key}: React requires unique key for each list item
                  - Currently only handles darkMode, but expandable for future settings
                */}
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-gray-600 last:border-b-0">
                    
                    {/* 
                      LEARNING COMMENT: Setting information (left side)
                      - Shows setting name and description
                      - capitalize: makes first letter uppercase
                      - replace(/([A-Z])/g, ' $1').trim(): adds spaces before capital letters (camelCase → Camel Case)
                    */}
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {key === 'darkMode' && 'Switch to dark theme for better viewing'}
                      </p>
                    </div>
                    
                    {/* 
                      LEARNING COMMENT: Toggle switch button
                      - Custom toggle switch made with div and span elements
                      - onClick calls handleSettingChange with the setting name
                      - Background color changes based on isDarkMode state
                      - Inner circle (span) moves left/right with translate-x classes
                      - transition-colors and transition-transform create smooth animations
                    */}
                    <button
                      onClick={() => handleSettingChange(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isDarkMode ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-slate-400 dark:bg-gray-500'
                      }`}
                    >
                      {/* 
                        LEARNING COMMENT: Toggle switch circle
                        - White circle that slides left/right inside the toggle
                        - translate-x-6: moves 24px right when dark mode is on
                        - translate-x-1: moves 4px right when dark mode is off
                        - shadow-md adds subtle depth to the circle
                      */}
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

            {/* 
              LEARNING COMMENT: Account Actions Card
              - Second card in the settings section
              - Contains grid of action buttons for account management
              - Uses same styling pattern for consistency with theme settings card
            */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-2 border-slate-300 dark:border-gray-600 transition-colors duration-300">
              
              {/* 
                LEARNING COMMENT: Account actions header
                - Settings/gear icon represents account management functionality
                - Same layout pattern as theme settings header
              */}
              <div className="flex items-center space-x-3 mb-6">
                {/* Settings/gear icon */}
                <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
                </svg>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Account Actions</h3>
              </div>
              
              {/* 
                LEARNING COMMENT: Action buttons grid
                - grid-cols-1: single column on mobile
                - md:grid-cols-2: two columns on medium screens and up
                - gap-4: 16px spacing between buttons
                - Creates responsive layout that stacks on mobile, side-by-side on desktop
              */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 
                  LEARNING COMMENT: Change Password Button
                  - Standard action button with lock icon
                  - onClick opens change password modal
                  - bg-slate-100: light gray background
                  - hover:scale-105: slightly enlarges on hover
                  - flex items-center space-x-3: icon and text side by side
                  - Uses consistent styling pattern for all action buttons
                */}
                <button 
                  onClick={() => setShowChangePasswordModal(true)}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md border-2 border-slate-300 dark:border-gray-500 hover:border-slate-400 dark:hover:border-gray-400 flex items-center space-x-3"
                >
                  {/* Lock icon for password security */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>Change Password</span>
                </button>
                
                {/* 
                  LEARNING COMMENT: Export Data Dropdown
                  - Multiple export format options: PDF, Excel, JSON
                  - Download/export icon with downward arrow
                  - Dropdown menu for different export formats
                  - Allows users to choose their preferred format (GDPR compliance)
                */}
                <div className="relative export-dropdown">
                  <button 
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md border-2 border-slate-300 dark:border-gray-500 hover:border-slate-400 dark:hover:border-gray-400 flex items-center space-x-3"
                  >
                    {/* Download/export icon */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                    <span>Export Data</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                  
                  {showExportDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-slate-200 dark:border-gray-600 z-10">
                      <button
                        onClick={() => {
                          handleExportExcel()
                          setShowExportDropdown(false)
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300 flex items-center space-x-3 first:rounded-t-lg"
                      >
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"></path>
                        </svg>
                        <span>Export as Excel</span>
                      </button>
                      <button
                        onClick={() => {
                          handleExportJSON()
                          setShowExportDropdown(false)
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300 flex items-center space-x-3 last:rounded-b-lg"
                      >
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 002 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"></path>
                        </svg>
                        <span>Export as JSON</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {/* 
                  LEARNING COMMENT: Help & Support Button
                  - Information/question mark icon
                  - onClick opens help & support modal
                  - Provides access to help documentation or support
                  - Same styling pattern for consistency
                */}
                <button 
                  onClick={() => setShowHelpModal(true)}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md border-2 border-slate-300 dark:border-gray-500 hover:border-slate-400 dark:hover:border-gray-400 flex items-center space-x-3"
                >
                  {/* Information/help icon */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  <span>Help & Support</span>
                </button>
                
                {/* 
                  LEARNING COMMENT: About Button
                  - Information icon for app information
                  - onClick opens about modal with app info and copyright
                  - Same styling pattern for consistency
                */}
                <button 
                  onClick={() => setShowAboutModal(true)}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md border-2 border-slate-300 dark:border-gray-500 hover:border-slate-400 dark:hover:border-gray-400 flex items-center space-x-3"
                >
                  {/* Information icon */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                  </svg>
                  <span>About</span>
                </button>
                
                {/* 
                  LEARNING COMMENT: Logout Button
                  - Different styling to indicate destructive action
                  - bg-rose-100: light red background (rose color family)
                  - border-rose-300: red border to match theme
                  - onClick={handleLogout}: calls our logout function
                  - Logout/exit icon with arrow pointing to door
                  - md:col-span-2: spans both columns on medium screens for full width
                */}
                <button 
                  onClick={handleLogout}
                  className="bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md border-2 border-rose-300 dark:border-rose-700/50 hover:border-rose-400 dark:hover:border-rose-600 flex items-center space-x-3 md:col-span-2"
                >
                  {/* Logout/exit icon */}
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

      {/* 
        LEARNING COMMENT: Edit Profile Modal
        - Modal overlay that appears when user clicks "Edit Profile"
        - Contains form fields for updating user information
        - Uses backdrop blur and dark overlay for modal effect
      */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border-2 border-slate-300 dark:border-gray-600">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Edit Profile</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleEditProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-slate-200"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-slate-200"
                    required
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-gray-600 rounded-lg hover:bg-slate-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 
        LEARNING COMMENT: Change Password Modal
        - Modal for updating user password
        - Includes current password verification and new password confirmation
        - Form validation ensures passwords match and meet requirements
      */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border-2 border-slate-300 dark:border-gray-600">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Change Password</h3>
                <button 
                  onClick={() => setShowChangePasswordModal(false)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-slate-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-slate-200"
                    required
                    minLength={8}
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
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-slate-200"
                    required
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    className="flex-1 px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-gray-600 rounded-lg hover:bg-slate-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 
        LEARNING COMMENT: Help & Support Modal
        - Contains helpful information for using the app
        - FAQ section with common questions and answers
        - Contact information for additional support
      */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto border-2 border-slate-300 dark:border-gray-600">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Help & Support</h3>
                <button 
                  onClick={() => setShowHelpModal(false)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3">Frequently Asked Questions</h4>
                  
                  <div className="space-y-4">
                    <div className="border border-slate-200 dark:border-gray-600 rounded-lg p-4">
                      <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">How do I add a new job application?</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Navigate to the Jobs page and click the "Add Job" button. Fill in the company name, position, and other details, then click "Save Job".
                      </p>
                    </div>
                    
                    <div className="border border-slate-200 dark:border-gray-600 rounded-lg p-4">
                      <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">How do I export my data?</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Go to Profile → Account Actions → Export Data. Choose from Excel (spreadsheet) or JSON (technical format) to download all your job applications and profile information.
                      </p>
                    </div>
                    
                    <div className="border border-slate-200 dark:border-gray-600 rounded-lg p-4">
                      <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Can I upload my resume?</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Yes! When adding a job application, you can upload your resume in PDF, DOCX, or TXT format for easy access and reference.
                      </p>
                    </div>
                    
                    <div className="border border-slate-200 dark:border-gray-600 rounded-lg p-4">
                      <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">How do I switch between light and dark mode?</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        In your Profile page, under Theme Settings, toggle the "Dark Mode" switch to change between light and dark themes.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3">Contact Support</h4>
                  <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Need additional help? We're here to assist you!
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-700 dark:text-slate-300">
                        <strong>Email:</strong> mahdi.cheraghali@gmail.com
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <strong>GitHub:</strong> 
                        <a href="https://github.com/ma6di" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                          github.com/ma6di
                        </a>
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <strong>LinkedIn:</strong> 
                        <a href="https://www.linkedin.com/in/mahdi-cheraghali" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                          linkedin.com/in/mahdi-cheraghali
                        </a>
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <strong>Response Time:</strong> Within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
        LEARNING COMMENT: About Modal
        - Contains app information, version, copyright, and legal information
        - Credits and attribution section
        - Links to privacy policy and terms of service
      */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto border-2 border-slate-300 dark:border-gray-600">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">About JobTracker</h3>
                <button 
                  onClick={() => setShowAboutModal(false)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">JobTracker</h4>
                  <p className="text-slate-600 dark:text-slate-400">Version 1.0.0</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">About This App</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    JobTracker is a modern web-based job application management system designed to help job seekers organize, track, and analyze their job search process. Built with React and modern web technologies, it provides a comprehensive solution for managing your career journey on desktop and laptop computers.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                      📚 Personal Project - 42 Berlin
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      This project is a personal portfolio project created as a student at 42 Berlin to demonstrate knowledge and skills in modern web development, including React.js, Node.js, database design, user experience design, full-stack development, and software architecture.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Key Features</h5>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Track job applications with detailed status updates</li>
                    <li>• Upload and manage resume files</li>
                    <li>• Interactive dashboard with analytics and charts</li>
                    <li>• Dark/light theme support</li>
                    <li>• Data export for backup and portability</li>
                    <li>• Responsive design for desktop and laptop screens</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Technology Stack</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <div>• React.js</div>
                    <div>• Express.js</div>
                    <div>• Tailwind CSS</div>
                    <div>• Node.js</div>
                    <div>• PostgreSQL</div>
                    <div>• Recharts</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Copyright & License</h5>
                  <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-400">
                    <p className="mb-2">© 2025 Mahdi Cheraghali. All rights reserved.</p>
                    <p className="mb-3">
                      This is a personal portfolio project created for educational purposes at 42 Berlin. 
                      This software is provided "as is" without warranty of any kind.
                    </p>
                    <div className="space-y-1">
                      <p>
                        <strong className="text-slate-700 dark:text-slate-300">Contact:</strong> mahdi.cheraghali@gmail.com
                      </p>
                      <p>
                        <strong className="text-slate-700 dark:text-slate-300">GitHub:</strong> 
                        <a href="https://github.com/ma6di" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                          github.com/ma6di
                        </a>
                      </p>
                      <p>
                        <strong className="text-slate-700 dark:text-slate-300">LinkedIn:</strong> 
                        <a href="https://www.linkedin.com/in/mahdi-cheraghali" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                          linkedin.com/in/mahdi-cheraghali
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Credits</h5>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p>• Developed by Mahdi Cheraghali</p>
                    <p>• Student project at 42 Berlin</p>
                    <p>• Icons by Heroicons</p>
                    <p>• Charts by Recharts</p>
                    <p>• Styling by Tailwind CSS</p>
                    <p>• Built with React & Vite</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* 
  LEARNING COMMENT: Export default Profile component
  - export default: makes this component available for import in other files
  - Allows other components to import this with: import Profile from './Profile'
  - React components should always be exported so they can be used in routing and other components
*/
export default Profile
