import { Link } from 'react-router-dom'
import { FiBriefcase, FiGithub, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-display text-lg font-semibold mb-3">
              <FiBriefcase className="text-amber-400" />
              HireFlow
            </div>
            <p className="text-sm text-slate-500">
              Connecting candidates and employers with a faster, simpler hiring flow.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">For Candidates</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-amber-400">Browse Jobs</Link></li>
              <li><Link to="/register" className="hover:text-amber-400">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-amber-400">Post a Job</Link></li>
              <li><Link to="/login" className="hover:text-amber-400">Employer Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Connect</h4>
            <div className="flex gap-3">
              <a href="https://github.com/Viks2202" target="_blank" rel="noreferrer" className="hover:text-amber-400">
                <FiGithub size={18} />
              </a>
              <a href="https://linkedin.com/in/vikas2103" target="_blank" rel="noreferrer" className="hover:text-amber-400">
                <FiLinkedin size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-navy-700 mt-8 pt-6 text-xs text-slate-500 text-center">
          Built by Vikas Sharma · React.js · Node.js · MongoDB
        </div>
      </div>
    </footer>
  )
}