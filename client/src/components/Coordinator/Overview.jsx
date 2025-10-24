// import { useState } from 'react'
// import Modal from '../Shared/Modal'

// const Overview = ({ stats, onNavigate, onAddCompany, onDownloadAllResumes }) => {
//   const [showModal, setShowModal] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     companyType: 'on-campus',
//     type: 'Onsite',
//     description: '',
//     stipend: ''
//   })
//   const [downloadingResumes, setDownloadingResumes] = useState(false)

//   const statsData = [
//     { 
//       title: 'Total Students', 
//       value: stats.totalStudents || 0, 
//       icon: 'users', 
//       color: 'from-blue-500 to-cyan-500',
//       bgColor: 'bg-blue-500/10',
//       iconBg: 'bg-blue-500/20'
//     },
//     { 
//       title: 'Total Companies', 
//       value: stats.totalCompanies || 0, 
//       icon: 'building', 
//       color: 'from-green-500 to-emerald-500',
//       bgColor: 'bg-green-500/10',
//       iconBg: 'bg-green-500/20'
//     },
//     { 
//       title: 'Total Applications', 
//       value: stats.totalApplications || 0, 
//       icon: 'paper-plane', 
//       color: 'from-purple-500 to-pink-500',
//       bgColor: 'bg-purple-500/10',
//       iconBg: 'bg-purple-500/20'
//     }
//   ]

//   const quickActions = [
//     { 
//       icon: 'user-plus', 
//       label: 'Manage Students', 
//       color: 'from-blue-500 to-cyan-500',
//       action: 'navigate',
//       target: 'students'
//     },
//     { 
//       icon: 'building', 
//       label: 'Add Company', 
//       color: 'from-green-500 to-emerald-500',
//       action: 'modal'
//     },
//     { 
//       icon: 'download', 
//       label: 'Download Resumes', 
//       color: 'from-purple-500 to-pink-500',
//       action: 'download'
//     }
//   ]

//   const handleQuickAction = (action) => {
//     if (action.action === 'navigate' && onNavigate) {
//       onNavigate(action.target)
//     } else if (action.action === 'modal') {
//       setShowModal(true)
//     } else if (action.action === 'download') {
//       handleDownloadAllResumes()
//     }
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (onAddCompany) {
//       onAddCompany({
//         ...formData,
//         stipend: formData.stipend ? parseInt(formData.stipend) : null
//       })
//     }
//     setShowModal(false)
//     setFormData({
//       name: '',
//       companyType: 'on-campus',
//       type: 'Onsite',
//       description: '',
//       stipend: ''
//     })
//   }

//   const handleDownloadAllResumes = async () => {
//     if (onDownloadAllResumes) {
//       setDownloadingResumes(true)
//       await onDownloadAllResumes()
//       setDownloadingResumes(false)
//     }
//   }

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       <div>
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
//           Dashboard Overview
//         </h1>
//         <p className="text-gray-400">Monitor your placement activities at a glance</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {statsData.map((stat, index) => (
//           <div 
//             key={index}
//             className={`${stat.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-400 text-sm font-medium mb-2">{stat.title}</p>
//                 <h3 className="text-4xl font-bold text-white">{stat.value}</h3>
//               </div>
//               <div className={`${stat.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center`}>
//                 <i className={`fas fa-${stat.icon} text-3xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}></i>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
//         <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
//           <i className="fas fa-bolt text-yellow-500 mr-3"></i>
//           Quick Actions
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {quickActions.map((action, index) => (
//             <button
//               key={index}
//               onClick={() => handleQuickAction(action)}
//               disabled={action.action === 'download' && downloadingResumes}
//               className={`group bg-gradient-to-br ${action.color} p-6 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
//             >
//               <div className="flex flex-col items-center space-y-3">
//                 <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                   <i className={`fas fa-${action.icon} text-3xl text-white`}></i>
//                 </div>
//                 <span className="font-semibold text-white text-lg">
//                   {action.action === 'download' && downloadingResumes ? 'Downloading...' : action.label}
//                 </span>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Company">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={e => setFormData({...formData, name: e.target.value})}
//               required
//               className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
//               placeholder="Enter company name"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Company Type *</label>
//               <select
//                 value={formData.companyType}
//                 onChange={e => setFormData({...formData, companyType: e.target.value})}
//                 required
//                 className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
//               >
//                 <option value="on-campus">🏢 On-Campus</option>
//                 <option value="off-campus">🌐 Off-Campus</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">Location Type *</label>
//               <select
//                 value={formData.type}
//                 onChange={e => setFormData({...formData, type: e.target.value})}
//                 required
//                 className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
//               >
//                 <option value="Onsite">Onsite</option>
//                 <option value="Remote">Remote</option>
//                 <option value="Hybrid">Hybrid</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
//             <textarea
//               value={formData.description}
//               onChange={e => setFormData({...formData, description: e.target.value})}
//               rows="3"
//               required
//               className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
//               placeholder="Enter company description"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">Stipend (₹)</label>
//             <input
//               type="number"
//               value={formData.stipend}
//               onChange={e => setFormData({...formData, stipend: e.target.value})}
//               className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
//               placeholder="Enter stipend amount"
//             />
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={() => setShowModal(false)}
//               className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
//             >
//               <i className="fas fa-plus"></i>
//               <span>Add Company</span>
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   )
// }

// export default Overview

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
      bgColor: 'bg-blue-500/10',
      iconBg: 'bg-blue-500/20'
    },
    { 
      title: 'Total Companies', 
      value: stats.totalCompanies || 0, 
      icon: 'building', 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      iconBg: 'bg-green-500/20'
    },
    { 
      title: 'Total Applications', 
      value: stats.totalApplications || 0, 
      icon: 'paper-plane', 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      iconBg: 'bg-purple-500/20'
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
      // Convert skills from comma-separated string to array
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-400">Monitor your placement activities at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <div 
            key={index}
            className={`${stat.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-2">{stat.title}</p>
                <h3 className="text-4xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`${stat.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center`}>
                <i className={`fas fa-${stat.icon} text-3xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <i className="fas fa-bolt text-yellow-500 mr-3"></i>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action)}
              disabled={action.action === 'download' && downloadingResumes}
              className={`group bg-gradient-to-br ${action.color} p-6 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <i className={`fas fa-${action.icon} text-3xl text-white`}></i>
                </div>
                <span className="font-semibold text-white text-lg">
                  {action.action === 'download' && downloadingResumes ? 'Downloading...' : action.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Company">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <i className="fas fa-building mr-2 text-purple-400"></i>
              Company Details
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="e.g., Google India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="Enter company description"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <i className="fas fa-briefcase mr-2 text-blue-400"></i>
              Job Details
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Work Type *</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                >
                  <option value="Onsite">Onsite</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Package (₹ LPA) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.package}
                  onChange={e => setFormData({...formData, package: e.target.value})}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="e.g., 12.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Required CGPA *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.requiredCgpa}
                  onChange={e => setFormData({...formData, requiredCgpa: e.target.value})}
                  required
                  min="0"
                  max="10"
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="e.g., 7.5"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Application Deadline *</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
              </div>
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
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
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
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="Enter additional requirements or eligibility criteria"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-gray-800 pb-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
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
