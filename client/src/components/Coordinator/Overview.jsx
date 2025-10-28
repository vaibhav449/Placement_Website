import React from 'react'
import { useState } from 'react'
import Modal from '../Shared/Modal'

const Overview = ({ stats, onNavigate, onAddCompany, onDownloadAllResumes }) => {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    package: '',
    skills: '',
    requirements: '',
    deadline: '',
    role: '',
    type: 'Onsite',
    requiredCgpa: ''
  })
  const [downloadingResumes, setDownloadingResumes] = useState(false)

  const statsData = [
    {
      title: 'Total Students',
      value: stats.totalStudents || 0,
      icon: 'users',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/8',
      iconBg: 'bg-blue-500/16'
    },
    {
      title: 'Total Companies',
      value: stats.totalCompanies || 0,
      icon: 'building',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/8',
      iconBg: 'bg-green-500/16'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications || 0,
      icon: 'paper-plane',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/8',
      iconBg: 'bg-purple-500/16'
    }
  ]

  const quickActions = [
    {
      icon: 'user-plus',
      label: 'Manage Students',
      color: 'from-blue-500 to-cyan-500',
      action: 'navigate',
      target: 'students'
    },
    {
      icon: 'building',
      label: 'Add Company',
      color: 'from-green-500 to-emerald-500',
      action: 'modal'
    },
    {
      icon: 'download',
      label: 'Download Resumes',
      color: 'from-purple-500 to-pink-500',
      action: 'download'
    }
  ]

  const handleQuickAction = (action) => {
    if (action.action === 'navigate' && onNavigate) {
      onNavigate(action.target)
    } else if (action.action === 'modal') {
      setShowModal(true)
    } else if (action.action === 'download') {
      handleDownloadAllResumes()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (onAddCompany) {
      const skillsArray = formData.skills.split(',').map((skill) => skill.trim()).filter(Boolean)

      onAddCompany({
        title: formData.title,
        description: formData.description,
        package: parseFloat(formData.package),
        skills: skillsArray,
        requirements: formData.requirements,
        deadline: formData.deadline,
        role: formData.role,
        type: formData.type,
        requiredCgpa: parseFloat(formData.requiredCgpa) || 0.0
      })
    }

    setShowModal(false)
    setFormData({
      title: '',
      description: '',
      package: '',
      skills: '',
      requirements: '',
      deadline: '',
      role: '',
      type: 'Onsite',
      requiredCgpa: ''
    })
  }

  const handleDownloadAllResumes = async () => {
    if (onDownloadAllResumes) {
      setDownloadingResumes(true)
      await onDownloadAllResumes()
      setDownloadingResumes(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-1">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-400 max-w-xl">Monitor your placement activities at a glance</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuickAction(quickActions[2])}
            disabled={downloadingResumes}
            className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm"
          >
            <i className="fas fa-download" />
            <span>{downloadingResumes ? 'Downloading...' : 'Download Resumes'}</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md text-sm"
          >
            <i className="fas fa-plus" />
            <span>Add Company</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 sm:p-6 rounded-xl border border-gray-700/50 ${stat.bgColor} hover:shadow-lg transition-transform transform hover:-translate-y-1`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 truncate">{stat.title}</p>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mt-1">{stat.value}</h3>
            </div>

            <div
              className={`ml-4 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center ${stat.iconBg}`}
              aria-hidden="true"
            >
              <i className={`fas fa-${stat.icon} text-lg sm:text-2xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800/30 rounded-2xl p-4 sm:p-6 border border-gray-700/50">
        <h2 className="text-lg sm:text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-bolt text-yellow-400" />
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action)}
              disabled={action.action === 'download' && downloadingResumes}
              className={`w-full flex items-center gap-4 p-4 sm:p-6 rounded-lg text-left transition-transform transform hover:-translate-y-1 ${
                action.action === 'download' && downloadingResumes ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/6`}>
                <i className={`fas fa-${action.icon} text-lg text-white`} />
              </div>

              <div className="flex-1">
                <div className="font-semibold text-white">{action.label}</div>
                <div className="text-xs text-gray-400">{action.action === 'download' && downloadingResumes ? 'In progress' : ''}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Company">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[72vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Company Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                placeholder="e.g., Google India"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                required
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                placeholder="Enter company description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role *</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Work Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              >
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Package (LPA) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.package}
                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                required
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                placeholder="e.g., 12.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Required CGPA *</label>
              <input
                type="number"
                step="0.01"
                value={formData.requiredCgpa}
                onChange={(e) => setFormData({ ...formData, requiredCgpa: e.target.value })}
                required
                min="0"
                max="10"
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                placeholder="e.g., 7.5"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Application Deadline *</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>
          </div>

          <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <i className="fas fa-list-check mr-2 text-green-400"></i>
              Requirements
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skills Required * <span className="text-gray-500 text-xs">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={e => setFormData({...formData, skills: e.target.value})}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Additional Requirements *</label>
                <textarea
                  value={formData.requirements}
                  onChange={e => setFormData({...formData, requirements: e.target.value})}
                  rows="3"
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="Enter additional requirements or eligibility criteria"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-gray-800 pb-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700/50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
            >
              <i className="fas fa-plus"></i>
              <span>Add Company</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Overview
