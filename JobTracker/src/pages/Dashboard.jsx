import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJobs } from '../contexts/JobsContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts'

// ---- Subcomponents ---- //
const StatsCards = ({ stats }) => {
  const cards = [
    { label: 'Total', value: stats.totalApplications, color: 'slate' },
    { label: 'Pending', value: stats.pending, color: 'amber' },
    { label: 'Interviews', value: stats.interviews, color: 'emerald' },
    { label: 'Rejected', value: stats.rejected, color: 'rose' },
  ]

  return (
    <div className="flex justify-center items-center mb-12">
      <div className="grid grid-cols-4 gap-4 w-fit justify-center">
        {cards.map(card => (
          <div key={card.label} className="bg-gradient-to-br from-white via-slate-50 to-gray-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-4 text-center border border-slate-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm w-28">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{card.label}</span>
              </div>
            </div>
            <div className="text-2xl font-light text-slate-700 dark:text-slate-300 mt-2">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ApplicationsChart = ({ chartData, availableYears, selectedYear, setSelectedYear, monthlyCounts }) => {
  return (
    <div className="mb-12 w-full">
      <div className="flex items-center justify-center gap-4 mb-6">
        <h2 className="text-2xl font-light text-slate-700 dark:text-slate-300">Applications in</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="appearance-none bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-600 rounded-lg px-4 py-2 text-lg font-medium text-slate-700 dark:text-slate-300"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
        Monthly Overview • {monthlyCounts.reduce((sum, count) => sum + count, 0)} total applications
      </p>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" interval={0} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="applications" fill="#8884d8" barSize={30}>
              <LabelList dataKey="applications" position="top" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const RecentJobs = ({ jobs, getStatusColor, navigate }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-300 dark:border-gray-600">
      <div className="px-6 py-4 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b-2 border-slate-300 dark:border-gray-600 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-slate-700 dark:text-slate-300 mb-1">Recent Applications</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-light">Quick overview of your latest job applications</p>
        </div>
        <button onClick={() => navigate('/jobs')} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm">
          View All
        </button>
      </div>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 flex justify-center">
        <table className="min-w-[700px] text-sm text-center">
          <thead className="bg-slate-100 dark:bg-gray-700 border-b-2 border-slate-300 dark:border-gray-600">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Position</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Company</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400">Applied (date)</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-slate-200 dark:divide-gray-600">
            {jobs.length > 0 ? (
              jobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer" onClick={() => navigate('/jobs')}>
                  <td className="px-4 py-4 text-sm text-slate-900 dark:text-slate-200">{job.position || job.title || 'N/A'}</td>
                  <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-300">{job.company || 'N/A'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>{job.status || 'Unknown'}</span>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400">
                    {job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  No job applications yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---- Main Dashboard ---- //
function Dashboard() {
  const navigate = useNavigate()
  const { jobs, loading, error } = useJobs()
  const safeJobs = Array.isArray(jobs) ? jobs : []
  const currentYear = new Date().getFullYear()

  const availableYears = useMemo(() => {
    const years = [...new Set(
      safeJobs
        .map(job => {
          try {
            const applied = job.appliedAt ? new Date(job.appliedAt) : null
            return applied ? applied.getFullYear() : null
          } catch {
            return null
          }
        })
        .filter(year => year !== null)
        .sort((a, b) => b - a)
    )]
    if (years.length === 0) years.push(currentYear)
    return years
  }, [safeJobs, currentYear])

  const [selectedYear, setSelectedYear] = useState(() => availableYears[0] || currentYear)

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0])
    }
  }, [availableYears, selectedYear])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-600">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>

  const stats = {
    totalApplications: safeJobs.length,
    pending: safeJobs.filter(job => job.status && ['Applied', 'Pending'].includes(job.status)).length,
    interviews: safeJobs.filter(job => job.status && job.status.includes('Interview')).length,
    rejected: safeJobs.filter(job => job.status === 'Rejected').length,
  }

  const monthlyCounts = Array(12).fill(0)
  safeJobs.forEach(job => {
    try {
      const applied = job.appliedAt ? new Date(job.appliedAt) : null
      if (!applied || applied.getFullYear() !== selectedYear) return
      monthlyCounts[applied.getMonth()] += 1
    } catch {}
  })

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const chartData = months.map((month, idx) => ({ month, applications: monthlyCounts[idx] }))

  const recentJobs = [...safeJobs]
    .sort((a, b) => new Date(b.appliedAt || b.createdAt || 0) - new Date(a.appliedAt || a.createdAt || 0))
    .slice(0, 5)

  const getStatusColor = (status) => {
    switch (status) {
      case 'First Interview': return 'bg-emerald-100 text-emerald-800'
      case 'Second Interview': return 'bg-teal-100 text-teal-800'
      case 'Third Interview': return 'bg-cyan-100 text-cyan-800'
      case 'Final Interview': return 'bg-indigo-100 text-indigo-800'
      case 'Pending': return 'bg-amber-100 text-amber-800'
      case 'Applied': return 'bg-blue-100 text-blue-800'
      case 'Rejected': return 'bg-rose-100 text-rose-800'
      case 'Offer': return 'bg-violet-100 text-violet-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-slate-700 dark:text-slate-300 mb-6">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg font-light">Welcome back! Here's your job search overview</p>
        </div>
        <StatsCards stats={stats} />
        <ApplicationsChart chartData={chartData} availableYears={availableYears} selectedYear={selectedYear} setSelectedYear={setSelectedYear} monthlyCounts={monthlyCounts} />
        <RecentJobs jobs={recentJobs} getStatusColor={getStatusColor} navigate={navigate} />
      </div>
    </div>
  )
}

export default Dashboard
