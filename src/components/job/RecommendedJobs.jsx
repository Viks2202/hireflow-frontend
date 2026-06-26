import { useState, useEffect } from 'react'
import api from '../../api/axios'
import JobCard from './JobCard'
import Spinner from '../common/Spinner'

export default function RecommendedJobs() {
  const [jobs, setJobs] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await api.get('/jobs/recommended')
        setJobs(res.data.jobs || [])
        setMessage(res.data.message || '')
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
      <p className="text-xs text-slate-400 mb-4">{message}</p>
      <div className="space-y-3">
        {jobs.slice(0, 4).map((job) => (
          <div key={job._id}>
            <JobCard job={job} />
            {job.matchingSkills?.length > 0 && (
              <p className="text-xs text-emerald-600 mt-1 pl-1">
                Matches: {job.matchingSkills.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}