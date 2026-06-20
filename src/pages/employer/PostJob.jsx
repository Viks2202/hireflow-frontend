import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { FiPlus, FiX } from 'react-icons/fi'

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']

export default function PostJob() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [requirementInput, setRequirementInput] = useState('')
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    skills: [],
    requirements: [],
  })

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function addSkill() {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      update('skills', [...form.skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  function removeSkill(skill) {
    update('skills', form.skills.filter((s) => s !== skill))
  }

  function addRequirement() {
    if (requirementInput.trim()) {
      update('requirements', [...form.requirements, requirementInput.trim()])
      setRequirementInput('')
    }
  }

  function removeRequirement(idx) {
    update('requirements', form.requirements.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.company || !form.description) {
      toast.error('Please fill in title, company, and description')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/jobs', form)
      toast.success('Job posted successfully!')
      navigate(`/jobs/${res.data.job._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      <h1 className="font-display text-2xl font-semibold text-navy-900 mb-1">Post a new job</h1>
      <p className="text-slate-500 text-sm mb-8">Fill in the details to publish your listing</p>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-navy-900 block mb-1.5">Job Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Senior Backend Developer"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-900 block mb-1.5">Company</label>
            <input
              required
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
              placeholder="Your company name"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-navy-900 block mb-1.5">Location</label>
            <input
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="Delhi NCR / Remote"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-900 block mb-1.5">Job Type</label>
            <select
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400"
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-900 block mb-1.5">Salary Range</label>
            <input
              value={form.salary}
              onChange={(e) => update('salary', e.target.value)}
              placeholder="₹6-10 LPA"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-navy-900 block mb-1.5">Description</label>
          <textarea
            required
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={5}
            placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400 resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-navy-900 block mb-1.5">Required Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="e.g. Node.js — press Enter"
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400"
            />
            <button type="button" onClick={addSkill} className="bg-navy-900 text-white px-4 rounded-lg">
              <FiPlus />
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {form.skills.map((skill) => (
              <span key={skill} className="flex items-center gap-1.5 text-xs bg-amber-400/15 text-amber-700 px-3 py-1.5 rounded-full">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)}>
                  <FiX size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-navy-900 block mb-1.5">Requirements</label>
          <div className="flex gap-2 mb-2">
            <input
              value={requirementInput}
              onChange={(e) => setRequirementInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              placeholder="e.g. 2+ years of backend experience — press Enter"
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-400"
            />
            <button type="button" onClick={addRequirement} className="bg-navy-900 text-white px-4 rounded-lg">
              <FiPlus />
            </button>
          </div>
          <ul className="space-y-1.5">
            {form.requirements.map((req, i) => (
              <li key={i} className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                {req}
                <button type="button" onClick={() => removeRequirement(i)} className="text-slate-400 hover:text-red-500">
                  <FiX size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-navy-950 font-semibold py-3 rounded-lg text-sm transition disabled:opacity-60"
        >
          {loading ? 'Publishing...' : 'Publish Job Listing'}
        </button>
      </form>
    </div>
  )
}