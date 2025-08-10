/* 
  LEARNING COMMENT: Import statements for Login component functionality
  - useState: React hook for managing form input state (email and password)
  - useNavigate: React Router hook for programmatic navigation after login
  - Link: React Router component for client-side navigation without page refreshes
  - useAuth: Custom hook to access authentication context (login function, loading state, etc.)
  - This component creates a login interface integrated with backend authentication
*/
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/* 
  LEARNING COMMENT: Login Component - User authentication interface
  - This functional component creates a login form for user authentication
  - Features email/password form, validation, and navigation links
  - Integrated with backend API for real authentication
  - Uses controlled components for form inputs and includes error handling
  - Redirects to dashboard after successful login
*/
function Login() {
  /* 
    LEARNING COMMENT: Authentication context integration
    - useAuth() gives us access to the login function and loading/error states
    - login: function to authenticate user (handles API call and state management)
    - loading: boolean to show spinner during authentication
    - error: string to display authentication error messages
    - This connects our Login page to the global authentication system
  */
  const { login, loading, error: authError, clearError } = useAuth()

  /* 
    LEARNING COMMENT: Form data state management
    - useState hook manages form input values in a single object
    - Initial state contains empty strings for email and password
    - This pattern keeps related form data organized together
    - Controlled components: React state controls input values, not DOM
  */
  const [formData, setFormData] = useState({
    email: '',     // User's email address for login
    password: ''   // User's password for authentication
  })

  /* 
    LEARNING COMMENT: Local error state for form validation
    - Separate from authError which comes from the authentication context
    - Used for client-side validation errors (empty fields, format errors)
  */
  const [localError, setLocalError] = useState('')

  /* 
    LEARNING COMMENT: Clear errors when component mounts
    - Prevents error messages from persisting when navigating between pages
    - Ensures clean state when user visits login page
  */
  useEffect(() => {
    // Only clear errors on initial mount, not on every render
    clearError()
    setLocalError('')
  }, []) // Empty dependency array = only run once on mount

  /* 
    LEARNING COMMENT: Async form submission handler
    - Handles login form submission when user clicks "Sign In"
    - e.preventDefault(): Prevents default browser form submission (page refresh)
    - Uses login function from AuthContext which handles API call and navigation
    - AuthContext will redirect to dashboard on successful login
  */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      setLocalError('Please enter both email and password')
      return
    }

    // Clear previous errors only when we're about to make a new attempt
    clearError()

    try {
      // Call login function from AuthContext
      // This handles the API call, state updates, and navigation
      await login(formData.email, formData.password)
      // No need to redirect here - AuthContext handles navigation
      
    } catch (err) {
      console.error('Login failed:', err)
      // Don't set localError here - let AuthContext handle the error message
      // The authError will be displayed instead
    }
  }

  /* 
    LEARNING COMMENT: Input focus handler
    - Only clears errors when user starts typing, not just focusing
    - Provides better UX by keeping errors visible until user takes action
  */
  const handleInputFocus = () => {
    // Don't clear errors on focus, only when user starts typing
    // This way errors remain visible until user actively tries to fix them
  }

  const handleChange = (e) => {
    // Clear errors when user starts typing (not just focusing)
    if (localError) setLocalError('')
    if (authError) clearError()
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    /* 
      LEARNING COMMENT: Main login page container
      - max-w-md: Maximum width of 28rem (448px) for optimal form reading width
      - mx-auto: Centers container horizontally with auto left/right margins
      - px-4: 1rem horizontal padding for mobile spacing
      - py-16: 4rem vertical padding for comfortable top/bottom spacing
      - Creates a centered, narrow layout perfect for login forms
    */
    <div className="max-w-md mx-auto px-4 py-16">
      {/* 
        LEARNING COMMENT: Welcome section
        - Introduces the application and provides context for login
        - text-center: Centers all text content horizontally
        - mb-8: 2rem bottom margin for separation from login form
        - Creates welcoming first impression for users
      */}
      <div className="text-center mb-8">
        {/* 
          LEARNING COMMENT: Main application title
          - h1: Semantic HTML for main page heading (important for SEO and accessibility)
          - text-4xl: Large text size (2.25rem/36px) for prominent branding
          - font-bold: Bold font weight (700) for strong visual impact
          - text-gray-800: Dark gray color for high readability
          - mb-4: 1rem bottom margin for spacing from subtitle
          - Establishes brand identity and application name
        */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to JobTrackr</h1>
        
        {/* 
          LEARNING COMMENT: Application description/subtitle
          - text-xl: Large text size (1.25rem/20px) for secondary heading
          - text-gray-600: Medium gray for less emphasis than main title
          - mb-8: 2rem bottom margin for separation from login form
          - Explains the application's purpose and value proposition
        */}
        <p className="text-xl text-gray-600 mb-8">Track your job applications and manage your career journey</p>
      </div>

      {/* 
        LEARNING COMMENT: Login form container
        - bg-white: White background for form section
        - rounded-lg: Large border radius (0.5rem/8px) for modern appearance
        - shadow-lg: Large shadow for depth and visual separation
        - p-8: 2rem padding on all sides for comfortable form spacing
        - Creates a card-like appearance that focuses attention on the form
      */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* 
          LEARNING COMMENT: Login form title
          - h2: Semantic HTML for section heading
          - text-2xl: Large text size (1.5rem/24px) for section importance
          - font-bold: Bold font weight for emphasis
          - text-gray-800: Dark gray for high readability
          - mb-6: 1.5rem bottom margin for separation from form fields
          - text-center: Centers heading above form
        */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>
        
        {/* 
          LEARNING COMMENT: Error display section
          - Shows authentication errors from backend or local validation errors
          - Only displays when there's an error to show
          - Red styling to indicate error state
        */}
        {(localError || authError) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {localError || authError}
          </div>
        )}
        
        {/* 
          LEARNING COMMENT: Login form element
          - onSubmit={handleSubmit}: Calls handleSubmit when form is submitted
          - space-y-6: 1.5rem vertical spacing between form children
          - Form submission triggers on Enter key or submit button click
          - Semantic HTML form element for proper accessibility
        */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 
            LEARNING COMMENT: Email field section
            - Contains label and input for email address
            - Standard form field pattern used throughout application
          */}
          <div>
            {/* 
              LEARNING COMMENT: Email field label
              - htmlFor="email": Associates label with input for accessibility (screen readers)
              - block: Display as block element for full width
              - text-sm: Small text size (0.875rem/14px) for form labels
              - font-medium: Medium font weight (500) for subtle emphasis
              - text-gray-700: Dark gray for good readability
              - mb-2: 0.5rem bottom margin for spacing from input
              - Semantic labeling improves form accessibility
            */}
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            
            {/* 
              LEARNING COMMENT: Email input field
              - type="email": HTML5 email validation and mobile keyboard optimization
              - id="email": Matches htmlFor in label for accessibility
              - name="email": Maps to formData.email property for handleChange
              - value={formData.email}: Controlled component (React manages value)
              - onChange={handleChange}: Updates state when user types
              - w-full: Full width of parent container
              - px-3 py-2: 0.75rem horizontal, 0.5rem vertical padding
              - border border-gray-300: 1px light gray border
              - rounded-lg: Large border radius (0.5rem/8px)
              - focus:outline-none: Remove default browser focus outline
              - focus:ring-2 focus:ring-blue-500: Custom blue focus ring (2px)
              - focus:border-transparent: Hide border when focused (ring shows instead)
              - placeholder: Helpful text shown when field is empty
              - required: HTML5 validation (must be filled to submit)
            */}
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={handleInputFocus}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* 
            LEARNING COMMENT: Password field section
            - Similar structure to email field for consistency
            - Uses password input type for security
          */}
          <div>
            {/* 
              LEARNING COMMENT: Password field label
              - htmlFor="password": Associates with password input
              - Same styling as email label for form consistency
            */}
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            
            {/* 
              LEARNING COMMENT: Password input field
              - type="password": Hides input text for security (shows dots/asterisks)
              - id="password": Matches htmlFor in label
              - name="password": Maps to formData.password for state management
              - Same styling and behavior as email input for consistency
              - Browser may offer to save/autofill password
            */}
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={handleInputFocus}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* 
            LEARNING COMMENT: Submit button with loading state
            - type="submit": Triggers form submission and handleSubmit function
            - disabled when loading to prevent multiple submissions
            - Shows loading spinner when authentication is in progress
            - Button text changes based on loading state
          */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* 
          LEARNING COMMENT: Forgot password link section
          - mt-4: 1rem top margin for separation from form
          - text-center: Centers content horizontally
          - Provides password recovery option for users
        */}
        <div className="mt-4 text-center">
          <Link 
            to="/forgot-password" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Forgot your password?
          </Link>
        </div>

        {/* 
          LEARNING COMMENT: Sign up link section
          - mt-6: 1.5rem top margin for separation from forgot password link
          - text-center: Centers content horizontally
          - Provides path for users who don't have accounts
        */}
        <div className="mt-6 text-center">
          {/* 
            LEARNING COMMENT: Sign up link text and link
            - text-gray-600: Medium gray for readable secondary text
            - Link component: React Router for client-side navigation
            - to="/register": Navigation destination to Register component
            - text-blue-600 hover:text-blue-800: Blue link color with darker hover
            - font-medium: Medium font weight for link emphasis
          */}
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up here
            </Link>
          </p>
        </div>

        {/* 
          LEARNING COMMENT: Demo mode link section
          - mt-4: 1rem top margin for spacing from sign up link
          - text-center: Centers demo link
          - Provides skip option for demonstration purposes
        */}
        <div className="mt-4 text-center">
          {/* 
            LEARNING COMMENT: Demo mode skip link
            - Link to="/dashboard": Direct navigation to main app (bypasses authentication)
            - text-sm: Small text size for less prominent secondary option
            - text-gray-500 hover:text-gray-700: Light gray with darker hover
            - Useful for demos, testing, or when authentication isn't fully implemented
          */}
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            Skip for now (Demo Mode)
          </Link>
        </div>
      </div>
    </div>
  )
}

/* 
  LEARNING COMMENT: Component export
  - export default Login: Makes component available for import in other files
  - Default export allows importing with any name: import LoginPage from './Login'
  - This component would be used in App.jsx routing for the login route
  - Typically rendered when user navigates to "/login" or needs authentication
*/
export default Login
