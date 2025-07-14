/* 
  LEARNING COMMENT: ResumePreviewModal Component - Resume content viewer
  - This modal component displays resume content in a popup window
  - Supports different file types (PDF, text files, DOCX files)
  - Provides a preview without downloading the file
  - Uses iframe for PDF files, text display for text files, and HTML conversion for DOCX
  - Uses dynamic imports for mammoth.js to reduce initial bundle size
*/
import { useState, useEffect } from 'react'
import { previewResume } from '../services/api.js'

function ResumePreviewModal({ isOpen, onClose, resume }) {
  const [previewContent, setPreviewContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /* 
    LEARNING COMMENT: Load resume content when modal opens
    - Fetches the resume file content from the backend
    - Handles different file types appropriately
    - Shows loading state while fetching
  */
  useEffect(() => {
    if (isOpen && resume) {
      loadResumeContent()
    }
  }, [isOpen, resume])

  const loadResumeContent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Loading resume with ID:', resume.id)
      
      // Use the API function instead of direct fetch
      const response = await previewResume(resume.id)

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', errorText)
        throw new Error(`Failed to load resume: ${response.status} ${response.statusText}`)
      }

      // Handle different file types
      if (resume.mimeType === 'application/pdf') {
        // For PDF files, we'll use the blob URL
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)
        setPreviewContent(blobUrl)
      } else if (resume.mimeType === 'text/plain') {
        // For text files, show the content directly
        const text = await response.text()
        setPreviewContent(text)
      } else if (resume.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // For DOCX files, convert to HTML using mammoth (loaded dynamically)
        try {
          // Dynamic import to reduce initial bundle size
          const { default: mammoth } = await import('mammoth')
          
          const arrayBuffer = await response.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          setPreviewContent(result.value)
          
          // Log any warnings from mammoth conversion
          if (result.messages && result.messages.length > 0) {
            console.warn('DOCX conversion warnings:', result.messages)
          }
        } catch (docxError) {
          console.error('DOCX conversion failed:', docxError)
          throw new Error(`Failed to convert DOCX file: ${docxError.message}`)
        }
      } else {
        // For other file types, create a blob URL
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)
        setPreviewContent(blobUrl)
      }
    } catch (err) {
      console.error('Failed to load resume content:', err)
      setError(`Failed to load resume content: ${err.message}. Please try downloading instead.`)
    } finally {
      setLoading(false)
    }
  }

  /* 
    LEARNING COMMENT: Cleanup function
    - Revokes blob URLs to free memory
    - Called when modal closes or component unmounts
  */
  const cleanup = () => {
    if (previewContent && previewContent.startsWith('blob:')) {
      URL.revokeObjectURL(previewContent)
    }
    setPreviewContent('')
    setError(null)
  }

  /* 
    LEARNING COMMENT: Modal close handler
    - Cleans up resources and closes the modal
  */
  const handleClose = () => {
    cleanup()
    onClose()
  }

  // Don't render if modal is not open
  if (!isOpen || !resume) return null

  return (
    /* Modal backdrop */
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Resume Preview
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {resume.title}
            </p>
          </div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <svg className="animate-spin h-6 w-6 text-gray-600 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-400">Loading resume...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Error Loading Resume</h3>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && previewContent && (
            <>
              {/* PDF Viewer */}
              {resume.mimeType === 'application/pdf' && (
                <iframe
                  src={previewContent}
                  className="w-full h-[60vh] border border-gray-300 dark:border-gray-600 rounded-lg"
                  title={`Preview of ${resume.title}`}
                />
              )}

              {/* Text Content Viewer */}
              {resume.mimeType === 'text/plain' && (
                <div className="w-full h-[60vh] overflow-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                    {previewContent}
                  </pre>
                </div>
              )}

              {/* DOCX Content Viewer */}
              {resume.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
                <div className="w-full h-[60vh] overflow-auto border border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-900">
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert text-gray-800 dark:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: previewContent }}
                  />
                </div>
              )}

              {/* Other file types */}
              {resume.mimeType !== 'application/pdf' && 
               resume.mimeType !== 'text/plain' && 
               resume.mimeType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
                <div className="w-full h-[60vh] flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="text-center max-w-md">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Preview Not Available</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      This file type <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">{resume.mimeType}</code> cannot be previewed in the browser.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                      Supported preview formats: PDF, Text (.txt), and Word documents (.docx)
                    </p>
                    <button
                      onClick={handleClose}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Close and Download Instead
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResumePreviewModal
