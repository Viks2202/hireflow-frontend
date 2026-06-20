import { useState, useEffect, useCallback, useMemo } from 'react'
import api from '../api/axios'

export function useJobs(filters) {
  const [jobs, setJobs] = useState([])
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters])

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      const res = await api.get(`/jobs?${params.toString()}`)
      setJobs(res.data.jobs || [])
      setPagination(res.data.pagination || { total: 0, totalPages: 1 })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs')
      setJobs([])
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  return { jobs, pagination, loading, error, refetch: fetchJobs }
}