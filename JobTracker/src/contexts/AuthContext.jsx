/* 
  LEARNING COMMENT: Authentication Context for JobTracker
  =====================================================
  
  This context manages user authentication state globally:
  - User login/logout state
  - JWT token management
  - User profile data
  - Authentication status checking
  - Auto-login on app refresh (if valid token exists)
  
  Why we need this:
  - Shares authentication state across all components
  - Prevents prop drilling (passing auth data through many components)
  - Centralizes authentication logic
  - Provides consistent auth experience throughout app
*/

import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  login as apiLogin, 
  register as apiRegister, 
  logout as apiLogout,
  getCurrentUser,
  isAuthenticated,
  getToken,
  removeToken 
} from '../services/api.js'

/* 
  LEARNING COMMENT: Create Authentication Context
  - This creates a "data container" that can be accessed by any component
  - Initially undefined, will be populated by AuthProvider
*/
const AuthContext = createContext()

/* 
  LEARNING COMMENT: Custom hook to use authentication context
  - Provides easy access to auth state and functions
  - Includes error checking to ensure proper usage
  - Returns all authentication-related data and functions
*/
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/* 
  LEARNING COMMENT: Authentication Provider Component
  - Wraps the entire app to provide authentication state
  - Manages user data, loading states, and authentication functions
  - Handles automatic login on app refresh if valid token exists
*/
export const AuthProvider = ({ children }) => {
  /* 
    LEARNING COMMENT: Authentication state management
    - user: Current user profile data (null if not logged in)
    - loading: Boolean for showing loading spinners during auth operations
    - error: Error messages for failed auth attempts
  */
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Start with loading=true for initial auth check
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()

  /* 
    LEARNING COMMENT: Check authentication status on app load
    - Runs once when the app starts
    - Checks if user has a valid token in localStorage
    - If valid token exists, fetches current user data
    - Sets loading to false once check is complete
  */
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (isAuthenticated()) {
          // Token exists, verify it's still valid by fetching user data
          const userData = await getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        // Token is invalid, remove it
        removeToken()
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  /* 
    LEARNING COMMENT: Login function
    - Handles user login with email and password
    - Updates user state on successful login
    - Redirects to dashboard after successful login
    - Shows error message on failed login
  */
  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiLogin(email, password)
      setUser(response.user)
      
      // Redirect to dashboard after successful login
      navigate('/dashboard')
      
      return response
    } catch (err) {
      console.error('Login failed:', err)
      setError(err.message || 'Login failed. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /* 
    LEARNING COMMENT: Register function
    - Handles new user registration
    - Automatically logs in user after successful registration
    - Redirects to dashboard after successful registration
    - Shows error message on failed registration
  */
  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiRegister(userData)
      setUser(response.user)
      
      // Redirect to dashboard after successful registration
      navigate('/dashboard')
      
      return response
    } catch (err) {
      console.error('Registration failed:', err)
      setError(err.message || 'Registration failed. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /* 
    LEARNING COMMENT: Logout function
    - Clears user data and authentication token
    - Redirects to login page
    - Calls backend logout endpoint (optional)
  */
  const logout = async () => {
    try {
      setLoading(true)
      
      // Call backend logout (optional - JWT tokens are stateless)
      await apiLogout()
      
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with logout even if backend call fails
    } finally {
      // Clear local state regardless of backend response
      setUser(null)
      removeToken()
      setLoading(false)
      
      // Redirect to login page
      navigate('/login')
    }
  }

  /* 
    LEARNING COMMENT: Update user profile function
    - Updates user data in state after profile changes
    - Used after successful profile updates
  */
  const updateUser = (userData) => {
    setUser(userData)
  }

  /* 
    LEARNING COMMENT: Clear error function
    - Allows components to clear error messages
    - Useful for dismissing error notifications
  */
  const clearError = () => {
    setError(null)
  }

  /* 
    LEARNING COMMENT: Authentication context value
    - All the data and functions that components can access
    - Includes user data, loading states, and authentication functions
    - This is what gets passed to all child components
  */
  const value = {
    // State
    user,
    loading,
    error,
    isAuthenticated: !!user, // Boolean: true if user exists, false otherwise
    
    // Functions
    login,
    register,
    logout,
    updateUser,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/* 
  LEARNING COMMENT: Export default AuthProvider
  - Makes this component available for import
  - Will be used in App.jsx to wrap the entire application
*/
export default AuthProvider
