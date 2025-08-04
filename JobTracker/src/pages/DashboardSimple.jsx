import { useNavigate } from 'react-router-dom'
import { useJobs } from '../contexts/JobsContext'

function DashboardSimple() {
  const navigate = useNavigate()
  const { jobs = [], loading, error } = useJobs()

  if (loading) {
    return <div className="p-8">Loading jobs...</div>
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">Simple Dashboard</h1>
      <p className="mb-4">Total Jobs: {jobs.length}</p>
      
      {jobs.length > 0 ? (
        <div>
          <h2 className="text-xl mb-2">Recent Jobs:</h2>
          <ul>
            {jobs.slice(0, 3).map((job, index) => (
              <li key={job.id || index} className="mb-2">
                {job.position || job.title || 'Unknown Position'} at {job.company || 'Unknown Company'}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No jobs found.</p>
      )}
      
      <button 
        onClick={() => navigate('/jobs')}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to Jobs
      </button>
    </div>
  )
}

export default DashboardSimple
