/* 
  LEARNING COMMENT: API Service Layer for JobTracker Frontend
  - This file provides a centralized way to communicate with our backend API
  - Contains functions for authentication, file uploads, and data management
  - Uses fetch() API for HTTP requests to the backend server
  - Handles authentication tokens, file uploads, and error responses
*/

/* 
  LEARNING COMMENT: Base API configuration
  - API_BASE_URL: The root URL of our backend server
  - During development, backend runs on localhost:3001
  - Frontend runs on localhost:5173 (Vite default)
  - In production, this would be your deployed backend URL
  - This makes it easy to switch between dev and prod environments
*/
const API_BASE_URL = 'http://localhost:3001/api'

/* 
  LEARNING COMMENT: Authentication token management
  - Store JWT tokens in localStorage for persistence across browser sessions
  - getToken(): retrieves the current authentication token
  - setToken(): saves a new token after login
  - removeToken(): removes token on logout
  - isAuthenticated(): checks if user has a valid token
*/
export const getToken = () => localStorage.getItem('authToken')
export const setToken = (token) => localStorage.setItem('authToken', token)
export const removeToken = () => localStorage.removeItem('authToken')
export const isAuthenticated = () => !!getToken()

/* 
  LEARNING COMMENT: Default headers for API requests
  - Sets Content-Type to JSON for most requests
  - Includes Authorization header with JWT token if user is logged in
  - These headers are used by default but can be overridden for specific requests
*/
const getDefaultHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  }
  
  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  
  return headers
}

/* 
  LEARNING COMMENT: Generic API request function
  - Handles common patterns for all API calls
  - Automatically adds authentication headers
  - Handles JSON parsing and error responses
  - Returns parsed data on success, throws errors on failure
*/
const apiRequest = async (endpoint, options = {}) => {
  /* 
    Construct full URL and prepare request options
    - endpoint: relative path like '/resumes' or '/auth/login'
    - options: HTTP method, headers, body, etc.
  */
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    method: 'GET',                    // Default to GET request
    headers: getDefaultHeaders(),     // Include auth headers
    ...options,                       // Override with custom options
  }
  
  /* 
    If custom headers are provided, merge them with defaults
    - This allows file uploads to override Content-Type header
    - Preserves Authorization header while allowing customization
  */
  if (options.headers) {
    config.headers = { ...config.headers, ...options.headers }
  }

  try {
    /* 
      Make the HTTP request using fetch()
      - fetch() is a built-in browser API for HTTP requests
      - Returns a Promise that resolves to the Response object
    */
    const response = await fetch(url, config)
    
    /* 
      Check if request was successful
      - response.ok: true for status codes 200-299
      - If not ok, throw an error with status and message
    */
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(`API Error ${response.status}: ${errorData.error || response.statusText}`)
    }
    
    /* 
      Parse and return JSON response
      - Most API responses are JSON
      - Some endpoints (like file downloads) might return different content types
    */
    return await response.json()
    
  } catch (error) {
    /* 
      Handle network errors and API errors
      - Network errors: no internet, server down, etc.
      - API errors: invalid data, authentication failures, etc.
      - Re-throw the error so calling code can handle it appropriately
    */
    console.error('API Request failed:', error)
    throw error
  }
}

/* 
  LEARNING COMMENT: Authentication API functions
  - login(): Send credentials to backend, store returned token
  - register(): Create new user account
  - logout(): Remove token and clear authentication
  - getCurrentUser(): Get user profile information
*/

/* Login user with email and password */
export const login = async (email, password) => {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  
  /* Store the JWT token for future requests */
  if (response.token) {
    setToken(response.token)
  }
  
  return response
}

/* Register new user account */
export const register = async (userData) => {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
  
  /* Automatically log in the user after registration */
  if (response.token) {
    setToken(response.token)
  }
  
  return response
}

/* Logout user by removing token */
export const logout = async () => {
  try {
    // Try to call backend logout endpoint
    await apiRequest('/auth/logout', {
      method: 'POST'
    })
  } catch (error) {
    // If backend call fails, still remove token locally
    console.warn('Backend logout failed:', error)
  } finally {
    // Always remove token from localStorage
    removeToken()
  }
}

/* Get current user profile */
export const getCurrentUser = async () => {
  return await apiRequest('/auth/me')
}

/* 
  LEARNING COMMENT: Resume API functions
  - getResumes(): Fetch all user's resumes
  - createResume(): Upload a new resume file
  - updateResume(): Update resume metadata
  - deleteResume(): Delete resume and its file
  - downloadResume(): Download resume file
*/

/* Get all resumes for the current user */
export const getResumes = async () => {
  return await apiRequest('/resumes')
}

/* 
  LEARNING COMMENT: Create new resume with file upload
  - Uses FormData to handle file uploads
  - FormData allows sending files along with other data
  - backend receives multipart/form-data content type
  - Returns the created resume with file URL and metadata
*/
export const createResume = async (resumeData) => {
  /* 
    Create FormData object for file upload
    - FormData is a special object for sending files and form data
    - It automatically sets the correct content-type header
    - Backend can parse both file and text data from this format
  */
  const formData = new FormData()
  
  /* Add each piece of data to the FormData object */
  formData.append('title', resumeData.name) // Backend expects 'title' field
  formData.append('file', resumeData.file)
  
  /* Add description if provided (optional field) */
  if (resumeData.description) {
    formData.append('description', resumeData.description)
  }
  
  /* 
    Make request with FormData
    - Don't set Content-Type header, let browser handle it automatically
    - Browser will set multipart/form-data with proper boundary
  */
  const headers = getDefaultHeaders()
  delete headers['Content-Type'] // Remove default JSON content type
  
  return await apiRequest('/resumes', {
    method: 'POST',
    headers,
    body: formData,
  })
}

/* Update resume metadata (name, description) */
export const updateResume = async (id, updateData) => {
  return await apiRequest(`/resumes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  })
}

/* Delete resume and its file */
export const deleteResume = async (id) => {
  return await apiRequest(`/resumes/${id}`, {
    method: 'DELETE',
  })
}

/* 
  LEARNING COMMENT: Preview resume file content
  - Uses the preview endpoint that serves files for inline viewing
  - Returns the file content as text or blob for display in modal
*/
export const previewResume = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resumes/${id}/preview`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    
    if (!response.ok) {
      throw new Error(`Preview failed: ${response.statusText}`)
    }
    
    return response
  } catch (error) {
    console.error('Preview resume error:', error)
    throw error
  }
}

/* 
  LEARNING COMMENT: Download resume file
  - Different from other API calls because it returns a file, not JSON
  - Uses blob() instead of json() to handle binary file data
  - Creates a downloadable link and triggers browser download
*/
export const downloadResume = async (id, filename) => {
  try {
    /* 
      Make request for file download
      - Don't use apiRequest because we need the raw response
      - Need to handle binary data differently than JSON
    */
    const response = await fetch(`${API_BASE_URL}/resumes/${id}/download`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`)
    }
    
    /* 
      Convert response to blob (binary data)
      - blob() handles any file type (PDF, DOC, etc.)
      - Creates a Blob object that can be downloaded
    */
    const blob = await response.blob()
    
    /* 
      Create download link and trigger download
      - URL.createObjectURL() creates a temporary URL for the blob
      - Create a temporary <a> element with download attribute
      - Programmatically click it to trigger download
      - Clean up the temporary URL after download
    */
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || 'resume'  // Filename for the download
    document.body.appendChild(link)
    link.click()                          // Trigger the download
    link.remove()                         // Clean up the DOM
    window.URL.revokeObjectURL(url)       // Clean up the temporary URL
    
  } catch (error) {
    console.error('Download failed:', error)
    throw error
  }
}

/* 
  LEARNING COMMENT: Job Application API functions
  - Similar pattern to resumes but for job applications
  - getJobs(): Fetch all job applications
  - createJob(): Add new job application
  - updateJob(): Update existing job application
  - deleteJob(): Remove job application
*/

/* Get all job applications for the current user */
export const getJobs = async () => {
  return await apiRequest('/jobs')
}

/* Create new job application */
export const createJob = async (jobData) => {
  return await apiRequest('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  })
}

/* Update existing job application */
export const updateJob = async (id, updateData) => {
  return await apiRequest(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  })
}

/* Delete job application */
export const deleteJob = async (id) => {
  return await apiRequest(`/jobs/${id}`, {
    method: 'DELETE',
  })
}

/* 
  LEARNING COMMENT: Dashboard API functions
  - getDashboardStats(): Get analytics data for dashboard
  - Includes job counts by status, recent applications, etc.
*/
export const getDashboardStats = async () => {
  return await apiRequest('/dashboard/stats')
}

/* 
  LEARNING COMMENT: Export default object with all API functions
  - This allows importing either individual functions or the entire API object
  - Example usage:
    * import { login, getResumes } from './api.js'
    * import api from './api.js'; api.login()
*/
export default {
  /* Authentication */
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  getToken,
  setToken,
  removeToken,
  
  /* Resumes */
  getResumes,
  createResume,
  updateResume,
  deleteResume,
  previewResume,
  downloadResume,
  
  /* Jobs */
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  
  /* Dashboard */
  getDashboardStats,
}
