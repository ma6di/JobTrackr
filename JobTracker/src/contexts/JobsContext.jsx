// 📚 LEARNING: React Hooks Import - These are special React functions for managing state
// createContext: Creates a "data storage box" that components can access globally
// useContext: Allows components to "read" data from a context box
// useState: Creates variables that can change and automatically update the UI
import { createContext, useContext, useState } from 'react'

// 💼 LEARNING: Jobs Context Creation - This creates a global "storage box" for job application data
// Think of this as a central database that any component in the app can read from or write to
// 🔄 EFFECT: This allows job data to be shared between Dashboard, Jobs page, and any other component
const JobsContext = createContext()

// 🪝 LEARNING: Custom Hook - A reusable function that components can use to access job data
// This hook makes it easy for any component to get job data and functions
// 🔄 USAGE: Any component can call useJobs() to get all job-related data and functions
export const useJobs = () => {
  // 📖 Reading data from the JobsContext "storage box"
  const context = useContext(JobsContext)
  
  // ⚠️ LEARNING: Error Handling - Prevents crashes if hook is used incorrectly
  // If a component tries to use useJobs() but isn't wrapped in JobsProvider, show helpful error
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider')
  }
  
  // 📤 Return all the job data and functions to the component that called this hook
  return context
}

// 💼 LEARNING: Jobs Provider Component - This wraps parts of the app to provide job data
// { children } contains all the components that will have access to job data
export const JobsProvider = ({ children }) => {
  
  // 📊 LEARNING: Jobs State - Stores all job application data
  // This is an array of job objects, each representing one job application
  // useState([...]) creates state with initial sample data
  // 🔄 EFFECT: Change any values below to see different data in the app
  const [jobs, setJobs] = useState([
    {
      id: 1,                                    // 🆔 Unique identifier for each job application
      title: 'Senior Frontend Developer',      // 💼 Job position title
      company: 'TechCorp Inc.',                 // 🏢 Company name
      status: 'Second Interview',              // 📊 Current application status
      appliedDate: '2024-01-20',               // 📅 When you applied (YYYY-MM-DD format)
      matchScore: 85,                          // 📈 How well your skills match (0-100%)
      salary: '$120k - $150k',                 // 💰 Salary range
      location: 'San Francisco, CA',           // 📍 Job location
      type: 'Full-time',                       // 📋 Employment type
      remote: 'Hybrid',                        // 🏠 Remote work options
      description: 'Lead frontend development using React and TypeScript',  // 📝 Job description
      requirements: 'React, TypeScript, 5+ years experience',              // 📋 Required skills
      notes: 'Technical round completed, culture fit interview next'        // 📝 Personal notes
    },
    {
      id: 2,
      title: 'React Developer',
      company: 'StartupXYZ',
      status: 'Pending',                       // 🔄 Different status for variety
      appliedDate: '2024-01-18',
      matchScore: 92,                          // 📈 Higher match score
      salary: '$100k - $130k',
      location: 'Austin, TX',
      type: 'Full-time',
      remote: 'Remote',                        // 🌐 Fully remote position
      description: 'Build scalable React applications for growing startup',
      requirements: 'React, JavaScript, Node.js',
      notes: 'Waiting for response after initial application'
    },
    {
      id: 3,
      title: 'Full Stack Engineer',
      company: 'BigTech Solutions',
      status: 'First Interview',
      appliedDate: '2024-01-15',
      matchScore: 78,
      salary: '$130k - $160k',
      location: 'Seattle, WA',
      type: 'Full-time',
      remote: 'On-site',                       // 🏢 Office-based position
      description: 'Develop end-to-end solutions using modern technologies',
      requirements: 'React, Node.js, Python, AWS',
      notes: 'Phone screening scheduled for next week'
    },
    {
      id: 4,
      title: 'UI/UX Developer',
      company: 'DesignHub',
      status: 'Rejected',                      // ❌ Shows rejected status styling
      appliedDate: '2024-01-12',
      matchScore: 65,                          // 📉 Lower match score
      salary: '$90k - $110k',
      location: 'New York, NY',
      type: 'Contract',                        // 📋 Contract vs full-time
      remote: 'Hybrid',
      description: 'Create beautiful user interfaces and experiences',
      requirements: 'React, CSS, Design Systems, Figma',
      notes: 'Portfolio did not meet requirements'
    },
    {
      id: 5,
      title: 'Backend Engineer',
      company: 'DataCorp',
      status: 'Third Interview',               // 🎯 Advanced interview stage
      appliedDate: '2024-01-10',
      matchScore: 88,                          // 📈 High match score
      salary: '$140k - $170k',
      location: 'Denver, CO',
      type: 'Full-time',
      remote: 'Remote',
      description: 'Build robust backend systems and APIs',
      requirements: 'Python, Docker, Kubernetes, PostgreSQL',
      notes: 'Final round with CTO this Friday'
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'CloudScale',
      status: 'Applied',                       // 📤 Recently submitted application
      appliedDate: '2024-01-08',
      matchScore: 73,
      salary: '$110k - $140k',
      location: 'Portland, OR',
      type: 'Full-time',
      remote: 'Hybrid',
      description: 'Manage cloud infrastructure and deployment pipelines',
      requirements: 'AWS, Terraform, Jenkins, Monitoring',
      notes: 'Application submitted via LinkedIn'
    }
  ])

  // 📝 LEARNING: Add Job Function - Creates a new job application
  // This function takes job data from a form and adds it to the jobs array
  // 🔄 EFFECT: When called, this adds a new job to the list and updates the UI
  const addJob = (jobData) => {
    // 🆔 LEARNING: Creating New Job Object - Combines form data with generated fields
    const newJob = {
      id: Date.now(),                          // 🆔 Generate unique ID using current timestamp
      title: jobData.position,                 // 💼 Job title from form
      company: jobData.company,                // 🏢 Company name from form
      status: jobData.status,                  // 📊 Initial status from form
      appliedDate: jobData.applicationDate,    // 📅 Application date from form
      matchScore: Math.floor(Math.random() * 30) + 70,  // 📈 Random score 70-100% for demo
      salary: jobData.salary,                  // 💰 Salary range from form
      location: jobData.location,              // 📍 Job location from form
      type: jobData.type,                      // 📋 Employment type from form
      remote: jobData.remote,                  // 🏠 Remote work option from form
      description: jobData.description,        // 📝 Job description from form
      requirements: jobData.requirements,      // 📋 Required skills from form
      notes: jobData.notes                     // 📝 Personal notes from form
    }
    
    // 📊 LEARNING: State Update - Add new job to existing jobs array
    // setJobs(prev => [...prev, newJob]) means:
    // - prev = current jobs array
    // - [...prev, newJob] = copy all existing jobs + add new job at end
    // 🔄 EFFECT: This triggers a re-render of all components using job data
    setJobs(prev => [...prev, newJob])
    
    // 📤 Return the new job (useful for showing success messages or redirects)
    return newJob
  }

  // ✏️ LEARNING: Update Job Function - Modifies existing job application
  // Takes a job ID and new data, finds the job and updates it
  // 🔄 USAGE: updateJob(5, { status: 'Interview' }) changes job 5's status
  const updateJob = (id, updatedData) => {
    // 📊 LEARNING: Array.map() Pattern - Common way to update items in arrays
    // .map() goes through each job and either updates it (if ID matches) or leaves it unchanged
    setJobs(prev => prev.map(job => 
      job.id === id                            // 🔍 Check if this is the job to update
        ? { ...job, ...updatedData }           // ✏️ If yes: copy job + apply updates
        : job                                  // 📋 If no: keep job unchanged
    ))
  }

  // 🗑️ LEARNING: Delete Job Function - Removes job application
  // Takes a job ID and removes that job from the array
  // 🔄 USAGE: deleteJob(3) removes the job with ID 3
  const deleteJob = (id) => {
    // 📊 LEARNING: Array.filter() Pattern - Common way to remove items from arrays
    // .filter() keeps only jobs that DON'T match the ID we want to delete
    setJobs(prev => prev.filter(job => job.id !== id))
  }

  // 📦 LEARNING: Value Object - All data and functions provided to child components
  // Any component using useJobs() will receive all of these
  // 🔄 EFFECT: Add new functions here to make them available throughout the app
  const value = {
    jobs,           // 📊 Array of all job applications
    addJob,         // ➕ Function to add new job
    updateJob,      // ✏️ Function to update existing job
    deleteJob       // 🗑️ Function to delete job
  }

  // 📤 LEARNING: Provider Component Return - Makes all job data available to children
  return (
    // JobsContext.Provider broadcasts all job data and functions to child components
    // Any component wrapped by this provider can access job data using useJobs() hook
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  )
}
