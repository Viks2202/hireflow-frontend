import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../api/axios'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { FiArrowLeft, FiFileText, FiExternalLink } from 'react-icons/fi'

const STATUS_OPTIONS = ['applied', 'shortlisted', 'interview', 'hired', 'rejected']

export default function JobApplicants() {
  const { jobId } = useParams()
  const [applications, setApplications] = useState([])
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplicants()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  async function fetchApplicants() {
    setLoading(true)
    try {
      const res = await api.get(`/applications/job/${jobId}`)
      setApplications(res.data.applications || [])
      setJobTitle(res.data.jobTitle || '')
    } catch (err) {
      toast.error('Failed to load applicants')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(appId, status) {
    try {
      await api.put(`/applications/${appId}/status`, { status })
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status } : a))
      )
      toast.success('Status updated')
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      <Link to="/employer/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-900 mb-6">
        <FiArrowLeft /> Back to dashboard
      </Link>

      <h1 className="font-display text-2xl font-semibold text-navy-900 mb-1">
        Applicants {jobTitle && `for ${jobTitle}`}
      </h1>
      <p className="text-slate-500 text-sm mb-8">{applications.length} candidates have applied</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={32} />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 text-slate-400">No applicants yet</div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white border border-slate-100 rounded-xl p-5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold text-navy-900">{app.candidate?.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{app.candidate?.email}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Applied {app.createdAt ? format(new Date(app.createdAt), 'MMM d, yyyy') : ''}
                  </p>
                </div>
                <Badge status={app.status} />
              </div>

              {app.coverLetter && (
                <p className="text-sm text-slate-600 mt-3 bg-slate-50 p-3 rounded-lg">{app.coverLetter}</p>
              )}

              <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                {app.resumeUrl || app.candidate?.resumeUrl ? (
                  <a
                    href={app.resumeUrl || app.candidate?.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-amber-600 font-semibold"
                  >
                    <FiFileText size={14} /> View Resume <FiExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">No resume uploaded</span>
                )}

                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-amber-400 capitalize"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}