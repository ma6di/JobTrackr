/* 
  LEARNING COMMENT: Import statements for Profile page functionality
  - useState: React hook for managing component state (data that can change)
  - useEffect: React hook for side effects (runs code when component mounts or data changes)
  - useAuth: Custom hook from AuthContext to access user data and logout function
  - useTheme: Custom hook from our ThemeContext to access dark mode state and toggle function
*/
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

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
    - This connects our Profile page to both authentication and theme systems
  */
  const { user: authUser, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()
  
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
    joinDate: '',       // When the user created their account
    title: '',          // User's job title/position (future feature)
    location: ''        // User's location (future feature)
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
        joinDate: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : '',
        title: authUser.title || '', // Future feature
        location: authUser.location || '' // Could be added to user model
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
                  - w-full: takes full width of container
                  - hover:scale-105: slightly enlarges on hover for interactive feedback
                  - flex items-center justify-center space-x-2: centers icon and text with spacing
                  - transition-all duration-300: smooth animation for all changes
                */}
                <button className="w-full bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-md flex items-center justify-center space-x-2">
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
                  - bg-slate-100: light gray background
                  - hover:scale-105: slightly enlarges on hover
                  - flex items-center space-x-3: icon and text side by side
                  - Uses consistent styling pattern for all action buttons
                */}
                <button className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md border-2 border-slate-300 dark:border-gray-500 hover:border-slate-400 dark:hover:border-gray-400 flex items-center space-x-3">
                  {/* Lock icon for password security */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>Change Password</span>
                </button>
                
                {/* 
                  LEARNING COMMENT: Export Data Button
                  - Download/export icon with downward arrow
                  - Same styling pattern as other action buttons
                  - Would allow users to download their data (GDPR compliance)
                */}
                <button className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md border-2 border-slate-300 dark:border-gray-500 hover:border-slate-400 dark:hover:border-gray-400 flex items-center space-x-3">
                  {/* Download/export icon */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  <span>Export Data</span>
                </button>
                
                {/* 
                  LEARNING COMMENT: Help & Support Button
                  - Information/question mark icon
                  - Provides access to help documentation or support
                  - Same styling pattern for consistency
                */}
                <button className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md border-2 border-slate-300 dark:border-gray-500 hover:border-slate-400 dark:hover:border-gray-400 flex items-center space-x-3">
                  {/* Information/help icon */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  <span>Help & Support</span>
                </button>
                
                {/* 
                  LEARNING COMMENT: Logout Button
                  - Different styling to indicate destructive action
                  - bg-rose-100: light red background (rose color family)
                  - border-rose-300: red border to match theme
                  - onClick={handleLogout}: calls our logout function
                  - Logout/exit icon with arrow pointing to door
                */}
                <button 
                  onClick={handleLogout}
                  className="bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 font-medium py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md border-2 border-rose-300 dark:border-rose-700/50 hover:border-rose-400 dark:hover:border-rose-600 flex items-center space-x-3"
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
