import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = {
  applied: '#94a3b8',
  reviewing: '#3b82f6',
  shortlisted: '#e8954f',
  hired: '#10b981',
  rejected: '#ef4444',
}

export default function ApplicationChart({ applications }) {
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: COLORS[status] || '#94a3b8',
  }))

  if (applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-slate-400">
        Apply to jobs to see your application breakdown
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend iconType="circle" formatter={(value) => <span style={{ fontSize: 12, color: '#475569' }}>{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}