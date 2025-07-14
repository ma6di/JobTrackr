/* 
  LEARNING COMMENT: Import statements for AddResumeModal functionality
  - useState: React hook for managing component state (form data, drag state, upload status)
  - This modal component handles file uploads with drag-and-drop functionality
  - Now includes loading states and error handling for backend integration
*/
import { useState } from 'react'

/* 
  LEARNING COMMENT: AddResumeModal Component - File upload modal
  - This functional component creates a modal for uploading resume files
  - Features drag-and-drop file upload, form validation, and file preview
  - Props:
    * isOpen: boolean to control modal visibility
    * onClose: function to close the modal
    * onSave: function called when user saves the resume data
*/
function AddResumeModal({ isOpen, onClose, onSave }) {
  /* 
    LEARNING COMMENT: Form data state management
    - useState manages the form fields for resume upload
    - formData object contains:
      * name: user-provided name for the resume
      * file: the actual file object from file input/drop
      * description: optional description of the resume
    - Initially all fields are empty
  */
  const [formData, setFormData] = useState({
    name: '',
    file: null,
    description: ''
  })
  
  /* 
    LEARNING COMMENT: Upload status state management
    - uploading: boolean indicating if file upload is in progress
    - Used to show loading spinner and disable form during upload
    - Prevents multiple simultaneous uploads
  */
  const [uploading, setUploading] = useState(false)

  /* 
    LEARNING COMMENT: Error state management
    - uploadError: stores error message if upload fails
    - Used to display helpful error messages to users
    - Gets reset when user starts a new upload attempt
  */
  const [uploadError, setUploadError] = useState(null)

  /* 
    LEARNING COMMENT: Drag-and-drop state management
    - dragActive: boolean indicating if user is currently dragging a file over the drop zone
    - Used to change visual styling during drag operations
    - Provides visual feedback to users about valid drop zones
  */
  const [dragActive, setDragActive] = useState(false)

  /* 
    LEARNING COMMENT: Form input change handler
    - Handles changes to text inputs (name, description)
    - e.target: the input element that triggered the change
    - Uses destructuring to get name and value from the input
    - Updates formData using spread operator to preserve other fields
  */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,                    // Keep existing formData
      [name]: value              // Update the specific field that changed
    }))
  }

  /* 
    LEARNING COMMENT: File input change handler with validation
    - Handles when user selects a file through the file input
    - Validates file type and size before setting in state
    - Automatically sets the resume name from filename if user hasn't provided one
    - Clears any previous upload errors
  */
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      /* Validate file type */
      if (!isValidFileType(file)) {
        setUploadError('Please select a PDF or Word document (.pdf, .doc, .docx)')
        return
      }
      
      /* Validate file size (10MB limit) */
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB')
        return
      }
      
      /* Clear any previous errors */
      setUploadError(null)
      
      /* Update form data with the valid file */
      setFormData(prev => ({
        ...prev,
        file: file,
        // Set name from filename only if user hasn't typed a name yet
        name: prev.name || file.name.replace(/\.[^/.]+$/, "")
      }))
    }
  }

  /* 
    LEARNING COMMENT: File validation helper function
    - Checks if uploaded file is a supported document type
    - Accepts PDF and Word documents (.pdf, .doc, .docx)
    - Could be extended to support other formats as needed
  */
  const isValidFileType = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    return allowedTypes.includes(file.type)
  }

  /* 
    LEARNING COMMENT: Drag event handler
    - Handles drag enter, drag over, and drag leave events
    - e.preventDefault() and e.stopPropagation(): prevent default browser behavior
    - Sets dragActive to true when file is being dragged over drop zone
    - Sets dragActive to false when file leaves drop zone
    - This provides visual feedback during drag operations
  */
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  /* 
    LEARNING COMMENT: File drop handler with validation
    - Handles when user drops a file onto the drop zone
    - Includes same validation as file input handler
    - e.dataTransfer.files: contains files that were dropped
    - Sets dragActive to false since drop operation is complete
  */
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      
      /* Validate file type */
      if (!isValidFileType(file)) {
        setUploadError('Please select a PDF or Word document (.pdf, .doc, .docx)')
        return
      }
      
      /* Validate file size (10MB limit) */
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB')
        return
      }
      
      /* Clear any previous errors */
      setUploadError(null)
      
      /* Update form data with the valid file */
      setFormData(prev => ({
        ...prev,
        file: file,
        name: prev.name || file.name.replace(/\.[^/.]+$/, "")
      }))
    }
  }

  /* 
    LEARNING COMMENT: Async form submission handler
    - Called when user clicks "Upload Resume" button
    - Now handles asynchronous file upload to backend
    - Shows loading state during upload and handles errors
    - Uses try-catch for proper error handling
  */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    /* Validate required fields */
    if (!formData.name.trim()) {
      setUploadError('Please enter a resume name')
      return
    }
    
    if (!formData.file) {
      setUploadError('Please select a file to upload')
      return
    }
    
    try {
      setUploading(true)               // Show loading spinner
      setUploadError(null)             // Clear any previous errors
      
      /* Call onSave function (which will call API through ResumesContext) */
      await onSave(formData)
      
      /* Reset form and close modal on success */
      setFormData({ name: '', file: null, description: '' })
      onClose()
      
    } catch (error) {
      /* Display error message to user */
      console.error('Upload failed:', error)
      setUploadError(error.message || 'Failed to upload resume. Please try again.')
    } finally {
      setUploading(false)              // Hide loading spinner
    }
  }

  /* 
    LEARNING COMMENT: Form reset and close handler
    - Resets all form fields to empty values
    - Clears upload status and error states
    - Closes the modal without saving
    - Used for Cancel button and X button
  */
  const resetForm = () => {
    setFormData({ name: '', file: null, description: '' })
    setUploading(false)
    setUploadError(null)
    onClose()
  }

  /* 
    LEARNING COMMENT: Conditional rendering guard
    - If modal is not open, return null (render nothing)
    - This prevents the modal from being in the DOM when not needed
    - React will not render anything when a component returns null
  */
  if (!isOpen) return null

  /* 
    LEARNING COMMENT: Main modal JSX return
    - Creates the visual modal overlay and content
    - Uses portal pattern with fixed positioning for modal behavior
    - Combines backdrop, modal container, and form content
  */
  return (
    // Modal backdrop overlay - covers entire screen with semi-transparent overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      
      {/* 
        LEARNING COMMENT: Modal content container
        - bg-white dark:bg-gray-800: white background in light mode, dark gray in dark mode
        - rounded-2xl: large border radius for modern appearance
        - shadow-2xl: strong shadow for depth
        - p-6: 24px padding inside the modal
        - w-full max-w-md: full width up to medium size (448px)
        - mx-4: horizontal margin for mobile spacing
      */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 border-2 border-slate-300 dark:border-gray-600">
        
        {/* 
          LEARNING COMMENT: Modal header
          - flex justify-between: spreads title and close button apart
          - items-center: vertically centers content
          - mb-6: 24px bottom margin to separate from form
        */}
        <div className="flex justify-between items-center mb-6">
          {/* Modal title */}
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Upload Resume</h2>
          
          {/* 
            LEARNING COMMENT: Close button (X)
            - onClick={resetForm}: closes modal and resets form
            - X icon from SVG for universal close symbol
            - hover effects change color on mouse over
          */}
          <button
            onClick={resetForm}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            {/* X/close icon */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>

        {/* 
          LEARNING COMMENT: Main form element
          - onSubmit={handleSubmit}: handles form submission
          - space-y-6: 24px vertical spacing between form sections
          - Contains all form fields: name, file upload, description, buttons
        */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 
            LEARNING COMMENT: Resume Name Field
            - Text input for user to provide a name for the resume
            - Required field for form submission
            - Auto-fills from filename when file is selected
          */}
          <div>
            {/* Field label */}
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Resume Name
            </label>
            {/* 
              LEARNING COMMENT: Text input for resume name
              - type="text": standard text input
              - name="name": corresponds to formData.name
              - value={formData.name}: controlled input (React manages the value)
              - onChange={handleInputChange}: calls handler when user types
              - required: HTML5 validation - form won't submit without this
              - Focus styles: ring appears when input is focused
            */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Frontend Developer Resume"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
              required
            />
          </div>

          {/* 
            LEARNING COMMENT: File Upload Section
            - Most complex part of the form with drag-and-drop functionality
            - Shows different UI based on whether file is selected
            - Handles both click-to-browse and drag-and-drop
          */}
          <div>
            {/* Field label */}
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Resume File
            </label>
            
            {/* 
              LEARNING COMMENT: Drag-and-drop zone
              - Dynamic styling based on dragActive state
              - border-2 border-dashed: dashed border indicates drop zone
              - Drag event handlers enable drag-and-drop functionality
              - Visual feedback when user drags files over the area
            */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-slate-500 bg-slate-50 dark:border-slate-400 dark:bg-gray-700'
                  : 'border-slate-300 dark:border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {/* 
                LEARNING COMMENT: Hidden file input
                - type="file": creates file selection dialog
                - accept=".pdf,.doc,.docx": restricts file types
                - className="hidden": hides the default ugly file input
                - id="resume-upload": connects to label for custom styling
              */}
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="resume-upload"
              />
              
              {/* 
                LEARNING COMMENT: Conditional rendering based on file selection
                - Shows file preview if file is selected
                - Shows upload instructions if no file selected
                - formData.file ? ... : ... is a ternary operator (if/else shorthand)
              */}
              {formData.file ? (
                // File selected state - show file preview
                <div className="flex items-center justify-center space-x-2">
                  {/* Green checkmark/document icon indicates success */}
                  <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                  </svg>
                  {/* Display the filename */}
                  <span className="text-slate-700 dark:text-slate-300">{formData.file.name}</span>
                </div>
              ) : (
                // No file selected state - show upload instructions
                <div>
                  {/* Large document icon */}
                  <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                  </svg>
                  
                  {/* 
                    LEARNING COMMENT: Upload instructions with clickable link
                    - Explains drag-and-drop functionality
                    - "browse" link triggers file dialog when clicked
                    - htmlFor="resume-upload": connects label to hidden input
                  */}
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    Drag and drop your resume here, or{' '}
                    <label htmlFor="resume-upload" className="text-slate-600 dark:text-slate-400 underline cursor-pointer hover:text-slate-800 dark:hover:text-slate-200">
                      browse
                    </label>
                  </p>
                  {/* File type and size limitations */}
                  <p className="text-xs text-slate-500 dark:text-slate-500">PDF, DOC, DOCX up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* 
            LEARNING COMMENT: Description Field (Optional)
            - Textarea for users to add notes about this resume version
            - Optional field - not required for form submission
            - Useful for tracking different resume versions
          */}
          <div>
            {/* Field label with (Optional) indicator */}
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description (Optional)
            </label>
            {/* 
              LEARNING COMMENT: Textarea input for description
              - name="description": corresponds to formData.description
              - rows="3": sets initial height to 3 text lines
              - Same styling pattern as text input for consistency
              - Controlled component with value and onChange
            */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of this resume version..."
              rows="3"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* 
            LEARNING COMMENT: Error Message Display
            - Shows validation errors and upload failures to users
            - Conditional rendering: only shows when uploadError has a value
            - Red styling to indicate error state
            - mb-4: margin bottom to separate from buttons
          */}
          {uploadError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <p className="text-red-700 dark:text-red-300 text-sm">{uploadError}</p>
            </div>
          )}

          {/* 
            LEARNING COMMENT: Form Action Buttons
            - Cancel and Submit buttons side by side
            - flex space-x-3: horizontal layout with spacing
            - flex-1: each button takes equal width
          */}
          <div className="flex space-x-3">
            
            {/* 
              LEARNING COMMENT: Cancel Button
              - type="button": prevents form submission
              - onClick={resetForm}: resets form and closes modal
              - Secondary styling (gray) indicates it's not the primary action
            */}
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-slate-300 dark:border-gray-600"
            >
              Cancel
            </button>
            
            {/* 
              LEARNING COMMENT: Submit Button with Loading State
              - type="submit": triggers form submission
              - disabled when: required fields empty OR currently uploading
              - Shows loading spinner when uploading is in progress
              - Button text changes based on upload state
              - Primary styling (dark background) indicates main action
            */}
            <button
              type="submit"
              disabled={!formData.name || !formData.file || uploading}
              className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {/* 
                LEARNING COMMENT: Conditional rendering for button content
                - Shows loading spinner when uploading
                - Shows normal text when not uploading
                - Loading spinner is an animated SVG
              */}
              {uploading ? (
                <>
                  {/* Loading spinner animation */}
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                'Upload Resume'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* 
  LEARNING COMMENT: Export default AddResumeModal component
  - export default: makes this component available for import in other files
  - Allows other components to import this with: import AddResumeModal from './AddResumeModal'
  - Used in Resumes.jsx to show file upload modal when needed
*/
export default AddResumeModal
