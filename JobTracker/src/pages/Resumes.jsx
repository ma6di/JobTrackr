import { useState } from 'react'

function Resumes() {
  const [resumes] = useState([
    { 
      id: 1, 
      name: 'Software Engineer Resume', 
      uploadDate: '2024-01-15', 
      fileSize: '245 KB',
      format: 'PDF',
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

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-light text-slate-700 dark:text-slate-300 mb-2">My Resumes</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-light">Manage and organize your resume versions</p>
          </div>
          <button className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
            </svg>
            <span>Upload New Resume</span>
          </button>
        </div>

        {/* Resume Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <div key={resume.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-slate-300 dark:border-gray-600 hover:border-slate-400 dark:hover:border-gray-500">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300">
                  <svg className="w-5 h-5 text-slate-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="flex space-x-1">
                  <button className="w-7 h-7 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg flex items-center justify-center transition-all duration-200">
                    <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                  <button className="w-7 h-7 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 rounded-lg flex items-center justify-center transition-all duration-200">
                    <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                  <button className="w-7 h-7 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 rounded-lg flex items-center justify-center transition-all duration-200">
                    <svg className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">{resume.name}</h3>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div className="flex items-center space-x-2">
                  <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg>
                  <span>Uploaded: {resume.uploadDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13V12a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                  <span>Size: {resume.fileSize}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                  </svg>
                  <span>Format: {resume.format}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd"></path>
                    <path fillRule="evenodd" d="M15 7h1a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-1h8a2 2 0 002-2V7z" clipRule="evenodd"></path>
                  </svg>
                  <span>Pages: {resume.pages}</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Resume Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 border-2 border-dashed border-slate-400 dark:border-gray-600 hover:border-slate-500 dark:hover:border-gray-500 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer transform hover:-translate-y-1 hover:shadow-3xl">
            <div className="w-12 h-12 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3 transition-colors duration-300">
              <svg className="w-6 h-6 text-slate-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">Upload New Resume</h3>
            <p className="text-xs text-slate-500 dark:text-slate-500">Click to add a new resume version</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resumes
