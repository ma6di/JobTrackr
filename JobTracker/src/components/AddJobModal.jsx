/* 
  LEARNING COMMENT: Import statements for AddJobModal functionality
  - useState: React hook for managing complex multi-step form state
  - This is the most complex modal component with a 4-step job application wizard
*/
import { useState } from 'react'

/* 
  LEARNING COMMENT: AddJobModal Component - Multi-step job application modal
  - This functional component creates a wizard-style modal for adding job applications
  - Features 4 steps: Application Details, Company & Position, Job Details, Resume & Notes
  - Includes form validation, progress tracking, and resume selection integration
  - Props:
    * isOpen: boolean to control modal visibility
    * onClose: function to close the modal
    * onSave: function called when user saves the job application
    * resumes: array of available resumes for user to select from (defaults to empty array)
*/
function AddJobModal({ isOpen, onClose, onSave, resumes = [] }) {
  /* 
    LEARNING COMMENT: Multi-step form state management
    - currentStep: tracks which step of the wizard the user is on (1-4)
    - Allows forward/backward navigation through the form
  */
  const [currentStep, setCurrentStep] = useState(1)
  
  /* 
    LEARNING COMMENT: Comprehensive form data state
    - Single state object containing all form fields across all steps
    - Organized by steps but stored together for easier data management
    - Includes default values and sensible defaults for better UX
  */
  const [formData, setFormData] = useState({
    // Step 1: Application Details
    applicationDate: new Date().toISOString().split('T')[0],    // Today's date as default
    source: 'manual',                                           // How user wants to enter data
    jobLink: '',                                               // Optional job posting URL
    
    // Step 2: Company & Position
    company: '',                                               // Company name
    position: '',                                              // Job title/position
    location: '',                                              // Job location
    salary: '',                                                // Salary range
    type: 'Full-time',                                         // Employment type
    remote: 'On-site',                                         // Remote work status
    
    // Step 3: Job Details
    description: '',                                           // Job description
    requirements: '',                                          // Job requirements
    
    // Step 4: Resume & Notes
    selectedResumeId: '',                                      // Which resume was used
    notes: '',                                                 // User notes
    status: 'Applied'                                          // Initial application status
  })

  const totalSteps = 4    // Total number of steps in the wizard

  /* 
    LEARNING COMMENT: Form input change handler
    - Handles changes to any form input across all steps
    - Uses dynamic property updating with computed property names [name]
    - Maintains all other form data while updating specific field
  */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  /* 
    LEARNING COMMENT: Step navigation functions
    - handleNext: moves to next step (with bounds checking)
    - handlePrevious: moves to previous step (with bounds checking)
    - Only allow navigation within valid step range (1-4)
  */
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  /* 
    LEARNING COMMENT: Form submission handler
    - Called when user completes all steps and submits
    - Passes form data to parent component via onSave prop
    - Resets form and closes modal after successful submission
  */
  const handleSubmit = () => {
    onSave(formData)
    resetForm()
  }

  /* 
    LEARNING COMMENT: Form reset and modal close handler
    - Resets step counter to 1
    - Resets all form fields to default values
    - Closes the modal
    - Used for both cancel and successful submission
  */
  const resetForm = () => {
    setCurrentStep(1)
    setFormData({
      applicationDate: new Date().toISOString().split('T')[0],
      source: 'manual',
      jobLink: '',
      company: '',
      position: '',
      location: '',
      salary: '',
      type: 'Full-time',
      remote: 'On-site',
      description: '',
      requirements: '',
      selectedResumeId: '',
      notes: '',
      status: 'Applied'
    })
    onClose()
  }

  /* 
    LEARNING COMMENT: Step validation function
    - Validates current step before allowing progression
    - Each step has different required fields:
      * Step 1: Must have date and either manual entry or valid link
      * Step 2: Must have company and position (core job info)
      * Step 3: Optional fields (description, requirements)
      * Step 4: Optional fields (resume selection, notes)
    - Prevents users from skipping required information
  */
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.applicationDate && (formData.source === 'manual' || formData.jobLink)
      case 2:
        return formData.company && formData.position
      case 3:
        return true // Optional fields
      case 4:
        return true // Optional fields
      default:
        return false
    }
  }

  /* 
    LEARNING COMMENT: Future feature - job link parsing
    - Placeholder function for extracting job details from URLs
    - Could integrate with job board APIs to auto-fill form data
    - Currently just logs the URL for future development
  */
  const fetchJobDetails = async () => {
    if (formData.jobLink) {
      // Placeholder for future job link parsing
      // This would extract job details from the URL
      console.log('Fetching job details from:', formData.jobLink)
    }
  }

  /* 
    LEARNING COMMENT: Conditional rendering guard
    - Return null if modal is closed (no DOM elements rendered)
    - React convention for conditional component rendering
    - Prevents unnecessary DOM manipulation when modal is hidden
  */
  if (!isOpen) return null

  return (
    /* 
      LEARNING COMMENT: Modal overlay structure
      - fixed: Positions modal overlay relative to viewport (not page scroll)
      - inset-0: Sets top/right/bottom/left to 0 (full screen coverage)
      - bg-black bg-opacity-50: Semi-transparent black backdrop
      - flex items-center justify-center: Centers modal content both horizontally and vertically
      - z-50: High z-index ensures modal appears above all other content
    */
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* 
        LEARNING COMMENT: Modal content container
        - bg-white dark:bg-gray-800: White background with dark theme support
        - rounded-2xl: Large rounded corners (16px radius) for modern look
        - shadow-2xl: Large drop shadow for depth and focus
        - p-6: 1.5rem padding on all sides for content spacing
        - w-full max-w-2xl: Full width up to 42rem (672px) maximum
        - mx-4: 1rem horizontal margin for mobile spacing
        - border-2: 2px border thickness for definition
        - border-slate-300 dark:border-gray-600: Light gray border with dark theme variant
        - max-h-[90vh]: Maximum height of 90% viewport height
        - overflow-y-auto: Vertical scrolling if content exceeds max height
      */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4 border-2 border-slate-300 dark:border-gray-600 max-h-[90vh] overflow-y-auto">
        
        {/* 
          LEARNING COMMENT: Modal header section
          - Contains title, step indicator, and close button
          - flex justify-between: Spreads items to opposite ends
          - items-center: Vertically aligns items in the center
          - mb-6: 1.5rem bottom margin for separation from content
        */}
        <div className="flex justify-between items-center mb-6">
          {/* 
            LEARNING COMMENT: Title and step indicator container
            - Groups related title elements together
            - No specific styling classes - relies on content styling
          */}
          <div>
            {/* 
              LEARNING COMMENT: Main modal title
              - text-2xl: Font size of 1.5rem (24px)
              - font-semibold: Semi-bold font weight (600)
              - text-slate-800 dark:text-slate-200: Dark gray text with light theme in dark mode
              - Clearly identifies the modal's purpose
            */}
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Add Job Application</h2>
            
            {/* 
              LEARNING COMMENT: Step progress indicator
              - text-sm: Small font size (0.875rem/14px)
              - text-slate-600 dark:text-slate-400: Medium gray text with dark theme variant
              - Shows current step vs total steps (e.g., "Step 2 of 4")
              - Helps users understand progress through the wizard
            */}
            <p className="text-sm text-slate-600 dark:text-slate-400">Step {currentStep} of {totalSteps}</p>
          </div>
          
          {/* 
            LEARNING COMMENT: Close button (X icon)
            - onClick={resetForm}: Calls resetForm to close modal and clear data
            - text-slate-500: Medium gray color for subtle appearance
            - hover:text-slate-700 dark:hover:text-slate-200: Darker on hover with dark theme
            - transition-colors: Smooth color change animation on hover
            - SVG icon creates professional X symbol for closing
          */}
          <button
            onClick={resetForm}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            {/* 
              LEARNING COMMENT: X (close) icon SVG
              - w-6 h-6: 24px x 24px size
              - fill="currentColor": Uses the button's text color
              - viewBox="0 0 20 20": SVG coordinate system
              - Path creates X shape with hover states
            */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>

        {/* 
          LEARNING COMMENT: Progress bar section
          - Visual indicator showing user's progress through the 4-step wizard
          - mb-8: 2rem bottom margin for separation from step content
        */}
        <div className="mb-8">
          {/* 
            LEARNING COMMENT: Progress bar container
            - flex items-center: Horizontal layout with vertical centering
            - Contains numbered steps and connecting lines
          */}
          <div className="flex items-center">
            {/* 
              LEARNING COMMENT: Dynamic step generation
              - Array.from({ length: totalSteps }): Creates array with 4 elements [undefined, undefined, undefined, undefined]
              - (_, i): Destructures to ignore value, use index for step numbers
              - Maps over array to create step indicators dynamically
              - key={i}: React key for efficient re-rendering
              - flex items-center flex-1: Each step takes equal space and centers content
            */}
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center flex-1">
                {/* 
                  LEARNING COMMENT: Individual step circle
                  - w-8 h-8: 32px x 32px circle size
                  - rounded-full: Makes div completely circular
                  - flex items-center justify-center: Centers number inside circle
                  - text-sm font-medium: Small, medium-weight text for step number
                  - Conditional styling based on step completion:
                    * i + 1 <= currentStep: If this step is current or completed
                    * bg-slate-600 text-white: Dark background with white text (completed/current)
                    * bg-slate-200 text-slate-500: Light background with gray text (not reached)
                    * dark: variants for dark theme support
                */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= currentStep
                      ? 'bg-slate-600 text-white'
                      : 'bg-slate-200 dark:bg-gray-600 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {/* 
                    LEARNING COMMENT: Step number display
                    - Shows step number (1, 2, 3, 4)
                    - i + 1: Convert 0-based index to 1-based step number
                  */}
                  {i + 1}
                </div>
                
                {/* 
                  LEARNING COMMENT: Connecting line between steps
                  - Only renders if not the last step (i < totalSteps - 1)
                  - flex-1: Takes available space between step circles
                  - h-1: 4px height for thin line
                  - mx-2: 0.5rem horizontal margin for spacing from circles
                  - Conditional styling based on completion:
                    * i + 1 < currentStep: If line connects completed steps
                    * bg-slate-600: Dark line for completed connections
                    * bg-slate-200: Light line for incomplete connections
                    * dark: variants for dark theme
                */}
                {i < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      i + 1 < currentStep
                        ? 'bg-slate-600'
                        : 'bg-slate-200 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 
          LEARNING COMMENT: Step content container
          - Contains all step-specific form content
          - mb-8: 2rem bottom margin for separation from navigation buttons
        */}
        <div className="mb-8">
          
          {/* 
            LEARNING COMMENT: Step 1 - Application Details
            - Conditional rendering: only shows when currentStep === 1
            - Handles application date and data source selection (manual vs link)
            - space-y-6: 1.5rem vertical spacing between form sections
          */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* 
                LEARNING COMMENT: Step 1 title
                - text-lg: Large text size (1.125rem/18px)
                - font-medium: Medium font weight (500)
                - text-slate-800 dark:text-slate-200: Dark text with light variant for dark theme
                - Clearly identifies the current step's purpose
              */}
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Application Details</h3>
              
              {/* 
                LEARNING COMMENT: Application Date field section
                - Standard form field container structure
              */}
              <div>
                {/* 
                  LEARNING COMMENT: Date field label
                  - block: Display as block element (full width)
                  - text-sm: Small text size (0.875rem/14px)
                  - font-medium: Medium font weight for emphasis
                  - text-slate-700 dark:text-slate-300: Readable gray with dark theme
                  - mb-2: 0.5rem bottom margin for spacing from input
                */}
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Application Date
                </label>
                
                {/* 
                  LEARNING COMMENT: Date input field
                  - type="date": HTML5 date picker input
                  - name="applicationDate": Form field identifier for handleInputChange
                  - value={formData.applicationDate}: Controlled component (React manages value)
                  - onChange={handleInputChange}: Updates formData when user changes date
                  - w-full: Full width of parent container
                  - px-3 py-2: 0.75rem horizontal and 0.5rem vertical padding
                  - border border-slate-300: 1px light gray border
                  - dark:border-gray-600: Darker border for dark theme
                  - rounded-lg: Large border radius (0.5rem/8px)
                  - focus:outline-none: Remove default browser focus outline
                  - focus:ring-2 focus:ring-slate-500: Custom focus ring (2px slate border)
                  - dark:focus:ring-slate-400: Lighter focus ring for dark theme
                  - bg-white dark:bg-gray-700: Background colors for both themes
                  - text-slate-900 dark:text-slate-100: Text colors for both themes
                  - required: HTML5 form validation
                */}
                <input
                  type="date"
                  name="applicationDate"
                  value={formData.applicationDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              {/* 
                LEARNING COMMENT: Data source selection section
                - Allows user to choose between manual entry or link-based entry
                - Important UX decision point that affects the rest of the form
              */}
              <div>
                {/* 
                  LEARNING COMMENT: Source selection label
                  - Same styling pattern as other labels for consistency
                */}
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  How do you want to add this job?
                </label>
                
                {/* 
                  LEARNING COMMENT: Source option buttons container
                  - grid grid-cols-2: Two-column grid layout
                  - gap-4: 1rem gap between grid items
                  - Creates side-by-side option buttons
                */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* 
                    LEARNING COMMENT: Manual entry option button
                    - type="button": Prevents form submission when clicked
                    - onClick: Updates formData.source to 'manual' and clears jobLink
                    - p-4: 1rem padding on all sides for clickable area
                    - border-2: 2px border for strong visual definition
                    - rounded-lg: Large border radius for modern appearance
                    - text-left: Left-align text content inside button
                    - transition-colors: Smooth color transitions on state changes
                    - Conditional styling based on selection state:
                      * formData.source === 'manual': If this option is selected
                      * border-slate-500 bg-slate-50: Selected state styling
                      * border-slate-300: Default border color
                      * hover:border-slate-400: Hover state for better UX
                      * dark: variants for all states in dark theme
                  */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, source: 'manual', jobLink: '' }))}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.source === 'manual'
                        ? 'border-slate-500 bg-slate-50 dark:border-slate-400 dark:bg-gray-700'
                        : 'border-slate-300 dark:border-gray-600 hover:border-slate-400 dark:hover:border-gray-500'
                    }`}
                  >
                    {/* 
                      LEARNING COMMENT: Manual option content container
                      - flex items-center: Horizontal layout with vertical centering
                      - space-x-3: 0.75rem horizontal spacing between icon and text
                    */}
                    <div className="flex items-center space-x-3">
                      {/* 
                        LEARNING COMMENT: Edit/manual entry icon
                        - w-6 h-6: 24px x 24px icon size
                        - text-slate-600 dark:text-slate-400: Medium gray color
                        - fill="currentColor": Uses parent's text color
                        - SVG path creates pencil/edit icon representing manual entry
                      */}
                      <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                      </svg>
                      
                      {/* 
                        LEARNING COMMENT: Manual option text content
                        - Groups title and description for this option
                      */}
                      <div>
                        {/* 
                          LEARNING COMMENT: Option title
                          - font-medium: Medium font weight for emphasis
                          - text-slate-800 dark:text-slate-200: High contrast readable text
                        */}
                        <p className="font-medium text-slate-800 dark:text-slate-200">Fill Manually</p>
                        
                        {/* 
                          LEARNING COMMENT: Option description
                          - text-xs: Extra small text size (0.75rem/12px)
                          - text-slate-600 dark:text-slate-400: Lower contrast for secondary info
                          - Explains what this option does
                        */}
                        <p className="text-xs text-slate-600 dark:text-slate-400">Enter job details yourself</p>
                      </div>
                    </div>
                  </button>
                  
                  {/* 
                    LEARNING COMMENT: Link-based entry option button
                    - Similar structure to manual option but for job link parsing
                    - onClick: Updates formData.source to 'link' (keeps jobLink for user to fill)
                    - Same conditional styling pattern as manual option
                  */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, source: 'link' }))}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.source === 'link'
                        ? 'border-slate-500 bg-slate-50 dark:border-slate-400 dark:bg-gray-700'
                        : 'border-slate-300 dark:border-gray-600 hover:border-slate-400 dark:hover:border-gray-500'
                    }`}
                  >
                    {/* 
                      LEARNING COMMENT: Link option content container
                      - Same layout structure as manual option for consistency
                    */}
                    <div className="flex items-center space-x-3">
                      {/* 
                        LEARNING COMMENT: Link icon
                        - Same styling as manual icon but different SVG path
                        - Creates chain link icon representing URL/link functionality
                        - fillRule and clipRule: SVG rendering rules for complex paths
                      */}
                      <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path>
                      </svg>
                      
                      {/* 
                        LEARNING COMMENT: Link option text content
                        - Same structure as manual option for UI consistency
                      */}
                      <div>
                        {/* 
                          LEARNING COMMENT: Link option title
                          - Same styling as manual option title
                        */}
                        <p className="font-medium text-slate-800 dark:text-slate-200">From Job Link</p>
                        
                        {/* 
                          LEARNING COMMENT: Link option description
                          - Explains that user will paste a job posting URL
                        */}
                        <p className="text-xs text-slate-600 dark:text-slate-400">Paste job posting URL</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 
                LEARNING COMMENT: Conditional job link input section
                - Only renders when user selects 'link' option (formData.source === 'link')
                - Provides URL input field and fetch button for future job parsing feature
              */}
              {formData.source === 'link' && (
                <div>
                  {/* 
                    LEARNING COMMENT: Job link field label
                    - Same styling pattern as other labels for consistency
                  */}
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Job Posting URL
                  </label>
                  
                  {/* 
                    LEARNING COMMENT: URL input and fetch button container
                    - flex: Horizontal layout for input and button
                    - space-x-2: 0.5rem horizontal spacing between elements
                  */}
                  <div className="flex space-x-2">
                    {/* 
                      LEARNING COMMENT: URL input field
                      - type="url": HTML5 URL validation and mobile keyboard optimization
                      - name="jobLink": Form field identifier for handleInputChange
                      - value={formData.jobLink}: Controlled component value
                      - onChange={handleInputChange}: Updates formData when user types
                      - placeholder: Helpful example of expected URL format
                      - flex-1: Takes remaining space after button
                      - required: HTML5 validation when this input is visible
                      - Same Tailwind styling pattern as other inputs for consistency
                    */}
                    <input
                      type="url"
                      name="jobLink"
                      value={formData.jobLink}
                      onChange={handleInputChange}
                      placeholder="https://company.com/jobs/position"
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                      required
                    />
                    
                    {/* 
                      LEARNING COMMENT: Fetch job details button
                      - type="button": Prevents form submission
                      - onClick={fetchJobDetails}: Calls function to parse job URL (future feature)
                      - px-4 py-2: 1rem horizontal, 0.5rem vertical padding
                      - bg-slate-600 hover:bg-slate-700: Dark background with darker hover
                      - dark:bg-slate-700 dark:hover:bg-slate-600: Dark theme variants
                      - text-white: White text for contrast on dark background
                      - rounded-lg: Large border radius matching other elements
                      - transition-colors: Smooth color transitions on hover
                    */}
                    <button
                      type="button"
                      onClick={fetchJobDetails}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      Fetch
                    </button>
                  </div>
                  
                  {/* 
                    LEARNING COMMENT: Helper text for fetch feature
                    - text-xs: Extra small text size for subtle information
                    - text-slate-500: Medium gray for secondary information
                    - mt-1: 0.25rem top margin for spacing from input
                    - Explains what the fetch button will do (future functionality)
                  */}
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    We'll try to extract job details automatically
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 
            LEARNING COMMENT: Step 2 - Company & Position Details
            - Conditional rendering: only shows when currentStep === 2
            - Collects core job information: company, position, location, salary, type, work style
            - Uses responsive grid layouts for optimal space usage
            - space-y-6: 1.5rem vertical spacing between form sections
          */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* 
                LEARNING COMMENT: Step 2 title
                - Same styling pattern as Step 1 title for consistency
                - Clearly identifies current step purpose
              */}
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Company & Position Details</h3>
              
              {/* 
                LEARNING COMMENT: Company and Position fields container
                - grid grid-cols-1 md:grid-cols-2: Single column on mobile, two columns on medium+ screens
                - gap-4: 1rem gap between grid items
                - Responsive design for better mobile experience
              */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 
                  LEARNING COMMENT: Company name field section
                  - First major required field for job tracking
                */}
                <div>
                  {/* 
                    LEARNING COMMENT: Company field label
                    - Same label styling pattern used throughout the form
                  */}
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Company Name
                  </label>
                  
                  {/* 
                    LEARNING COMMENT: Company name input
                    - type="text": Standard text input
                    - name="company": Maps to formData.company for state management
                    - value={formData.company}: Controlled component value
                    - onChange={handleInputChange}: Updates state on input changes
                    - placeholder: Helpful example of expected input format
                    - w-full: Full width of parent grid cell
                    - required: HTML5 validation (must be filled to proceed)
                    - Same comprehensive Tailwind styling as other inputs
                  */}
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g. TechCorp Inc."
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                
                {/* 
                  LEARNING COMMENT: Position title field section
                  - Second major required field for job tracking
                  - Same structure as company field for consistency
                */}
                <div>
                  {/* 
                    LEARNING COMMENT: Position field label
                    - Consistent label styling throughout form
                  */}
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Position Title
                  </label>
                  
                  {/* 
                    LEARNING COMMENT: Position title input
                    - name="position": Maps to formData.position
                    - placeholder: Shows example of expected job title format
                    - required: Must be filled for form validation
                    - Same styling and functionality as company input
                  */}
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              {/* 
                LEARNING COMMENT: Location field section
                - Single full-width field for job location
                - Optional field (no required attribute)
              */}
              <div>
                {/* 
                  LEARNING COMMENT: Location field label
                  - Consistent styling with other form labels
                */}
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Location
                </label>
                
                {/* 
                  LEARNING COMMENT: Location input field
                  - name="location": Maps to formData.location
                  - placeholder: Shows example city, state format
                  - No required attribute - location is optional information
                  - w-full: Takes full width of container (not in grid)
                  - Same styling pattern as other text inputs
                */}
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* 
                LEARNING COMMENT: Additional job details container
                - grid grid-cols-1 md:grid-cols-3: Single column mobile, three columns medium+ screens
                - gap-4: 1rem spacing between grid items
                - Groups salary, job type, and work style for efficient space usage
              */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 
                  LEARNING COMMENT: Salary range field section
                  - Optional field for compensation tracking
                */}
                <div>
                  {/* 
                    LEARNING COMMENT: Salary field label
                    - Same styling pattern as other labels
                  */}
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Salary Range
                  </label>
                  
                  {/* 
                    LEARNING COMMENT: Salary input field
                    - type="text": Text input allows flexible salary formats ($120k, $120,000, etc.)
                    - name="salary": Maps to formData.salary
                    - placeholder: Shows example salary range format
                    - Optional field (no required attribute)
                    - w-full: Full width of grid cell
                  */}
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g. $120k - $150k"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                
                {/* 
                  LEARNING COMMENT: Job type field section
                  - Dropdown selection for employment type
                  - Provides common job type options
                */}
                <div>
                  {/* 
                    LEARNING COMMENT: Job type field label
                    - Consistent styling with other form labels
                  */}
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Job Type
                  </label>
                  
                  {/* 
                    LEARNING COMMENT: Job type select dropdown
                    - name="type": Maps to formData.type
                    - value={formData.type}: Controlled component (defaults to 'Full-time')
                    - onChange={handleInputChange}: Updates state when selection changes
                    - w-full: Full width of grid cell
                    - Same styling as text inputs for visual consistency
                    - Contains predefined options for common employment types
                  */}
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                  >
                    {/* 
                      LEARNING COMMENT: Job type options
                      - Pre-defined employment types for consistency
                      - value attributes must match exactly for controlled component
                      - Covers most common employment arrangements
                    */}
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                {/* 
                  LEARNING COMMENT: Work style field section
                  - Dropdown for remote work preferences
                  - Important modern job tracking feature
                */}
                <div>
                  {/* 
                    LEARNING COMMENT: Work style field label
                    - Consistent styling with other form labels
                  */}
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Work Style
                  </label>
                  
                  {/* 
                    LEARNING COMMENT: Work style select dropdown
                    - name="remote": Maps to formData.remote (note: field name is 'remote' but contains work style)
                    - value={formData.remote}: Controlled component (defaults to 'On-site')
                    - onChange={handleInputChange}: Updates state when selection changes
                    - Same styling as job type select for consistency
                    - Contains three main work arrangement options
                  */}
                  <select
                    name="remote"
                    value={formData.remote}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                  >
                    {/* 
                      LEARNING COMMENT: Work style options
                      - Covers the three main post-pandemic work arrangements
                      - value attributes must match formData.remote values
                    */}
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 
            LEARNING COMMENT: Step 3 - Job Details
            - Conditional rendering: only shows when currentStep === 3
            - Collects detailed job information: description and requirements
            - Both fields are optional but helpful for job tracking
            - Uses textarea inputs for longer text content
          */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* 
                LEARNING COMMENT: Step 3 title
                - Same styling pattern as other step titles for consistency
              */}
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Job Details</h3>
              
              {/* 
                LEARNING COMMENT: Job description field section
                - Optional field for storing job posting details
                - Helps users remember what the job was about
              */}
              <div>
                {/* 
                  LEARNING COMMENT: Job description field label
                  - Consistent label styling throughout form
                */}
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Job Description
                </label>
                
                {/* 
                  LEARNING COMMENT: Job description textarea
                  - textarea element: Multi-line text input for longer content
                  - name="description": Maps to formData.description
                  - value={formData.description}: Controlled component value
                  - onChange={handleInputChange}: Updates state on text changes
                  - placeholder: Helpful guidance for what to include
                  - rows="4": Sets initial height to 4 text lines
                  - w-full: Full width of container
                  - Same styling pattern as text inputs but adapted for textarea
                  - No required attribute - this is optional information
                */}
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the role and responsibilities..."
                  rows="4"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* 
                LEARNING COMMENT: Requirements field section
                - Optional field for job requirements and skills
                - Helps track what skills were needed for analysis
              */}
              <div>
                {/* 
                  LEARNING COMMENT: Requirements field label
                  - Same styling as other labels for consistency
                */}
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Requirements & Skills
                </label>
                
                {/* 
                  LEARNING COMMENT: Requirements textarea
                  - Same structure and styling as description textarea
                  - name="requirements": Maps to formData.requirements
                  - placeholder: Guides user on what content to include
                  - rows="4": Same height as description for visual consistency
                  - Optional field for user convenience
                */}
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="Required skills, experience, technologies, etc..."
                  rows="4"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {/* 
            LEARNING COMMENT: Step 4 - Resume & Notes
            - Conditional rendering: only shows when currentStep === 4
            - Final step for resume selection, status setting, and additional notes
            - All fields are optional but helpful for comprehensive job tracking
            - Integrates with resume management system
          */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* 
                LEARNING COMMENT: Step 4 title
                - Same styling pattern as other step titles for consistency
              */}
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Resume & Notes</h3>
              
              {/* 
                LEARNING COMMENT: Resume selection field section
                - Allows linking job application to a specific resume
                - Conditional rendering based on available resumes
              */}
              <div>
                {/* 
                  LEARNING COMMENT: Resume selection field label
                  - Consistent label styling throughout form
                */}
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Resume
                </label>
                
                {/* 
                  LEARNING COMMENT: Conditional resume selection UI
                  - Shows dropdown if resumes exist, empty state if none
                  - resumes.length > 0: Checks if user has uploaded any resumes
                  - Provides helpful guidance when no resumes are available
                */}
                {resumes.length > 0 ? (
                  /* 
                    LEARNING COMMENT: Resume selection dropdown
                    - name="selectedResumeId": Maps to formData.selectedResumeId
                    - value={formData.selectedResumeId}: Controlled component (starts empty)
                    - onChange={handleInputChange}: Updates state when user selects resume
                    - w-full: Full width of container
                    - Same styling as other select elements for consistency
                  */
                  <select
                    name="selectedResumeId"
                    value={formData.selectedResumeId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                  >
                    {/* 
                      LEARNING COMMENT: Default option for resume selection
                      - value="": Empty value represents no selection
                      - Provides clear placeholder text for user guidance
                    */}
                    <option value="">Select a resume...</option>
                    
                    {/* 
                      LEARNING COMMENT: Dynamic resume options
                      - resumes.map(): Iterates through available resumes array
                      - key={resume.id}: React key for efficient re-rendering
                      - value={resume.id}: Option value matches resume identifier
                      - {resume.name}: Display text shows resume name to user
                    */}
                    {resumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  /* 
                    LEARNING COMMENT: Empty state for no resumes
                    - Displays when user hasn't uploaded any resumes yet
                    - p-4: 1rem padding for comfortable spacing
                    - border-2 border-dashed: 2px dashed border for visual distinction
                    - border-slate-300 dark:border-gray-600: Gray border with dark theme
                    - rounded-lg: Large border radius matching other elements
                    - text-center: Center-aligned text for empty state presentation
                  */
                  <div className="p-4 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg text-center">
                    {/* 
                      LEARNING COMMENT: Primary empty state message
                      - text-slate-600 dark:text-slate-400: Medium gray for main message
                      - mb-2: 0.5rem bottom margin for spacing from secondary message
                    */}
                    <p className="text-slate-600 dark:text-slate-400 mb-2">No resumes uploaded yet</p>
                    
                    {/* 
                      LEARNING COMMENT: Secondary guidance message
                      - text-sm: Small text size for secondary information
                      - text-slate-500: Lighter gray for less emphasis
                      - Guides user on what action to take
                    */}
                    <p className="text-sm text-slate-500 dark:text-slate-500">Upload a resume first to select it for this application</p>
                  </div>
                )}
              </div>

              {/* 
                LEARNING COMMENT: Application status field section
                - Allows setting initial status for the job application
                - Important for tracking workflow and progress
              */}
              <div>
                {/* 
                  LEARNING COMMENT: Status field label
                  - Consistent styling with other form labels
                */}
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Application Status
                </label>
                
                {/* 
                  LEARNING COMMENT: Status selection dropdown
                  - name="status": Maps to formData.status
                  - value={formData.status}: Controlled component (defaults to 'Applied')
                  - onChange={handleInputChange}: Updates state when status changes
                  - Same styling as other select elements for consistency
                  - Contains comprehensive status options for job application workflow
                */}
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                >
                  {/* 
                    LEARNING COMMENT: Application status options
                    - Covers complete job application lifecycle
                    - value attributes must match formData.status values
                    - Organized from initial application through final outcomes
                    - Includes multiple interview stages for comprehensive tracking
                  */}
                  <option value="Applied">Applied</option>
                  <option value="Pending">Pending</option>
                  <option value="First Interview">First Interview</option>
                  <option value="Second Interview">Second Interview</option>
                  <option value="Third Interview">Third Interview</option>
                  <option value="Final Interview">Final Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* 
                LEARNING COMMENT: Notes field section
                - Optional field for additional information about the application
                - Helpful for storing personal observations, follow-up reminders, etc.
              */}
              <div>
                {/* 
                  LEARNING COMMENT: Notes field label
                  - Consistent styling with other form labels
                */}
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notes
                </label>
                
                {/* 
                  LEARNING COMMENT: Notes textarea
                  - textarea element: Multi-line text input for longer notes
                  - name="notes": Maps to formData.notes
                  - value={formData.notes}: Controlled component value
                  - onChange={handleInputChange}: Updates state when user types
                  - placeholder: Helpful guidance for what to include in notes
                  - rows="4": Sets initial height to 4 text lines
                  - Same styling as other textarea elements for consistency
                  - No required attribute - notes are optional
                */}
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes about this application..."
                  rows="4"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* 
          LEARNING COMMENT: Navigation buttons section
          - Controls wizard flow and form submission
          - flex justify-between: Spreads Previous button left and action buttons right
          - Contains Previous, Cancel, and Next/Submit buttons with intelligent behavior
        */}
        <div className="flex justify-between">
          {/* 
            LEARNING COMMENT: Previous step button
            - type="button": Prevents form submission when clicked
            - onClick={handlePrevious}: Calls function to go back one step
            - disabled={currentStep === 1}: Disabled on first step (can't go back further)
            - px-4 py-2: 1rem horizontal, 0.5rem vertical padding
            - text-slate-700 dark:text-slate-300: Dark gray text with light variant for dark theme
            - bg-slate-100 dark:bg-gray-700: Light gray background with dark theme variant
            - hover:bg-slate-200 dark:hover:bg-gray-600: Slightly darker on hover
            - rounded-lg: Large border radius for modern appearance
            - transition-colors: Smooth color transitions for better UX
            - border border-slate-300 dark:border-gray-600: Subtle border definition
            - disabled:opacity-50: 50% opacity when disabled for visual feedback
            - disabled:cursor-not-allowed: Changes cursor to indicate button is disabled
          */}
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-slate-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {/* 
            LEARNING COMMENT: Right-side action buttons container
            - flex space-x-3: Horizontal layout with 0.75rem spacing between buttons
            - Contains Cancel button and either Next or Submit button
          */}
          <div className="flex space-x-3">
            {/* 
              LEARNING COMMENT: Cancel button
              - type="button": Prevents form submission
              - onClick={resetForm}: Calls function to reset form and close modal
              - Same styling as Previous button for consistency
              - Always available on all steps for user convenience
            */}
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-slate-300 dark:border-gray-600"
            >
              Cancel
            </button>
            
            {/* 
              LEARNING COMMENT: Conditional primary action button
              - Shows either "Add Application" or "Next" based on current step
              - currentStep === totalSteps: Checks if on final step (4)
              - Provides appropriate action for user's current position in wizard
            */}
            {currentStep === totalSteps ? (
              /* 
                LEARNING COMMENT: Final submit button (Step 4)
                - type="button": Prevents default form submission, uses custom handler
                - onClick={handleSubmit}: Calls function to save job application
                - px-4 py-2: Same padding as other buttons for consistency
                - bg-slate-600 hover:bg-slate-700: Dark background with darker hover
                - dark:bg-slate-700 dark:hover:bg-slate-600: Dark theme variants
                - text-white: White text for contrast on dark background
                - rounded-lg: Large border radius matching other buttons
                - transition-colors: Smooth color transitions
                - No disabled state - final step submission is always available
              */
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Add Application
              </button>
            ) : (
              /* 
                LEARNING COMMENT: Next step button (Steps 1-3)
                - type="button": Prevents form submission, handles step progression
                - onClick={handleNext}: Calls function to advance to next step
                - disabled={!isStepValid()}: Disabled if current step validation fails
                - Same primary button styling as submit button
                - disabled:opacity-50 disabled:cursor-not-allowed: Visual feedback when disabled
                - Validation prevents users from skipping required information
              */
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* 
  LEARNING COMMENT: Component export
  - export default AddJobModal: Makes component available for import in other files
  - Default export allows importing with any name: import MyJobModal from './AddJobModal'
  - This component would typically be imported and used in a parent component like Jobs.jsx
*/
export default AddJobModal
