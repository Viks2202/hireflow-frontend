import { Link } from 'react-router-dom'
import { FiMapPin, FiClock, FiDollarSign, FiBriefcase, FiBookmark } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

export default function JobCard({ job, onSave, saved }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 hover:shadow-md hover:border-amber-300 transition group">
      <div className="flex items-start justify-between">
        <Link to={`/jobs/${job._id}`} className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-navy-900 text-amber-400 flex items-center justify-center font-display font-semibold text-sm">
              {job.company?.[0]?.toUpperCase() || 'H'}
            </div>
            <div>
              <h3 className="font-semibold text-navy-900 group-hover:text-amber-600 transition">
                {job.title}
              </h3>
              <p className="text-xs text-slate-400">{job.company}</p>
            </div>
          </div>
        </Link>
        {onSave && (
          <button
            onClick={() => onSave(job._id)}
            className={`p-2 rounded-full hover:bg-slate-50 transition ${saved ? 'text-amber-500' : 'text-slate-300'}`}
          >
            <FiBookmark fill={saved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 flex-wrap">
        <span className="flex items-center gap-1">
          <FiMapPin size={13} /> {job.location || 'Remote'}
        </span>
        <span className="flex items-center gap-1">
          <FiBriefcase size={13} /> {job.type || 'Full-time'}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1">
            <FiDollarSign size={13} /> {job.salary}
          </span>
        )}
        <span className="flex items-center gap-1">
          <FiClock size={13} /> {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : 'Recently'}
        </span>
      </div>

      {job.skills?.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="text-xs bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      )}

      <Link
        to={`/jobs/${job._id}`}
        className="inline-block mt-4 text-sm font-semibold text-amber-600 hover:text-amber-700"
      >
        View details →
      </Link>
    </div>
  )
}