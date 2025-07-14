{/* 
  LEARNING COMMENT: Import statements for React features we need
  - createContext: Creates a React context for sharing data between components without passing props down manually
  - useContext: Hook to consume/read values from a React context
  - useState: Hook to manage component state (data that can change over time)
  - useEffect: Hook to perform side effects (like API calls) when component mounts
*/}
import { createContext, useContext, useState, useEffect } from 'react'

{/* 
  LEARNING COMMENT: Import authentication context to check user login status
  - useAuth: Custom hook to access user authentication state
  - Only load resumes when user is authenticated
*/}
import { useAuth } from './AuthContext'

{/* 
  LEARNING COMMENT: Import API functions for backend communication
  - These functions handle HTTP requests to our backend server
  - getResumes: fetch all user's resumes from database
  - createResume: upload new resume with file to backend
  - updateResume: modify existing resume metadata
  - deleteResume: remove resume and its file from backend
  - downloadResume: download resume file from server
*/}
import { getResumes, createResume, updateResume, deleteResume, downloadResume } from '../services/api.js'

{/* 
  LEARNING COMMENT: Create a new React context for resumes
  - This context will hold all resume data and functions to manage resumes
  - Components can access this data without prop drilling (passing props through many levels)
  - Initially undefined, will be filled with data when we provide it
*/}
const ResumesContext = createContext()

{/* 
  LEARNING COMMENT: Custom hook to use the ResumesContext
  - This is a "custom hook" - a function that starts with "use" and uses other hooks
  - It provides a safe way to access the context data
  - The error check ensures the hook is only used inside a ResumesProvider component
  - If used outside ResumesProvider, it throws an error to help developers debug
*/}
export const useResumes = () => {
  {/* Get the current context value (all the resume data and functions) */}
  const context = useContext(ResumesContext)
  
  {/* Safety check: if context is null/undefined, we're outside the provider */}
  if (!context) {
    throw new Error('useResumes must be used within a ResumesProvider')
  }
  
  {/* Return the context so components can use resume data and functions */}
  return context
}

{/* 
  LEARNING COMMENT: ResumesProvider component - provides resume data to child components
  - This is a "provider component" that wraps other components and gives them access to resume data
  - { children } means this component accepts other components as children (like <div><p>child</p></div>)
  - Any component inside this provider can use the useResumes() hook to access resume data
  - Now integrates with backend API instead of using only local state
*/}
export const ResumesProvider = ({ children }) => {
  {/* 
    LEARNING COMMENT: Authentication context integration
    - Access user authentication state to know when user is logged in
    - Only fetch resumes when user is authenticated
    - Clear resumes when user logs out
  */}
  const { user, isAuthenticated } = useAuth()

  {/* 
    LEARNING COMMENT: State for storing all resumes
    - useState hook creates a state variable 'resumes' and a function 'setResumes' to update it
    - Initial value is empty array - real data will be loaded from backend API when user is authenticated
    - Each resume object comes from the database with properties: id, name, uploadDate, fileSize, format, etc.
  */}
  const [resumes, setResumes] = useState([])

  {/* 
    LEARNING COMMENT: Loading state management
    - Tracks whether we're currently fetching data from the backend
    - Shows loading indicators to users during API calls
    - Prevents multiple simultaneous API calls
  */}
  const [loading, setLoading] = useState(false)

  {/* 
    LEARNING COMMENT: Error state management
    - Stores any error messages from failed API calls
    - Allows UI to display helpful error messages to users
    - Gets reset when new operations succeed
  */}
  const [error, setError] = useState(null)

  {/* 
    LEARNING COMMENT: Load resumes when user authentication state changes
    - useEffect runs when isAuthenticated or user changes
    - Only fetches resumes when user is authenticated
    - Clears resumes when user logs out
  */}
  useEffect(() => {
    if (isAuthenticated && user) {
      loadResumes()
    } else {
      // User is not authenticated, clear resumes
      setResumes([])
      setError(null)
    }
  }, [isAuthenticated, user])

  {/* 
    LEARNING COMMENT: Function to fetch resumes from backend
    - Makes API call to get all user's resumes
    - Handles loading states and error handling
    - Updates local state with fresh data from server
    - Only works when user is authenticated
  */}
  const loadResumes = async () => {
    // Don't load if user is not authenticated
    if (!isAuthenticated || !user) {
      setResumes([])
      setError(null)
      return
    }

    try {
      setLoading(true)              // Show loading indicator
      setError(null)                // Clear any previous errors
      const data = await getResumes()  // Fetch from backend API
      setResumes(data.resumes || data || [])    // Update local state (handle different response formats)
    } catch (err) {
      console.error('Failed to load resumes:', err)
      // Only show error if user is still authenticated
      if (isAuthenticated) {
        setError('Failed to load resumes. Please try again.')
      }
      setResumes([])                // Clear resumes on error
    } finally {
      setLoading(false)             // Hide loading indicator whether success or failure
    }
  }

  {/* 
    LEARNING COMMENT: Function to add a new resume with file upload to backend
    - Takes resumeData parameter (object with resume information and file from the upload form)
    - Makes API call to backend to upload file and store resume metadata
    - Updates local state with the new resume returned from backend
    - Handles loading states and error handling for better user experience
  */}
  const addResume = async (resumeData) => {
    try {
      setLoading(true)                           // Show loading indicator during upload
      setError(null)                             // Clear any previous errors
      
      /* 
        Make API call to create resume with file upload
        - backend handles file validation, S3 upload, and database storage
        - Returns complete resume object with file URL and metadata
      */
      const newResume = await createResume(resumeData)
      
      /* 
        Update local state with the new resume
        - Add to existing resumes array using spread operator
        - newResume contains all the data returned from backend (id, fileUrl, etc.)
      */
      setResumes(prev => [...prev, newResume])
      
      /* Return the new resume so calling component can handle success */
      return newResume
      
    } catch (err) {
      console.error('Failed to add resume:', err)
      setError('Failed to upload resume. Please try again.')
      throw err                                  // Re-throw so calling component can handle error
    } finally {
      setLoading(false)                          // Hide loading indicator
    }
  }

  {/* 
    LEARNING COMMENT: Function to update an existing resume in backend and local state
    - Takes id (which resume to update) and updatedData (what to change)
    - Makes API call to update resume metadata in backend database
    - Updates local state to reflect the changes immediately
    - Handles errors and loading states
  */}
  const updateResumeContext = async (id, updatedData) => {
    try {
      setLoading(true)
      setError(null)
      
      /* Update resume in backend database */
      const updatedResume = await updateResume(id, updatedData)
      
      /* Update local state with the new data */
      setResumes(prev => prev.map(resume => 
        resume.id === id ? { ...resume, ...updatedResume } : resume
      ))
      
      return updatedResume
      
    } catch (err) {
      console.error('Failed to update resume:', err)
      setError('Failed to update resume. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  {/* 
    LEARNING COMMENT: Function to delete a resume from backend and local state
    - Takes id parameter (which resume to remove)
    - Makes API call to delete resume file from S3 and remove from database
    - Updates local state to remove the deleted resume
    - Handles errors if deletion fails
  */}
  const deleteResumeContext = async (id) => {
    try {
      setLoading(true)
      setError(null)
      
      /* Delete resume from backend (removes file from S3 and database record) */
      await deleteResume(id)
      
      /* Remove from local state */
      setResumes(prev => prev.filter(resume => resume.id !== id))
      
    } catch (err) {
      console.error('Failed to delete resume:', err)
      setError('Failed to delete resume. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  {/* 
    LEARNING COMMENT: Function to download a resume file
    - Takes resume object with id and filename
    - Makes API call to download file from backend/S3
    - Triggers browser download of the file
    - Handles errors if download fails
  */}
  const downloadResumeContext = async (resume) => {
    try {
      setError(null)
      /* 
        Download file using the API service
        - API handles authentication and file retrieval
        - Automatically triggers browser download
      */
      await downloadResume(resume.id, resume.filename || resume.name)
      
    } catch (err) {
      console.error('Failed to download resume:', err)
      setError('Failed to download resume. Please try again.')
      throw err
    }
  }

  {/* 
    LEARNING COMMENT: Create the value object to provide to child components
    - This object contains all the data and functions that components can access
    - Includes loading and error states for better user experience
    - By putting everything in one object, components can destructure what they need
    - Example: const { resumes, addResume, loading, error } = useResumes()
  */}
  const value = {
    // The array of all resumes from backend
    resumes,
    // Loading state for API operations
    loading,
    // Error message from failed API calls
    error,
    // Function to add a new resume with file upload
    addResume,
    // Function to update an existing resume (renamed to avoid conflicts)
    updateResume: updateResumeContext,
    // Function to delete a resume (renamed to avoid conflicts)
    deleteResume: deleteResumeContext,
    // Function to download a resume file
    downloadResume: downloadResumeContext,
    // Function to reload resumes from backend
    loadResumes,
  }

  {/* 
    LEARNING COMMENT: Return the provider component
    - ResumesContext.Provider makes the value available to all child components
    - Any component nested inside this provider can use useResumes() to access the value
    - {children} renders whatever components are passed as children to this provider
    - This pattern allows us to wrap our entire app (or parts of it) with this provider
  */}
  return (
    <ResumesContext.Provider value={value}>
      {children}
    </ResumesContext.Provider>
  )
}
