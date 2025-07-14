/* 
  LEARNING COMMENT: JobViewModal Component - Job details viewer
  - This modal component displays job information in read-only format
  - Shows all job details without edit capabilities
  - Provides a quick overview of job application details
*/
import React from 'react'

function JobViewModal({ isOpen, onClose, job }) {
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
                <p className="text-gray-900 dark:text-gray-100">{job.appliedDate}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Match Score</label>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="w-32 bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${job.matchScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{job.matchScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Salary</label>
              <p className="text-gray-900 dark:text-gray-100">{job.salary}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Employment Type</label>
              <p className="text-gray-900 dark:text-gray-100">{job.type}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Remote Work</label>
              <p className="text-gray-900 dark:text-gray-100">{job.remote}</p>
            </div>
          </div>

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
    </div>
  )
}

export default JobViewModal
