import { useState, useEffect } from 'react'

// Simple test component to debug the Jobs page issue
function TestJobs() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false)
      // Add some test data
      setJobs([
        {
          id: 1,
          position: 'Frontend Developer',
          company: 'Tech Corp',
          status: 'Applied',
          appliedAt: new Date().toISOString(),
          matchPercentage: 75
        },
        {
          id: 2,
          position: 'Full Stack Engineer',
          company: 'StartupXYZ',
          status: 'First Interview',
          appliedAt: new Date().toISOString(),
          matchPercentage: 82
        }
      ])
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ Error</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b">
            <h1 className="text-2xl font-semibold text-gray-800">🧪 Test Jobs Page</h1>
            <p className="text-gray-600">This is a simplified version to test if the basic structure works</p>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                ✅ Jobs Page Component Loading Successfully
              </span>
            </div>
            
            <div className="grid gap-4">
              {jobs.map(job => (
                <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{job.position}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {job.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Match</div>
                      <div className="text-lg font-semibold text-green-600">{job.matchPercentage}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <h3 className="font-semibold text-yellow-800">🔍 Debug Information</h3>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                <li>✅ Component rendered successfully</li>
                <li>✅ State management working</li>
                <li>✅ Sample data displaying</li>
                <li>✅ CSS classes applied correctly</li>
              </ul>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400">
              <h3 className="font-semibold text-blue-800">🛠️ Next Steps</h3>
              <p className="mt-2 text-sm text-blue-700">
                If this test page works, the issue might be in the JobsContext, API calls, or complex component logic.
                Try accessing this test at: <code>http://localhost:5173/test-jobs</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestJobs
