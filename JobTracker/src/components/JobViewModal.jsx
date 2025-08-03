/* 
  LEARNING COMMENT: JobViewModal Component - Job details viewer
  - This modal component displays job information in read-only format
  - Shows all job details without edit capabilities
  - Provides a quick overview of job application details
  - Shows resume information and allows resume preview
*/
import React, { useState } from 'react'
import ResumePreviewModal from './ResumePreviewModal'

function JobViewModal({ isOpen, onClose, job }) {
  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false)
  
  // Don't render if modal is not open or no job is selected
  if (!isOpen || !job) return null

  /* 
    LEARNING COMMENT: Status color helper function
    - Returns appropriate CSS classes based on job status
    - Provides visual feedback for different application stages
  */
  const getStatusColor = (status) => {
    const statusColors = {
      'Applied': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Phone Screen': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'First Interview': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Second Interview': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Final Interview': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Offer': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Withdrawn': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  return (
    /* Modal backdrop */
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Job Application Details
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {job.position} at {job.company}
            </p>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Job Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Position & Company */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{job.position}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{job.company}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <p className="text-gray-900 dark:text-gray-100">{job.location}</p>
              </div>
            </div>

            {/* Status & Details */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <div className="mt-1">
                  <span className={`px-3 py-1 text-sm font-medium rounded-lg ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Applied Date</label>
                <p className="text-gray-900 dark:text-gray-100">
                  {job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Salary</label>
              <p className="text-gray-900 dark:text-gray-100">{job.salary || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Employment Type</label>
              <p className="text-gray-900 dark:text-gray-100">{job.jobType || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
              <p className="text-gray-900 dark:text-gray-100 capitalize">{job.priority || 'Medium'}</p>
            </div>
          </div>

          {/* Important Dates (if any exist) */}
          {(job.interviewDate || job.followUpDate) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {job.interviewDate && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Interview Date</label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(job.interviewDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              {job.followUpDate && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up Date</label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(job.followUpDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {job.description && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Description</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {job.description}
              </p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Requirements</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {job.requirements}
              </p>
            </div>
          )}

          {/* Notes */}
          {job.notes && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {job.notes}
              </p>
            </div>
          )}

          {/* Job Posting URL */}
          {job.applicationUrl && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Posting URL</label>
              <div className="mt-1">
                <a 
                  href={job.applicationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline break-all"
                >
                  {job.applicationUrl}
                </a>
              </div>
            </div>
          )}

          {/* Additional Information */}
          {job.additionalInfo && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Additional Information</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {job.additionalInfo}
              </p>
            </div>
          )}

          {/* Resume Used for Application */}
          {job.resume && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resume Used</label>
              <div className="mt-1 flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {job.resume.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {job.resume.resumeType} • {job.resume.originalName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsResumePreviewOpen(true)}
                  className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  title="Preview Resume"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>

      {/* Resume Preview Modal */}
      {job.resume && (
        <ResumePreviewModal
          isOpen={isResumePreviewOpen}
          onClose={() => setIsResumePreviewOpen(false)}
          resume={job.resume}
        />
      )}
    </div>
  )
}

export default JobViewModal
