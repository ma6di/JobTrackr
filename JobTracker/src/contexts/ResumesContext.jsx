{/* 
  LEARNING COMMENT: Import statements for React features we need
  - createContext: Creates a React context for sharing data between components without passing props down manually
  - useContext: Hook to consume/read values from a React context
  - useState: Hook to manage component state (data that can change over time)
*/}
import { createContext, useContext, useState } from 'react'

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
*/}
export const ResumesProvider = ({ children }) => {
  {/* 
    LEARNING COMMENT: State for storing all resumes
    - useState hook creates a state variable 'resumes' and a function 'setResumes' to update it
    - Initial value is an array with 2 sample resumes to show the interface
    - Each resume is an object with properties: id, name, uploadDate, fileSize, format, pages
    - In a real app, this data would come from a database/API, but we're starting with mock data
  */}
  const [resumes, setResumes] = useState([
    { 
      // Unique identifier for this resume
      id: 1,
      // Display name for the resume
      name: 'Software Engineer Resume',
      // When this resume was uploaded (YYYY-MM-DD format)
      uploadDate: '2024-01-15',
      // File size in kilobytes for display
      fileSize: '245 KB',
      // File format (PDF, DOC, etc.)
      format: 'PDF',
      // Number of pages in the resume
      pages: 2
    },
    { 
      id: 2, 
      name: 'Frontend Developer Resume', 
      uploadDate: '2024-01-10', 
      fileSize: '189 KB',
      format: 'PDF',
      pages: 1
    },
  ])

  {/* 
    LEARNING COMMENT: Function to add a new resume to the list
    - Takes resumeData parameter (object with resume information from the upload form)
    - Creates a new resume object with a unique ID and formatted data
    - Updates the resumes state array by adding the new resume
    - Returns the new resume object so the calling component knows what was created
  */}
  const addResume = (resumeData) => {
    {/* Create a new resume object with processed data */}
    const newResume = {
      // Use current timestamp as unique ID (simple but effective for demo)
      id: Date.now(),
      // Use the name provided by the user
      name: resumeData.name,
      // Get today's date in YYYY-MM-DD format
      uploadDate: new Date().toISOString().split('T')[0],
      // Calculate file size: if file exists, convert bytes to KB and round, otherwise show "Unknown"
      fileSize: resumeData.file ? `${Math.round(resumeData.file.size / 1024)} KB` : 'Unknown',
      // Determine format: check if file type includes 'pdf', otherwise assume DOC
      format: resumeData.file ? resumeData.file.type.includes('pdf') ? 'PDF' : 'DOC' : 'PDF',
      // Default to 1 page (could be enhanced to read actual page count)
      pages: 1
    }
    
    {/* 
      Update the resumes state using the setter function
      - setResumes takes a function that receives the previous state (prev)
      - We return a new array with all previous resumes plus the new one
      - The spread operator (...prev) copies all existing resumes
      - This creates a new array instead of modifying the old one (React best practice)
    */}
    setResumes(prev => [...prev, newResume])
    
    {/* Return the new resume so the calling component can use it (e.g., to close a modal) */}
    return newResume
  }

  {/* 
    LEARNING COMMENT: Function to update an existing resume
    - Takes id (which resume to update) and updatedData (what to change)
    - Uses the map method to create a new array with the updated resume
    - Only updates the resume that matches the given id, leaves others unchanged
  */}
  const updateResume = (id, updatedData) => {
    setResumes(prev => prev.map(resume => {
      /* 
        For each resume, check if its ID matches the one we want to update
        - If it matches: merge the existing resume with the new data using spread operator
        - If it doesn't match: return the resume unchanged
        - The spread operator {...resume, ...updatedData} combines objects:
          * All properties from resume are copied first
          * All properties from updatedData are copied second (overwriting any duplicates)
      */
      return resume.id === id ? { ...resume, ...updatedData } : resume
    }))
  }

  {/* 
    LEARNING COMMENT: Function to delete a resume
    - Takes id parameter (which resume to remove)
    - Uses the filter method to create a new array without the deleted resume
    - filter keeps only resumes whose id does NOT match the one we want to delete
  */}
  const deleteResume = (id) => {
    setResumes(prev => prev.filter(resume => resume.id !== id))
  }

  {/* 
    LEARNING COMMENT: Create the value object to provide to child components
    - This object contains all the data and functions that components can access
    - By putting everything in one object, components can destructure what they need
    - Example: const { resumes, addResume } = useResumes()
  */}
  const value = {
    // The array of all resumes
    resumes,
    // Function to add a new resume
    addResume,
    // Function to update an existing resume
    updateResume,
    // Function to delete a resume
    deleteResume
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
