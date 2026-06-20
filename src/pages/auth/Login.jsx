import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { FiBriefcase } from 'react-icons/fi'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(email, password)
      toast.success(`Welcome back, ${user.name?.split(' ')[0]}`)
      const redirect = location.state?.from
      if (redirect) navigate(redirect)
      else if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'employer') navigate('/employer/dashboard')
      else navigate('/candidate/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-navy-900 font-display text-xl font-semibold">
            <FiBriefcase className="text-amber-500" />
            Hire<span className="text-amber-500">Flow</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h1 className="font-display text-2xl font-semibold text-navy-900 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6">Sign in to continue to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-navy-900 block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-navy-900 block mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-900 hover:bg-navy-800 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}