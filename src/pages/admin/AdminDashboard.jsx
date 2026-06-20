import { useState, useEffect } from 'react'
import api from '../../api/axios'
import StatCard from '../../components/dashboard/StatCard'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { FiUsers, FiBriefcase, FiFileText, FiTrash2, FiTrendingUp } from 'react-icons/fi'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 })
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchData(tab)
  }, [tab])

  async function fetchStats() {
    try {
      const res = await api.get('/admin/stats')
      setStats(res.data.stats || res.data)
    } catch (err) {
      toast.error('Failed to load stats')
    }
  }

  async function fetchData(currentTab) {
    setLoading(true)
    try {
      if (currentTab === 'users') {
        const res = await api.get('/admin/users')
        setUsers(res.data.users || [])
      } else {
        const res = await api.get('/admin/jobs')
        setJobs(res.data.jobs || [])
      }
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function deleteUser(id) {
    if (!window.confirm('Delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers((prev) => prev.filter((u) => u._id !== id))
      toast.success('User deleted')
    } catch {
      toast.error('Failed to delete user')
    }
  }

  async function deleteJob(id) {
    if (!window.confirm('Delete this job listing?')) return
    try {
      await api.delete(`/jobs/${id}`)
      setJobs((prev) => prev.filter((j) => j._id !== id))
      toast.success('Job deleted')
    } catch {
      toast.error('Failed to delete job')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      <h1 className="font-display text-2xl font-semibold text-navy-900 mb-1">Admin Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">Platform overview and management</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<FiUsers size={18} />} label="Total Users" value={stats.users || 0} color="amber" />
        <StatCard icon={<FiBriefcase size={18} />} label="Active Jobs" value={stats.jobs || 0} color="blue" />
        <StatCard icon={<FiFileText size={18} />} label="Applications" value={stats.applications || 0} color="emerald" />
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {['users', 'jobs'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 transition ${
              tab === t ? 'border-amber-500 text-navy-900' : 'border-transparent text-slate-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : tab === 'users' ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase border-b border-slate-100">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Joined</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-50">
                  <td className="py-3 font-medium text-navy-900">{u.name}</td>
                  <td className="py-3 text-slate-500">{u.email}</td>
                  <td className="py-3"><Badge status={u.role} /></td>
                  <td className="py-3 text-slate-400">
                    {u.createdAt ? format(new Date(u.createdAt), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="py-3">
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u._id)} className="text-slate-300 hover:text-red-500">
                        <FiTrash2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase border-b border-slate-100">
                <th className="pb-3">Title</th>
                <th className="pb-3">Company</th>
                <th className="pb-3">Applicants</th>
                <th className="pb-3">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j._id} className="border-b border-slate-50">
                  <td className="py-3 font-medium text-navy-900">{j.title}</td>
                  <td className="py-3 text-slate-500">{j.company}</td>
                  <td className="py-3 text-slate-500 flex items-center gap-1">
                    <FiTrendingUp size={12} /> {j.applicants || 0}
                  </td>
                  <td className="py-3"><Badge status={j.isActive ? 'active' : 'closed'} /></td>
                  <td className="py-3">
                    <button onClick={() => deleteJob(j._id)} className="text-slate-300 hover:text-red-500">
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}