export default function StatCard({ icon, label, value, color = 'amber' }) {
  const colors = {
    amber: 'bg-amber-400/15 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    red: 'bg-red-100 text-red-600',
  }
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <div className="font-display text-2xl font-semibold text-navy-900">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  )
}