import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { FiBriefcase } from 'react-icons/fi'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const user = await register(form)
      toast.success('Account created!')
      if (user.role === 'employer') navigate('/employer/dashboard')
      else navigate('/candidate/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-10 fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-navy-900 font-display text-xl font-semibold">
            <FiBriefcase className="text-amber-500" />
            Hire<span className="text-amber-500">Flow</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h1 className="font-display text-2xl font-semibold text-navy-900 mb-1">Create your account</h1>
          <p className="text-sm text-slate-500 mb-6">Join as a candidate or employer</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => update('role', 'candidate')}
              className={`py-2.5 rounded-lg text-sm font-semibold border transition ${
                form.role === 'candidate'
                  ? 'bg-amber-500 text-navy-950 border-amber-500'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              I'm a Candidate
            </button>
            <button
              type="button"
              onClick={() => update('role', 'employer')}
              className={`py-2.5 rounded-lg text-sm font-semibold border transition ${
                form.role === 'employer'
                  ? 'bg-amber-500 text-navy-950 border-amber-500'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              I'm an Employer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-navy-900 block mb-1.5">
                {form.role === 'employer' ? 'Contact Name' : 'Full Name'}
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                placeholder="Vikas Sharma"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy-900 block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy-900 block mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                placeholder="At least 6 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-900 hover:bg-navy-800 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}