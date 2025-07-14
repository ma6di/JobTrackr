/* 
  LEARNING COMMENT: Import statements for Resumes page functionality
  - useState: React hook for managing component state (modal visibility)
  - useResumes: Custom hook from ResumesContext to access resume data and functions
  - AddResumeModal: Modal component for uploading new resume files
*/
import { useState } from 'react'
import { useResumes } from '../contexts/ResumesContext'
import AddResumeModal from '../components/AddResumeModal'
import ResumePreviewModal from '../components/ResumePreviewModal'

/* 
  LEARNING COMMENT: Resumes Component - Resume management page
  - This functional component displays a grid of user's resume files
  - Allows users to view, download, and delete resumes
  - Integrates with ResumesContext for state management
  - Includes modal for uploading new resumes
*/
function Resumes() {
  /* 
    LEARNING COMMENT: Resume context integration
    - useResumes() provides access to resume data and functions from global context
    - resumes: array of resume objects with file information from backend
    - addResume: async function to upload new resume to backend
    - downloadResume: function to download resume files
    - deleteResume: function to delete resumes from backend
    - loading: indicates if API operations are in progress
    - error: contains error messages from failed operations
  */
  const { resumes, addResume, downloadResume, deleteResume, loading, error } = useResumes()
  
  /* 
    LEARNING COMMENT: Modal state management
    - useState manages whether the "Add Resume" modal is open or closed
    - isAddModalOpen: boolean state (true = modal visible, false = modal hidden)
    - setIsAddModalOpen: function to update the modal visibility state
    - Initially set to false (modal closed)
  */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  /* 
    LEARNING COMMENT: Preview modal state management
    - isPreviewModalOpen: boolean state for preview modal visibility
    - selectedResume: stores the resume to be previewed
    - Used to show resume content in a popup window
  */
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [selectedResume, setSelectedResume] = useState(null)

  /* 
    LEARNING COMMENT: File size formatting utility function
    - Converts bytes to human-readable format (B, KB, MB, GB)
    - Takes raw file size in bytes and returns formatted string
    - Used to display file sizes in a user-friendly way
  */
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  /* 
    LEARNING COMMENT: Async resume submission handler
    - Called when user successfully uploads a new resume through the modal
    - resumeData: object containing new resume information (name, file, etc.)
    - Now handles async file upload to backend with proper error handling
    - Modal stays open if upload fails so user can retry
  */
  const handleAddResume = async (resumeData) => {
    try {
      await addResume(resumeData)           // Upload to backend
      setIsAddModalOpen(false)              // Close modal on success
    } catch (error) {
      /* Error is handled by AddResumeModal and ResumesContext */
      console.error('Failed to add resume:', error)
      /* Modal stays open so user can see error and retry */
    }
  }

  /* 
    LEARNING COMMENT: Resume download handler
    - Called when user clicks download button on a resume card
    - Uses the downloadResume function from context to download file
    - Handles errors gracefully with console logging
  */
  const handleDownloadResume = async (resume) => {
    try {
      await downloadResume(resume)
    } catch (error) {
      console.error('Failed to download resume:', error)
      /* Error message is shown by ResumesContext */
    }
  }

  /* 
    LEARNING COMMENT: Resume deletion handler
    - Called when user clicks delete button on a resume card
    - Could be enhanced with confirmation dialog
    - Removes resume file from S3 and database record
  */
  const handleDeleteResume = async (resumeId) => {
    try {
      await deleteResume(resumeId)
    } catch (error) {
      console.error('Failed to delete resume:', error)
      /* Error message is shown by ResumesContext */
    }
  }

  /* 
    LEARNING COMMENT: Resume preview/view handler
    - Called when user clicks the eye icon to view/preview a resume
    - Opens a modal popup with the resume content
    - Shows different content based on file type (PDF, text, etc.)
  */
  const handleViewResume = async (resume) => {
    try {
      setSelectedResume(resume)
      setIsPreviewModalOpen(true)
    } catch (error) {
      console.error('Failed to view resume:', error)
      /* Error message is shown by ResumesContext */
    }
  }

  /* 
    LEARNING COMMENT: Main component return - resume management page layout
    - Returns JSX that creates the visual resume management interface
    - Uses responsive grid layout to display resume cards
    - Includes header with upload button and grid of resume cards
  */
  return (
    // Main container with full screen height
    <div className="min-h-screen">
      {/* Content wrapper with responsive width and centered layout */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* 
          LEARNING COMMENT: Page Header Section
          - Contains page title, description, and main action button
          - flex justify-between: spreads content to left and right sides
          - items-center: vertically centers the header content
          - mb-8: adds 32px bottom margin to separate from main content
        */}
        <div className="flex justify-between items-center mb-8">
          
          {/* 
            LEARNING COMMENT: Header text content (left side)
            - Contains page title and descriptive subtitle
            - Uses consistent typography hierarchy with other pages
          */}
          <div>
            {/* Main page title with large, light font */}
            <h1 className="text-4xl font-light text-slate-700 dark:text-slate-300 mb-2">My Resumes</h1>
            {/* Subtitle explaining page purpose */}
            <p className="text-slate-600 dark:text-slate-400 text-lg font-light">Manage and organize your resume versions</p>
          </div>
          
          {/* 
            LEARNING COMMENT: Upload New Resume Button (right side)
            - Primary action button for adding new resumes
            - onClick opens the upload modal
            - Uses consistent button styling with icon + text pattern
            - hover:scale-105: slightly enlarges on hover for feedback
          */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md flex items-center space-x-2"
          >
            {/* Plus/add icon */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
            </svg>
            <span>Upload New Resume</span>
          </button>
        </div>

        {/* 
          LEARNING COMMENT: Error Message Display
          - Shows API errors to users (upload failures, download failures, etc.)
          - Conditional rendering: only shows when error exists
          - Red styling to indicate error state
          - mb-6: margin bottom to separate from content
        */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
              </svg>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* 
          LEARNING COMMENT: Loading State Display
          - Shows loading spinner when API operations are in progress
          - Prevents user confusion during async operations
          - Centers the spinner in the content area
        */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-6 w-6 text-slate-600 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-slate-600 dark:text-slate-400">Loading resumes...</span>
            </div>
          </div>
        )}

        {/* 
          LEARNING COMMENT: Resume Grid Layout
          - Responsive grid that adapts to different screen sizes
          - grid-cols-1: single column on mobile devices
          - md:grid-cols-2: two columns on medium screens (768px+)
          - lg:grid-cols-3: three columns on large screens (1024px+)
          - gap-4: 16px spacing between grid items
          - Creates a responsive layout that looks good on all devices
        */}
        {/* 
          LEARNING COMMENT: Resume Grid Layout (only shown when not loading)
          - Responsive grid that adapts to different screen sizes
          - grid-cols-1: single column on mobile devices
          - md:grid-cols-2: two columns on medium screens (768px+)
          - lg:grid-cols-3: three columns on large screens (1024px+)
          - gap-4: 16px spacing between grid items
          - Creates a responsive layout that looks good on all devices
        */}
        {!loading && (
          <>
            {resumes.length === 0 ? (
              /* 
                LEARNING COMMENT: Empty state display
                - Shows when user has no resumes yet
                - Encourages users to upload their first resume
                - Centered layout with helpful messaging
              */
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-slate-400 dark:text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                </svg>
                <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">No resumes yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Upload your first resume to get started</p>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                >
                  Upload Resume
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* 
            LEARNING COMMENT: Dynamic resume cards rendering
            - resumes.map(): creates a card component for each resume in the array
            - key={resume.id}: unique identifier required by React for list items
            - Each resume object contains: id, name, uploadDate, fileSize, format, pages
            - This pattern allows the UI to automatically update when resumes are added/removed
          */}
          {resumes.map((resume) => (
            <div key={resume.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-slate-300 dark:border-gray-600 hover:border-slate-400 dark:hover:border-gray-500">
              
              {/* 
                LEARNING COMMENT: Resume card header
                - Contains file icon and action buttons
                - flex items-start justify-between: icon on left, buttons on right
                - mb-3: adds bottom margin to separate from content below
              */}
              <div className="flex items-start justify-between mb-3">
                
                {/* 
                  LEARNING COMMENT: Resume file icon
                  - Circular background with document icon
                  - Represents the resume file visually
                  - Uses consistent icon styling pattern
                */}
                <div className="w-10 h-10 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300">
                  {/* Document/file icon */}
                  <svg className="w-5 h-5 text-slate-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                  </svg>
                </div>
                
                {/* 
                  LEARNING COMMENT: Action buttons container
                  - Three small buttons for different resume actions
                  - space-x-1: adds small horizontal spacing between buttons
                  - Each button has different color coding for different actions
                */}
                <div className="flex space-x-1">
                  
                  {/* 
                    LEARNING COMMENT: View/Preview button with click handler
                    - Blue color theme indicates view/preview action
                    - Eye icon represents viewing functionality
                    - onClick calls handleViewResume with current resume
                    - w-7 h-7: 28px square size for compact button
                  */}
                  <button 
                    onClick={() => handleViewResume(resume)}
                    className="w-7 h-7 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg flex items-center justify-center transition-all duration-200"
                  >
                    {/* Eye/view icon */}
                    <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                  
                  {/* 
                    LEARNING COMMENT: Download button with click handler
                    - Green/emerald color theme indicates download action
                    - onClick calls handleDownloadResume with current resume
                    - Download arrow icon represents downloading functionality
                    - Same compact sizing as other action buttons
                  */}
                  <button 
                    onClick={() => handleDownloadResume(resume)}
                    className="w-7 h-7 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 rounded-lg flex items-center justify-center transition-all duration-200"
                  >
                    {/* Download arrow icon */}
                    <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                  
                  {/* 
                    LEARNING COMMENT: Delete button with click handler
                    - Red/rose color theme indicates destructive delete action
                    - onClick calls handleDeleteResume with current resume ID
                    - Trash can icon represents deletion functionality
                    - Consistent sizing but different color signals danger
                  */}
                  <button 
                    onClick={() => handleDeleteResume(resume.id)}
                    className="w-7 h-7 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 rounded-lg flex items-center justify-center transition-all duration-200"
                  >
                    {/* Trash/delete icon */}
                    <svg className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* 
                LEARNING COMMENT: Resume name/title
                - Displays the title of the resume file
                - {resume.title}: dynamically shows the resume title from state
                - text-base: 16px font size, font-semibold: bold weight
                - mb-2: adds bottom margin to separate from metadata below
              */}
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">{resume.title}</h3>
              
              {/* 
                LEARNING COMMENT: Resume metadata section
                - Contains file details like upload date, size, format, and pages
                - text-xs: 12px font size for secondary information
                - space-y-1: adds 4px vertical spacing between each metadata row
                - Each row follows the same pattern: icon + text
              */}
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                
                {/* 
                  LEARNING COMMENT: Upload date row
                  - Shows when the resume was uploaded
                  - Calendar icon visually represents date/time
                  - flex items-center space-x-2: aligns icon and text horizontally
                */}
                <div className="flex items-center space-x-2">
                  {/* Calendar icon */}
                  <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg>
                  <span>Uploaded: {new Date(resume.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
                
                {/* 
                  LEARNING COMMENT: File size row
                  - Shows the size of the resume file (e.g., "2.5 MB")
                  - Resize/expand icon represents file size
                  - Helps users understand storage usage
                */}
                <div className="flex items-center space-x-2">
                  {/* Resize/file size icon */}
                  <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13V12a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                  <span>Size: {formatFileSize(resume.fileSize)}</span>
                </div>
                
                {/* 
                  LEARNING COMMENT: File format row
                  - Shows the file type (e.g., "PDF", "DOCX")
                  - Document icon represents file format
                  - Important for compatibility information
                */}
                <div className="flex items-center space-x-2">
                  {/* Document format icon */}
                  <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                  </svg>
                  <span>Format: {
                    resume.mimeType === 'application/pdf' ? 'PDF' :
                    resume.mimeType === 'application/msword' ? 'DOC' :
                    resume.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'DOCX' :
                    resume.mimeType === 'text/plain' ? 'TXT' :
                    resume.originalName?.split('.').pop()?.toUpperCase() || 'Unknown'
                  }</span>
                </div>
              </div>
            </div>
          ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* 
        LEARNING COMMENT: Add Resume Modal Component
        - Modal component for uploading new resume files
        - isOpen={isAddModalOpen}: controls modal visibility based on state
        - onClose: function to close modal (sets isAddModalOpen to false)
        - onSave={handleAddResume}: function called when user saves new resume
        - This creates a smooth user experience: click → modal opens → upload → modal closes
      */}
      <AddResumeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddResume}
      />

      {/* 
        LEARNING COMMENT: Resume Preview Modal Component
        - Modal component for viewing resume content
        - isOpen={isPreviewModalOpen}: controls modal visibility
        - onClose: function to close modal and clear selected resume
        - resume={selectedResume}: the resume object to preview
      */}
      <ResumePreviewModal 
        isOpen={isPreviewModalOpen} 
        onClose={() => {
          setIsPreviewModalOpen(false)
          setSelectedResume(null)
        }} 
        resume={selectedResume} 
      />
    </div>
  )
}

/* 
  LEARNING COMMENT: Export default Resumes component
  - export default: makes this component available for import in other files
  - Allows other components to import this with: import Resumes from './Resumes'
  - Used in App.jsx routing to display this page when user navigates to /resumes
*/
export default Resumes
