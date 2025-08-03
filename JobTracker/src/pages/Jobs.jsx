/* 
  LEARNING COMMENT: Import statements for Jobs page functionality
  - useState: React hook for managing component state (modal visibility)
  - useJobs: Custom hook from JobsContext to access job data and functions
  - useResumes: Custom hook from ResumesContext to get resume data (needed for job modal)
  - AddJobModal: Modal component for adding new job applications
*/
import { useState } from 'react'
import { useJobs } from '../contexts/JobsContext'
import { useResumes } from '../contexts/ResumesContext'
import AddJobModal from '../components/AddJobModal'
import JobViewModal from '../components/JobViewModal'

/* 
  LEARNING COMMENT: Jobs Component - Job applications tracking page
  - This functional component displays a comprehensive table of job applications
  - Shows detailed information for each job: company, position, status, location, etc.
  - Integrates with both JobsContext and ResumesContext for complete functionality
  - Features color-coded status indicators and progress tracking
*/
function Jobs() {
  /* 
    LEARNING COMMENT: Context integration for job management
    - useJobs() provides access to job data and functions from global context
    - jobs: array of job application objects with detailed information
    - loading: boolean indicating if jobs are being fetched from API
    - error: error message if API calls fail
    - addJob: function to add new job application to the collection
    - updateJob: function to update existing job application
    - deleteJob: function to remove job application
  */
  const { jobs, loading, error, addJob, updateJob, deleteJob } = useJobs()
  
  /* 
    LEARNING COMMENT: Resume context integration
    - useResumes() provides access to resume data
    - resumes: array needed by AddJobModal to let users select which resume they used
    - This connects job applications with the specific resume versions
  */
  const { resumes } = useResumes()
  
  /* 
    LEARNING COMMENT: Modal state management
    - useState manages whether the "Add Job Application" modal is open or closed
    - isAddModalOpen: boolean state (true = modal visible, false = modal hidden)
    - setIsAddModalOpen: function to update the modal visibility state
  */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  /* 
    LEARNING COMMENT: Edit modal state management
    - isEditModalOpen: boolean state for edit modal visibility
    - selectedJob: stores the job being edited or viewed
  */
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  /* 
    LEARNING COMMENT: Job submission handler
    - Called when user successfully adds a new job application through the modal
    - jobData: object containing new job application information
    - addJob(jobData): adds the new job to backend API and global state
    - setIsAddModalOpen(false): closes the modal after successful submission
  */
  const handleAddJob = async (jobData) => {
    try {
      await addJob(jobData)
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Failed to add job:', error)
      // Modal will stay open so user can try again
    }
  }

  /* 
    LEARNING COMMENT: Job action handlers
    - handleViewJob: opens view modal to display job details
    - handleEditJob: opens edit modal with job data pre-filled
    - handleDeleteJob: confirms and deletes a job application
  */
  const handleViewJob = (job) => {
    setSelectedJob(job)
    setIsViewModalOpen(true)
  }

  const handleEditJob = (job) => {
    setSelectedJob(job)
    setIsEditModalOpen(true)
  }

  const handleUpdateJob = async (jobData) => {
    try {
      await updateJob(selectedJob.id, jobData)
      setIsEditModalOpen(false)
      setSelectedJob(null)
    } catch (error) {
      console.error('Failed to update job:', error)
      // Modal will stay open so user can try again
    }
  }

  const handleDeleteJob = async (job) => {
    if (window.confirm(`Are you sure you want to delete the ${job.title} application at ${job.company}?`)) {
      try {
        await deleteJob(job.id)
      } catch (error) {
        console.error('Failed to delete job:', error)
        alert('Failed to delete job application. Please try again.')
      }
    }
  }

  /* 
    LEARNING COMMENT: Status color coding function
    - Determines the visual styling for job status badges
    - Takes a status string and returns appropriate Tailwind CSS classes
    - Different colors help users quickly identify application stages:
      * Green shades: Interviews (positive progress)
      * Blue: Applied/Pending (neutral, waiting)
      * Rose: Rejected (negative outcome)
      * Violet: Offer (positive outcome)
    - Each color includes both light and dark mode variants
  */
  const getStatusColor = (status) => {
    switch (status) {
      case 'First Interview': return 'bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-600'
      case 'Second Interview': return 'bg-teal-200 dark:bg-teal-800 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-600'
      case 'Third Interview': return 'bg-cyan-200 dark:bg-cyan-800 text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-600'
      case 'Final Interview': return 'bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-600'
      case 'Pending': return 'bg-amber-200 dark:bg-blue-800 text-amber-900 dark:text-blue-200 border border-amber-300 dark:border-blue-600'
      case 'Applied': return 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-600'
      case 'Rejected': return 'bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-600'
      case 'Offer': return 'bg-violet-200 dark:bg-violet-800 text-violet-900 dark:text-violet-200 border border-violet-300 dark:border-violet-600'
      default: return 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
    }
  }

  /* 
    LEARNING COMMENT: Main component return - job applications tracking page
    - Returns JSX that creates a comprehensive job tracking interface
    - Features a detailed table layout with multiple columns of information
    - Uses responsive design principles for different screen sizes
  */
  return (
    // Main container with full screen height
    <div className="min-h-screen">
      {/* Content wrapper with responsive width and centered layout */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* 
          LEARNING COMMENT: Page Header Section
          - Contains page title, description, and main action button
          - Same layout pattern as other pages for consistency
          - flex justify-between: spreads content to left and right sides
        */}
        <div className="flex justify-between items-center mb-8">
          
          {/* Header text content (left side) */}
          <div>
            {/* Main page title */}
            <h1 className="text-4xl font-light text-slate-700 dark:text-slate-300 mb-2">Job Applications</h1>
            {/* Subtitle describing the page's purpose */}
            <p className="text-slate-600 dark:text-slate-400 text-lg font-light">Detailed view of all your job applications and their progress</p>
          </div>
          
          {/* 
            LEARNING COMMENT: Add New Application Button (right side)
            - Primary action button for adding new job applications
            - onClick opens the job application modal
            - Same styling pattern as other page action buttons
          */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md flex items-center space-x-2"
          >
            {/* Plus/add icon */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
            </svg>
            <span>Add New Application</span>
          </button>
        </div>

        {/* 
          LEARNING COMMENT: Jobs Table Container
          - Main table displaying all job applications in detail
          - overflow-hidden: clips content that extends beyond container
          - rounded-2xl: large border radius for modern appearance
          - shadow-2xl: strong shadow for depth and separation
          - border-2: thick border for definition
        */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-300 dark:border-gray-600">
          
          {/* 
            LEARNING COMMENT: Loading State
            - Shows spinner while jobs are being fetched from API
            - Only displays when loading is true
          */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
              <span className="ml-3 text-slate-600 dark:text-slate-400">Loading jobs...</span>
            </div>
          )}

          {/* 
            LEARNING COMMENT: Error State
            - Shows error message if API calls fail
            - Only displays when there's an error and not loading
          */}
          {!loading && error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-500 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="text-red-500 font-medium">{error}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please try refreshing the page</p>
              </div>
            </div>
          )}

          {/* 
            LEARNING COMMENT: Empty State
            - Shows when no jobs are available and not loading/error
            - Provides guidance for users to add their first job
          */}
          {!loading && !error && jobs.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-slate-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">No job applications yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">Start tracking your job applications by adding your first one!</p>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Add Your First Job
                </button>
              </div>
            </div>
          )}

          {/* 
            LEARNING COMMENT: Jobs Table Content
            - Only shows when not loading, no error, and jobs exist
          */}
          {!loading && !error && jobs.length > 0 && (
            <div>
              {/* 
                LEARNING COMMENT: Table Header Section
                - Contains title and description for the table
                - Uses gradient background to distinguish from table content
                - px-8 py-6: generous padding for breathing room
                - border-b-2: strong bottom border to separate from table
              */}
              <div className="px-8 py-6 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b-2 border-slate-300 dark:border-gray-600">
                <h2 className="text-2xl font-light text-slate-700 dark:text-slate-300 mb-2">All Applications</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-light">Comprehensive details for each job application</p>
              </div>
          
          {/* 
            LEARNING COMMENT: Table Container with Horizontal Scroll
            - overflow-x-auto: allows horizontal scrolling on small screens
            - Ensures table remains usable on mobile devices
            - Table will scroll horizontally instead of breaking layout
          */}
          <div className="overflow-x-auto bg-white dark:bg-gray-800">
            
            {/* 
              LEARNING COMMENT: Main Data Table
              - w-full: table takes full width of container
              - text-sm: smaller text size to fit more information
              - HTML table structure: thead (headers) + tbody (data rows)
            */}
            <table className="w-full text-sm">
              
              {/* 
                LEARNING COMMENT: Table Header Row
                - Contains column headers with icons and labels
                - bg-slate-200: light gray background to distinguish headers
                - border-b-2: strong bottom border to separate from data
                - Each <th> represents a column with specific information type
              */}
              <thead className="bg-slate-200 dark:bg-gray-700 border-b-2 border-slate-400 dark:border-gray-600">
                <tr>
                  
                  {/* 
                    LEARNING COMMENT: Position Details Column Header
                    - Contains job title, description, and requirements
                    - Briefcase icon represents job/position
                    - px-6 py-4: padding for comfortable spacing
                    - text-left: left-aligns header text
                    - uppercase tracking-wider: makes text uppercase with letter spacing
                  */}
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      {/* Briefcase/job icon */}
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
                      </svg>
                      <span>Position Details</span>
                    </div>
                  </th>
                  
                  {/* 
                    LEARNING COMMENT: Company & Salary Column Header
                    - Contains company name, salary information, location
                    - Building icon represents company/organization
                  */}
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      {/* Building/company icon */}
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"></path>
                      </svg>
                      <span>Company & Salary</span>
                    </div>
                  </th>
                  
                  {/* 
                    LEARNING COMMENT: Status & Progress Column Header
                    - Contains application status and progress notes
                    - Chart/pie icon represents status and progress tracking
                  */}
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      {/* Chart/progress icon */}
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                      </svg>
                      <span>Status & Progress</span>
                    </div>
                  </th>
                  
                  {/* 
                    LEARNING COMMENT: Work Details Column Header
                    - Contains work type (full-time, contract, etc.) and remote status
                    - Location pin icon represents work location/details
                  */}
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      {/* Location/pin icon */}
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                      </svg>
                      <span>Work Details</span>
                    </div>
                  </th>
                  
                  {/* 
                    LEARNING COMMENT: Match & Date Column Header
                    - Contains match score percentage and application date
                    - Flag icon represents matching/ranking
                  */}
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      {/* Flag/ranking icon */}
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd"></path>
                      </svg>
                      <span>Match & Date</span>
                    </div>
                  </th>
                  
                  {/* 
                    LEARNING COMMENT: Actions Column Header
                    - Contains action buttons for each job (view, edit, delete)
                    - Lightning bolt icon represents actions/operations
                  */}
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      {/* Lightning/action icon */}
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                      </svg>
                      <span>Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              
              {/* 
                LEARNING COMMENT: Table Body with Job Data
                - Contains actual job application data rows
                - divide-y: adds horizontal dividers between rows
                - Each row represents one job application with all its details
              */}
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-slate-300 dark:divide-gray-600">
                
                {/* 
                  LEARNING COMMENT: Dynamic job rows rendering
                  - jobs.map(): creates a table row for each job in the array
                  - key={job.id}: unique identifier required by React for list items
                  - index parameter: position in array (could be used for numbering)
                  - Each job object contains: title, company, status, salary, location, etc.
                */}
                {jobs.map((job, index) => (
                  <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-300 border-l-4 border-transparent hover:border-l-slate-400 dark:hover:border-l-gray-500">
                    
                    {/* 
                      LEARNING COMMENT: Position Details Cell
                      - Shows job title, description, and requirements
                      - px-6 py-6: generous padding for readability
                      - Hierarchical text sizing: large title, medium description, small requirements
                    */}
                    <td className="px-6 py-6">
                      {/* Job title with large, bold text */}
                      <div className="flex items-center space-x-2">
                        <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">{job.title}</div>
                        {/* Job posting link icon */}
                        {job.applicationUrl && (
                          <a
                            href={job.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                            title="View original job posting"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path>
                            </svg>
                          </a>
                        )}
                      </div>
                      {/* Job description with medium, subdued text */}
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{job.description}</div>
                      {/* Requirements in a styled badge/pill */}
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-2 bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded inline-block">
                        {job.requirements}
                      </div>
                    </td>
                    
                    {/* 
                      LEARNING COMMENT: Company & Salary Cell
                      - Shows company name, salary, and location
                      - Company name gets prominence with larger, bold text
                      - Salary and location use smaller, secondary styling
                    */}
                    <td className="px-6 py-6">
                      {/* Company name */}
                      <div className="text-lg text-slate-800 dark:text-slate-200 font-semibold">{job.company}</div>
                      {/* Salary information */}
                      <div className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">{job.salary}</div>
                      {/* Location */}
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{job.location}</div>
                    </td>
                    
                    {/* 
                      LEARNING COMMENT: Status & Progress Cell
                      - Shows colored status badge and progress notes
                      - getStatusColor(job.status): applies appropriate color based on status
                      - Status badge uses rounded corners and consistent padding
                    */}
                    <td className="px-6 py-6">
                      {/* Status badge with dynamic coloring */}
                      <span className={`px-3 py-1 text-sm font-medium rounded-lg ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                      {/* Progress notes */}
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">{job.notes}</div>
                    </td>
                    
                    {/* 
                      LEARNING COMMENT: Work Details Cell
                      - Shows employment type (full-time, contract, etc.) and remote status
                      - Simple text information with consistent styling
                    */}
                    <td className="px-6 py-6">
                      {/* Employment type */}
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{job.type}</div>
                      {/* Remote work status */}
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{job.remote}</div>
                    </td>
                    
                    {/* 
                      LEARNING COMMENT: Match Score & Date Cell
                      - Shows visual progress bar for match percentage and application date
                      - Progress bar provides immediate visual feedback on job fit
                      - flex items-center space-x-3: aligns progress bar and percentage
                    */}
                    <td className="px-6 py-6">
                      {/* Match score progress bar container */}
                      <div className="flex items-center space-x-3 mb-2">
                        {/* 
                          LEARNING COMMENT: Progress bar track
                          - w-20: 80px wide progress bar
                          - bg-slate-300: light gray background for track
                          - rounded-full: fully rounded ends
                          - h-2: 8px height for thin progress bar
                        */}
                        <div className="w-20 bg-slate-300 dark:bg-gray-600 rounded-full h-2">
                          {/* 
                            LEARNING COMMENT: Progress bar fill
                            - Dynamic width based on job.matchScore percentage
                            - style={{ width: `${job.matchScore}%` }}: inline style for dynamic width
                            - bg-emerald-600: green color indicates positive/good match
                            - transition-all duration-700: smooth animation when percentage changes
                          */}
                          <div 
                            className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all duration-700"
                            style={{ width: `${job.matchScore}%` }}
                          ></div>
                        </div>
                        {/* Match percentage text */}
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{job.matchScore}%</span>
                      </div>
                      {/* Application date */}
                      <div className="text-sm text-slate-600 dark:text-slate-400">{job.appliedDate}</div>
                    </td>
                    
                    {/* 
                      LEARNING COMMENT: Actions Cell
                      - Contains action buttons for job management
                      - Three buttons: view, edit, delete
                      - space-x-2: 8px spacing between buttons
                      - Each button follows the same size and styling pattern
                    */}
                    <td className="px-6 py-6">
                      <div className="flex space-x-2">
                        
                        {/* 
                          LEARNING COMMENT: View Job Button
                          - Eye icon for viewing/previewing job details
                          - onClick: opens view modal with job details
                          - p-2: 8px padding on all sides
                          - Neutral gray styling as it's a view-only action
                        */}
                        <button 
                          onClick={() => handleViewJob(job)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 p-2 rounded-lg transition-all duration-300 border border-slate-300 dark:border-gray-600"
                        >
                          {/* Eye/view icon */}
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                          </svg>
                        </button>
                        
                        {/* 
                          LEARNING COMMENT: Edit Job Button
                          - Pencil icon for editing job information
                          - onClick: opens edit modal with job data pre-filled
                          - Same neutral styling as view button
                        */}
                        <button 
                          onClick={() => handleEditJob(job)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 p-2 rounded-lg transition-all duration-300 border border-slate-300 dark:border-gray-600"
                        >
                          {/* Pencil/edit icon */}
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                          </svg>
                        </button>
                        
                        {/* 
                          LEARNING COMMENT: Delete Job Button
                          - Trash can icon for deleting job application
                          - onClick: shows confirmation dialog and deletes job
                          - Same styling as other action buttons for consistency
                        */}
                        <button 
                          onClick={() => handleDeleteJob(job)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 p-2 rounded-lg transition-all duration-300 border border-slate-300 dark:border-gray-600"
                        >
                          {/* Trash/delete icon */}
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </div>
          )}
        </div>
      </div>

      {/* 
        LEARNING COMMENT: Add Job Modal Component
        - Modal component for adding new job applications
        - isOpen={isAddModalOpen}: controls modal visibility based on state
        - onClose: function to close modal (sets isAddModalOpen to false)
        - onSave={handleAddJob}: function called when user saves new job application
        - resumes={resumes}: passes resume data so user can select which resume they used
        - This creates integration between jobs and resumes for complete tracking
      */}
      <AddJobModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddJob}
        resumes={resumes}
      />

      {/* 
        LEARNING COMMENT: Edit Job Modal Component
        - Reuses AddJobModal component for editing existing jobs
        - isOpen={isEditModalOpen}: controls edit modal visibility
        - onClose: closes edit modal and clears selected job
        - onSave={handleUpdateJob}: function called when user saves job updates
        - initialData={selectedJob}: pre-fills form with existing job data
      */}
      {selectedJob && (
        <AddJobModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedJob(null)
          }}
          onSave={handleUpdateJob}
          resumes={resumes}
          initialData={selectedJob}
          isEdit={true}
        />
      )}

      {/* 
        LEARNING COMMENT: View Job Details Modal
        - Simple modal to display job information in read-only format
        - Shows all job details without edit capabilities
      */}
      {selectedJob && (
        <JobViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedJob(null)
          }}
          job={selectedJob}
        />
      )}
    </div>
  )
}

/* 
  LEARNING COMMENT: Export default Jobs component
  - export default: makes this component available for import in other files
  - Allows other components to import this with: import Jobs from './Jobs'
  - Used in App.jsx routing to display this page when user navigates to /jobs
*/
export default Jobs
