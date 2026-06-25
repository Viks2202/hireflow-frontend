import { useState, useEffect } from 'react'
import api from '../../api/axios'
import JobCard from './JobCard'
import Spinner from '../common/Spinner'

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await api.get('/jobs/recommended')
        setJobs(res.data.jobs || [])
      } catch {
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    fetchRecommendations()
  }, [])

  if (loading) return <div className="flex justify-center py-10"><Spinner /></div>
  if (jobs.length === 0) return null

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6">
      <h2 className="font-semibold text-navy-900 mb-1">Recommended for You</h2>
      <p className="text-xs text-slate-400 mb-4">Based on your skills</p>
      <div className="space-y-3">
        {jobs.slice(0, 4).map((job) => <JobCard key={job._id} job={job} />)}
      </div>
    </div>
  )
}