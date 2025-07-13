import { useState } from 'react'

function Jobs() {
  const [jobs] = useState([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      status: 'Second Interview',
      appliedDate: '2024-01-20',
      matchScore: 85,
      salary: '$120k - $150k',
      location: 'San Francisco, CA',
      type: 'Full-time',
      remote: 'Hybrid',
      description: 'Lead frontend development using React and TypeScript',
      requirements: 'React, TypeScript, 5+ years experience',
      notes: 'Technical round completed, culture fit interview next'
    },
    {
      id: 2,
      title: 'React Developer',
      company: 'StartupXYZ',
      status: 'Pending',
      appliedDate: '2024-01-18',
      matchScore: 92,
      salary: '$100k - $130k',
      location: 'Austin, TX',
      type: 'Full-time',
      remote: 'Remote',
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
      remote: 'On-site',
      description: 'Develop end-to-end solutions using modern technologies',
      requirements: 'React, Node.js, Python, AWS',
      notes: 'Phone screening scheduled for next week'
    },
    {
      id: 4,
      title: 'UI/UX Developer',
      company: 'DesignHub',
      status: 'Rejected',
      appliedDate: '2024-01-12',
      matchScore: 65,
      salary: '$90k - $110k',
      location: 'New York, NY',
      type: 'Contract',
      remote: 'Hybrid',
      description: 'Create beautiful user interfaces and experiences',
      requirements: 'React, CSS, Design Systems, Figma',
      notes: 'Portfolio did not meet requirements'
    },
    {
      id: 5,
      title: 'Backend Engineer',
      company: 'DataCorp',
      status: 'Third Interview',
      appliedDate: '2024-01-10',
      matchScore: 88,
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
      status: 'Applied',
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

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-light text-slate-700 dark:text-slate-300 mb-2">Job Applications</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-light">Detailed view of all your job applications and their progress</p>
          </div>
          <button className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
            </svg>
            <span>Add New Application</span>
          </button>
        </div>

        {/* Detailed Jobs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-300 dark:border-gray-600">
          <div className="px-8 py-6 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b-2 border-slate-300 dark:border-gray-600">
            <h2 className="text-2xl font-light text-slate-700 dark:text-slate-300 mb-2">All Applications</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-light">Comprehensive details for each job application</p>
          </div>
          
          <div className="overflow-x-auto bg-white dark:bg-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-200 dark:bg-gray-700 border-b-2 border-slate-400 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
                      </svg>
                      <span>Position Details</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"></path>
                      </svg>
                      <span>Company & Salary</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                      </svg>
                      <span>Status & Progress</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                      </svg>
                      <span>Work Details</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd"></path>
                      </svg>
                      <span>Match & Date</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                      </svg>
                      <span>Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-slate-300 dark:divide-gray-600">
                {jobs.map((job, index) => (
                  <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-300 border-l-4 border-transparent hover:border-l-slate-400 dark:hover:border-l-gray-500">
                    <td className="px-6 py-6">
                      <div className="text-lg font-semibold text-slate-800 dark:text-slate-200">{job.title}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{job.description}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-2 bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded inline-block">
                        {job.requirements}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-lg text-slate-800 dark:text-slate-200 font-semibold">{job.company}</div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">{job.salary}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{job.location}</div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 text-sm font-medium rounded-lg ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">{job.notes}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{job.type}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{job.remote}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-20 bg-slate-300 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all duration-700"
                            style={{ width: `${job.matchScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{job.matchScore}%</span>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{job.appliedDate}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex space-x-2">
                        <button className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 p-2 rounded-lg transition-all duration-300 border border-slate-300 dark:border-gray-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                          </svg>
                        </button>
                        <button className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 p-2 rounded-lg transition-all duration-300 border border-slate-300 dark:border-gray-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                          </svg>
                        </button>
                        <button className="bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 p-2 rounded-lg transition-all duration-300 border border-slate-300 dark:border-gray-600">
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
      </div>
    </div>
  )
}

export default Jobs
