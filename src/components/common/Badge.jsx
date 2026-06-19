const STYLES = {
  applied: 'bg-slate-100 text-slate-500',
  shortlisted: 'bg-amber-400/20 text-amber-600',
  interview: 'bg-blue-100 text-blue-700',
  hired: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
  active: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-slate-100 text-slate-500',
  candidate: 'bg-blue-100 text-blue-700',
  employer: 'bg-amber-400/20 text-amber-600',
  admin: 'bg-navy-700 text-white',
}

export default function Badge({ status, children }) {
  const style = STYLES[status?.toLowerCase()] || 'bg-slate-100 text-slate-500'
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${style}`}>
      {children || status}
    </span>
  )
}