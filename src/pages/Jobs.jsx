import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useJobs } from '../hooks/useJobs'
import JobCard from '../components/job/JobCard'
import Spinner from '../components/common/Spinner'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'

const JOB_TYPES = ['fulltime', 'parttime', 'contract', 'internship', 'remote']
export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    page: searchParams.get('page') || '1',
  }

  const { jobs, pagination, loading, error } = useJobs(filters)

  function updateFilter(key, value) {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    params.set('page', '1')
    setSearchParams(params)
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    updateFilter('search', searchInput)
  }

  function goToPage(page) {
    const params = new URLSearchParams(searchParams)
    params.set('page', page)
    setSearchParams(params)
  }

  function clearFilters() {
    setSearchParams({})
    setSearchInput('')
  }

  const hasActiveFilters = filters.search || filters.category || filters.type || filters.location

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-navy-900 mb-2">Find your next role</h1>
        <p className="text-slate-500 text-sm">
          {pagination.total > 0 ? `${pagination.total} jobs available` : 'Search across all open roles'}
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-6">
        <div className="flex items-center flex-1 bg-white border border-slate-200 rounded-xl px-4 focus-within:border-amber-400">
          <FiSearch className="text-slate-400 mr-2" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Job title, skill, or company"
            className="w-full py-3 outline-none text-sm text-navy-900"
          />
        </div>
        <button type="submit" className="bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 rounded-xl text-sm transition">
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 border border-slate-200 px-4 rounded-xl text-sm text-navy-900"
        >
          <FiFilter />
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block space-y-6`}>
          <div className="bg-white border border-slate-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-navy-900 text-sm">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-amber-600 flex items-center gap-1">
                  <FiX size={12} /> Clear
                </button>
              )}
            </div>

            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Job Type</label>
              <div className="space-y-2">
                {JOB_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2 text-sm text-navy-900 cursor-pointer">
                    <input
                      type="radio"
                      checked={filters.type === type}
                      onChange={() => updateFilter('type', type)}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Location</label>
              <input
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                placeholder="City or Remote"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </aside>

        {/* Job list */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size={32} />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-slate-400">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 mb-2">No jobs match your search</p>
              <button onClick={clearFilters} className="text-amber-600 text-sm font-semibold">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                        Number(filters.page) === p
                          ? 'bg-navy-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-500 hover:border-amber-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}