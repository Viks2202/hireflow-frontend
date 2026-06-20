import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/dashboard/StatCard'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import {
  FiBriefcase, FiBookmark, FiCheckCircle, FiClock,
  FiUpload, FiFileText, FiExternalLink
} from 'react-icons/fi'

export default function CandidateDashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '')

  useEffect(() => {
    fetchApplications()
  }, [])

  async function fetchApplications() {
    setLoading(true)
    try {
      const res = await api.get('/applications/my')
      setApplications(res.data.applications || [])
    } catch (err) {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  async function handleResumeUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)

      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setResumeUrl(res.data.url || res.data.resumeUrl)
      toast.success('Resume uploaded successfully')
    } catch (err) {
      toast.error('Failed to upload resume')
    } finally {
      setUploading(false)
    }
  }

  const stats = {
    total: applications.length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    hired: applications.filter((a) => a.status === 'hired').length,
    pending: applications.filter((a) => a.status === 'applied').length,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-navy-900">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Track your applications and manage your profile
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FiBriefcase size={18} />} label="Total Applications" value={stats.total} color="amber" />
        <StatCard icon={<FiClock size={18} />} label="Pending Review" value={stats.pending} color="blue" />
        <StatCard icon={<FiCheckCircle size={18} />} label="Shortlisted" value={stats.shortlisted} color="emerald" />
        <StatCard icon={<FiBookmark size={18} />} label="Hired" value={stats.hired} color="emerald" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white border border-slate-100 rounded-xl p-6">
            <h2 className="font-semibold text-navy-900 mb-4">Your Applications</h2>

            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-400 mb-3">
                  You haven't applied to any jobs yet
                </p>
                <Link to="/jobs" className="text-amber-600 font-semibold text-sm">
                  Browse open roles →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-amber-300 transition"
                  >
                    <div>
                      <Link
                        to={`/jobs/${app.job?._id || app.job}`}
                        className="font-medium text-navy-900 hover:text-amber-600 text-sm"
                      >
                        {app.job?.title || 'Job listing'}
                      </Link>
                      <p className="text-xs text-slate-400 mt-1">
                        {app.job?.company} · Applied{' '}
                        {app.createdAt
                          ? format(new Date(app.createdAt), 'MMM d, yyyy')
                          : ''}
                      </p>
                    </div>
                    <Badge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-xl p-6">
            <h2 className="font-semibold text-navy-900 mb-4">Resume</h2>

            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:border-amber-300 transition mb-3"
              >
                <FiFileText className="text-amber-500" />
                <span className="text-sm text-navy-900 flex-1">
                  Current resume
                </span>
                <FiExternalLink className="text-slate-400" size={14} />
              </a>
            ) : (
              <p className="text-sm text-slate-400 mb-3">
                No resume uploaded yet
              </p>
            )}

            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-lg py-4 cursor-pointer hover:border-amber-400 transition text-sm text-slate-500">
              <FiUpload />
              {uploading ? 'Uploading...' : 'Upload PDF Resume'}
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-6">
            <h2 className="font-semibold text-navy-900 mb-4">Profile</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Name</span>
                <span className="text-navy-900 font-medium">
                  {user?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email</span>
                <span className="text-navy-900 font-medium">
                  {user?.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Role</span>
                <Badge status="candidate" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}