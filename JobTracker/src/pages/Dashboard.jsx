import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJobs } from '../contexts/JobsContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts'

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

  try {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-slate-600 dark:text-slate-400">Loading...</div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-600 dark:text-red-400">Error: {error}</div>
        </div>
      )
    }

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
      } catch (err) {
        console.warn('Error processing job date:', job, err)
      }
    })

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const chartData = months.map((month, idx) => ({ month, applications: monthlyCounts[idx] }))

    const recentJobs = [...safeJobs]
      .sort((a, b) => {
        try {
          const dateA = new Date(a.appliedAt || a.createdAt || 0)
          const dateB = new Date(b.appliedAt || b.createdAt || 0)
          return dateB - dateA // newest first
        } catch (err) {
          console.warn('Error sorting jobs:', err)
          return 0
        }
      })
      .slice(0, 5)

    const getStatusColor = (status) => {
      if (!status) return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600'

      switch (status) {
        case 'First Interview':
          return 'bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-600'
        case 'Second Interview':
          return 'bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-600'
        case 'Third Interview':
          return 'bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-600'
        case 'Final Interview':
          return 'bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-600'
        case 'Pending':
          return 'bg-amber-100 dark:bg-blue-800 text-amber-800 dark:text-blue-200 border border-amber-200 dark:border-blue-600'
        case 'Applied':
          return 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-600'
        case 'Rejected':
          return 'bg-rose-100 dark:bg-rose-800 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-600'
        case 'Offer':
          return 'bg-violet-100 dark:bg-violet-800 text-violet-800 dark:text-violet-200 border border-violet-200 dark:border-violet-600'
        default:
          return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
      }
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        {/* ... UI content unchanged for brevity ... */}
      </div>
    )
  } catch (err) {
    console.error('Dashboard render error:', err)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">
          Dashboard Error: {err.message}
        </div>
      </div>
    )
  }
}

export default Dashboard
