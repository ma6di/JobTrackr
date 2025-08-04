import React, { createContext, useContext, useState, useEffect } from 'react';
import { getJobs, createJob, updateJob, deleteJob } from '../services/api';
import { useAuth } from './AuthContext';

const JobsContext = createContext();

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load jobs when user is authenticated
  const loadJobs = async () => {
    if (!user) {
      setJobs([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getJobs();
      setJobs(response.jobs || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // Load jobs when user changes
  useEffect(() => {
    loadJobs();
  }, [user]);

  // Add a new job
  const addJob = async (jobData) => {
    try {
      setError(null);
      const newJob = await createJob(jobData);
      // Refetch all jobs to ensure we have complete data including resume info
      await loadJobs();
      return newJob;
    } catch (err) {
      console.error('Failed to add job:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add job';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update an existing job
  const updateJobById = async (jobId, jobData) => {
    try {
      setError(null);
      const updatedJob = await updateJob(jobId, jobData);
      // Refetch all jobs to ensure we have complete data including resume info
      await loadJobs();
      return updatedJob;
    } catch (err) {
      console.error('Failed to update job:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update job';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete a job
  const deleteJobById = async (jobId) => {
    try {
      setError(null);
      await deleteJob(jobId);
      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Failed to delete job:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete job';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Get job by ID
  const getJobById = (jobId) => {
    return jobs.find(job => job.id === jobId);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    jobs,
    loading,
    error,
    addJob,
    updateJob: updateJobById,
    deleteJob: deleteJobById,
    getJobById,
    loadJobs,
    clearError
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
};
