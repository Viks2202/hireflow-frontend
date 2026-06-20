import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import {
  FiMapPin, FiBriefcase, FiDollarSign, FiClock,
  FiUsers, FiArrowLeft, FiCheckCircle
} from 'react-icons/fi'

export default function JobDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [showApplyForm, setShowApplyForm] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      setLoading(true)
      try {
        const res = await api.get(`/jobs/${id}`)
        setJob(res.data.job)
      } catch (err) {
        toast.error('Job not found')
        navigate('/jobs')
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id, navigate])

  useEffect(() => {
    async function checkApplied() {
      if (!user || user.role !== 'candidate') return
      try {
        const res = await api.get('/applications/my')
        const exists = res.data.applications?.some((a) => a.job?._id === id || a.job === id)
        setApplied(exists)
      } catch {
        // silent — non-critical
      }
    }
    checkApplied()
  }, [id, user])

  async function handleApply() {
    if (!user) {
      navigate('/login', { state: { from: `/jobs/${id}` } })
      return
    }
    if (user.role !== 'candidate') {
      toast.error('Only candidates can apply for jobs')
      return
    }
    setApplying(true)
    try {
      await api.post(`/applications/job/${id}`, { coverLetter })
      toast.success('Application submitted!')
      setApplied(true)
      setShowApplyForm(false)
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size={32} />
      </div>
    )
  }

  if (!job) return null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-900 mb-6">
        <FiArrowLeft /> Back to jobs
      </Link>

      <div className="bg-white border border-slate-100 rounded-2xl p-8 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-navy-900 text-amber-400 flex items-center justify-center font-display font-semibold text-xl">
              {job.company?.[0]?.toUpperCase() || 'H'}
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold text-navy-900">{job.title}</h1>
              <p className="text-slate-500 text-sm">{job.company}</p>
            </div>
          </div>

          {applied ? (
            <span className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-lg text-sm font-semibold">
              <FiCheckCircle /> Applied
            </span>
          ) : (
            <button
              onClick={() => (user?.role === 'candidate' ? setShowApplyForm(true) : handleApply())}
              className="bg-amber-500 hover:bg-amber-600 text-navy-950 font-semibold px-6 py-2.5 rounded-lg text-sm transition"
            >
              Apply Now
            </button>
          )}
        </div>

        <div className="flex items-center gap-5 mt-6 text-sm text-slate-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <FiMapPin size={14} /> {job.location || 'Remote'}
          </span>
          <span className="flex items-center gap-1.5">
            <FiBriefcase size={14} /> {job.type || 'Full-time'}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1.5">
              <FiDollarSign size={14} /> {job.salary}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <FiUsers size={14} /> {job.applicants || 0} applicants
          </span>
          <span className="flex items-center gap-1.5">
            <FiClock size={14} />
            {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : 'Recently'}
          </span>
        </div>

        {job.skills?.length > 0 && (
          <div className="flex gap-2 mt-5 flex-wrap">
            {job.skills.map((skill) => (
              <span key={skill} className="text-xs bg-amber-400/15 text-amber-700 px-3 py-1.5 rounded-full font-medium">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {showApplyForm && (
        <div className="bg-white border border-amber-200 rounded-2xl p-6 mb-6 fade-in">
          <h3 className="font-semibold text-navy-900 mb-3">Apply for {job.title}</h3>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Add a short note for the employer (optional)"
            rows={4}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400 mb-3 resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={handleApply}
              disabled={applying}
              className="bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition disabled:opacity-60"
            >
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
            <button
              onClick={() => setShowApplyForm(false)}
              className="text-slate-500 px-4 py-2.5 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-2xl p-8">
        <h2 className="font-semibold text-navy-900 mb-3">About this role</h2>
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
          {job.description}
        </p>

        {job.requirements?.length > 0 && (
          <>
            <h2 className="font-semibold text-navy-900 mt-6 mb-3">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-amber-500 mt-1">•</span> {req}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}