import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/dashboard/StatCard'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { FiBriefcase, FiUsers, FiPlus, FiEye, FiTrash2 } from 'react-icons/fi'

export default function EmployerDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  async function fetchJobs() {
    setLoading(true)
    try {
      const res = await api.get('/jobs/my')
      setJobs(res.data.jobs || [])
    } catch (err) {
      toast.error('Failed to load your job listings')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(jobId) {
    if (!window.confirm('Delete this job listing? This cannot be undone.')) return
    try {
      await api.delete(`/jobs/${jobId}`)
      setJobs((prev) => prev.filter((j) => j._id !== jobId))
      toast.success('Job listing deleted')
    } catch (err) {
      toast.error('Failed to delete job')
    }
  }

  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => j.isActive).length,
    applicants: jobs.reduce((sum, j) => sum + (j.applicants || 0), 0),
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">
            {user?.name}'s Job Listings
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your postings and review applicants</p>
        </div>
        <Link
          to="/employer/post-job"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-navy-950 font-semibold px-5 py-2.5 rounded-lg text-sm transition"
        >
          <FiPlus /> Post a Job
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<FiBriefcase size={18} />} label="Total Listings" value={stats.total} color="amber" />
        <StatCard icon={<FiEye size={18} />} label="Active Listings" value={stats.active} color="emerald" />
        <StatCard icon={<FiUsers size={18} />} label="Total Applicants" value={stats.applicants} color="blue" />
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6">
        <h2 className="font-semibold text-navy-900 mb-4">Your Listings</h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400 mb-3">You haven't posted any jobs yet</p>
            <Link to="/employer/post-job" className="text-amber-600 font-semibold text-sm">
              Post your first job →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-amber-300 transition flex-wrap gap-3"
              >
                <div>
                  <h3 className="font-medium text-navy-900 text-sm">{job.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {job.location || 'Remote'} · Posted {job.createdAt ? format(new Date(job.createdAt), 'MMM d, yyyy') : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={job.isActive ? 'active' : 'closed'} />
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <FiUsers size={12} /> {job.applicants || 0}
                  </span>
                  <Link
                    to={`/employer/jobs/${job._id}/applicants`}
                    className="text-amber-600 text-xs font-semibold hover:underline"
                  >
                    View Applicants
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-slate-300 hover:text-red-500 transition"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}