import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiMenu, FiX, FiUser, FiLogOut, FiBriefcase } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  function dashboardLink() {
    if (!user) return '/login'
    if (user.role === 'admin') return '/admin'
    if (user.role === 'employer') return '/employer/dashboard'
    return '/candidate/dashboard'
  }

  return (
    <nav className="bg-navy-950 sticky top-0 z-50 border-b border-navy-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-display text-xl font-semibold">
            <FiBriefcase className="text-amber-400" />
            Hire<span className="text-amber-400">Flow</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/jobs" className="text-slate-100 hover:text-amber-400 text-sm font-medium transition">
              Find Jobs
            </Link>
            {user?.role === 'employer' && (
              <Link to="/employer/post-job" className="text-slate-100 hover:text-amber-400 text-sm font-medium transition">
                Post a Job
              </Link>
            )}
            {!user && (
  <Link to="/register?role=employer" className="text-slate-100 hover:text-amber-400 text-sm font-medium transition">
    For Employers
  </Link>
)}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link to="/login" className="text-slate-100 hover:text-white text-sm font-medium transition">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-500 hover:bg-amber-600 text-navy-950 text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 text-slate-100 hover:text-white text-sm font-medium"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-navy-950 flex items-center justify-center font-semibold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  {user.name?.split(' ')[0]}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 fade-in">
                    <Link
                      to={dashboardLink()}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-navy-900 hover:bg-slate-50"
                    >
                      <FiUser size={14} /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                    >
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-navy-700 fade-in">
            <Link to="/jobs" onClick={() => setOpen(false)} className="block py-2 text-slate-100">
              Find Jobs
            </Link>
            {!user ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-slate-100">
                  Sign in
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block py-2 text-amber-400 font-semibold">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link to={dashboardLink()} onClick={() => setOpen(false)} className="block py-2 text-slate-100">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="block py-2 text-red-400 text-left w-full">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}