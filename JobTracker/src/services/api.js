/*  
  Fixed + cleaned API service for JobTrackr  
  - Handles JSON vs Blob properly
  - Safer FormData handling for uploads
  - Unified error handling
*/

/* ===== API Service for JobTrackr ===== */

const API_BASE_URL = 'https://jobtrackr-production.up.railway.app/api'

/* ===== Token Management ===== */
export const getToken = () => localStorage.getItem('authToken')
export const setToken = (token) => localStorage.setItem('authToken', token)
export const removeToken = () => localStorage.removeItem('authToken')
export const isAuthenticated = () => !!getToken()

/* ===== Headers ===== */
const getDefaultHeaders = () => {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

/* ===== Core API Request (JSON endpoints only) ===== */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getDefaultHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    if (!response.ok) {
      let errorMessage = response.statusText
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch (_) {}
      if (response.status === 401) errorMessage = 'Unauthorized. Please log in again.'
      if (response.status === 429) errorMessage = 'Too many requests. Please try again later.'
      if (response.status === 500) errorMessage = 'Server error. Please try again later.'
      throw new Error(errorMessage)
    }

    const contentType = response.headers.get('Content-Type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    return response
  } catch (err) {
    console.error('API Request failed:', err)
    throw err
  }
}

/* ===== Auth ===== */
export const login = async (email, password) => {
  const res = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (res.token) setToken(res.token)
  return res
}

export const register = async (userData) => {
  const res = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
  if (res.token) setToken(res.token)
  return res
}

export const logout = async () => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' })
  } catch (e) {
    console.warn('Backend logout failed:', e)
  } finally {
    removeToken()
  }
}

export const getCurrentUser = () => apiRequest('/auth/me')
export const updateProfile = (profileData) =>
  apiRequest('/users/profile', { method: 'PUT', body: JSON.stringify(profileData) })
export const changePassword = (passwordData) =>
  apiRequest('/users/change-password', { method: 'PUT', body: JSON.stringify(passwordData) })
export const forgotPassword = (email) =>
  apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
export const resetPassword = (resetData) =>
  apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(resetData) })

/* ===== Resumes ===== */
export const getResumes = async () => {
  const res = await apiRequest('/resumes')
  if (Array.isArray(res)) return res
  if (res?.resumes) return res.resumes
  if (res?.data) return res.data
  return []
}

export const createResume = async (resumeData) => {
  const formData = new FormData()
  formData.append('title', resumeData.name)
  formData.append('file', resumeData.file)
  if (resumeData.description) formData.append('description', resumeData.description)

  return await fetch(`${API_BASE_URL}/resumes`, {
    method: 'POST',
    headers: getDefaultHeaders(), // DO NOT set Content-Type for FormData
    body: formData,
  }).then(res => res.json())
}

export const updateResume = (id, updateData) =>
  apiRequest(`/resumes/${id}`, { method: 'PUT', body: JSON.stringify(updateData) })

export const deleteResume = (id) =>
  apiRequest(`/resumes/${id}`, { method: 'DELETE' })

export const previewResume = async (id) => {
  const res = await fetch(`${API_BASE_URL}/resumes/${id}/preview`, {
    headers: getDefaultHeaders(),
  })
  if (!res.ok) throw new Error(`Preview failed: ${res.statusText}`)
  return res.blob() // returns Blob for preview in browser
}

export const downloadResume = async (id, filename = 'resume.pdf') => {
  const res = await fetch(`${API_BASE_URL}/resumes/${id}/download`, {
    headers: getDefaultHeaders(),
  })
  if (!res.ok) throw new Error(`Download failed: ${res.statusText}`)
  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

/* ===== Jobs ===== */
export const getJobs = () => apiRequest('/jobs')
export const createJob = (jobData) =>
  apiRequest('/jobs', { method: 'POST', body: JSON.stringify(jobData) })
export const updateJob = (id, updateData) =>
  apiRequest(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(updateData) })
export const deleteJob = (id) =>
  apiRequest(`/jobs/${id}`, { method: 'DELETE' })

/* ===== Dashboard ===== */
export const getDashboardStats = () => apiRequest('/dashboard/stats')

/* ===== Export ===== */
export default {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  isAuthenticated,
  getToken,
  setToken,
  removeToken,
  getResumes,
  createResume,
  updateResume,
  deleteResume,
  previewResume,
  downloadResume,
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getDashboardStats,
}
