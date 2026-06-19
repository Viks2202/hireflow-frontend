import { Link } from 'react-router-dom'
import { FiSearch, FiBriefcase, FiUsers, FiTrendingUp, FiArrowRight } from 'react-icons/fi'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STATS = [
  { label: 'Active Job Listings', value: '2,400+' },
  { label: 'Companies Hiring', value: '350+' },
  { label: 'Candidates Placed', value: '8,100+' },
]

const CATEGORIES = [
  { name: 'Software Development', count: 412 },
  { name: 'Design & Product', count: 186 },
  { name: 'Marketing & Sales', count: 234 },
  { name: 'Operations & Finance', count: 158 },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/jobs${query ? `?search=${encodeURIComponent(query)}` : ''}`)
  }

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="bg-navy-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight mb-4">
            Your next role is one
            <span className="text-amber-400"> application</span> away
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            HireFlow connects candidates with employers through a clear, honest hiring
            process — no noise, no guesswork on where your application stands.
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex bg-white rounded-xl p-1.5 shadow-xl">
            <div className="flex items-center flex-1 px-3">
              <FiSearch className="text-slate-400 mr-2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Job title, skill, or company"
                className="w-full py-2.5 outline-none text-navy-900 text-sm"
              />
            </div>
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-navy-950 font-semibold px-6 rounded-lg text-sm transition">
              Search
            </button>
          </form>

          <div className="flex justify-center gap-10 mt-14">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-semibold text-amber-400">{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-2xl font-semibold text-navy-900 mb-8">Browse by category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to={`/jobs?category=${encodeURIComponent(c.name)}`}
              className="bg-white border border-slate-100 rounded-xl p-5 hover:border-amber-400 hover:shadow-md transition group"
            >
              <FiBriefcase className="text-amber-500 mb-3" size={22} />
              <h3 className="font-semibold text-navy-900 text-sm mb-1">{c.name}</h3>
              <p className="text-xs text-slate-400">{c.count} open roles</p>
              <FiArrowRight className="text-slate-300 group-hover:text-amber-500 mt-3 transition" />
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-navy-900 mb-10 text-center">
            How HireFlow works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <FiSearch size={20} />
              </div>
              <h3 className="font-semibold text-navy-900 mb-2">Find the right fit</h3>
              <p className="text-sm text-slate-500">Filter by role, location, and skills to find jobs that actually match you.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <FiUsers size={20} />
              </div>
              <h3 className="font-semibold text-navy-900 mb-2">Apply with one resume</h3>
              <p className="text-sm text-slate-500">Upload once, apply everywhere. Employers see your application instantly.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp size={20} />
              </div>
              <h3 className="font-semibold text-navy-900 mb-2">Track every step</h3>
              <p className="text-sm text-slate-500">Know exactly where you stand — applied, shortlisted, interview, or hired.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-semibold mb-3">Hiring for your team?</h2>
          <p className="text-slate-400 mb-6">Post a job in minutes and start reviewing applicants today.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-navy-950 font-semibold px-6 py-3 rounded-lg transition"
          >
            Post a Job <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  )
}