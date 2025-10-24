// import { useState } from 'react'
// import { studentAPI } from '../../utils/api'
// import { validateFile } from '../../utils/validation'

// const ProfileTab = ({ user, showToast }) => {
//   const [uploading, setUploading] = useState(false)

//   const handleResumeUpload = async (e) => {
//     const file = e.target.files[0]
    
//     const validation = validateFile(file)
//     if (!validation.isValid) {
//       showToast(validation.error, 'error')
//       e.target.value = ''
//       return
//     }

//     setUploading(true)
//     try {
//       await studentAPI.uploadResume(file)
//       showToast('Resume updated successfully!', 'success')
//     } catch (error) {
//       showToast(error.message || 'Failed to upload resume', 'error')
//     } finally {
//       setUploading(false)
//     }
//   }

//   const profileFields = [
//     { icon: 'user', label: 'Full Name', value: user?.name || 'Not provided', color: 'text-blue-400' },
//     { icon: 'envelope', label: 'Email Address', value: user?.email, color: 'text-purple-400' },
//     { icon: 'id-card', label: 'Roll Number', value: user?.rollNo || 'Not provided', color: 'text-green-400' },
//     { icon: 'graduation-cap', label: 'Course', value: user?.course || 'Not provided', color: 'text-orange-400' },
//     { icon: 'calendar', label: 'Batch', value: user?.batch || 'Not provided', color: 'text-pink-400' },
//     { icon: 'book', label: 'Cgpa', value: user?.cgpa ? `${user.cgpa} CGPA` : 'Not provided', color: 'text-cyan-400' }
//   ]

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-white mb-1">Your Profile</h2>
//         <p className="text-gray-400">Manage your profile information</p>
//       </div>

//       {/* Profile Card */}
//       <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
//         {/* Profile Header */}
//         <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-8 border-b border-gray-700/50">
//           <div className="flex items-center space-x-6">
//             <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
//               {user?.name?.charAt(0) || 'U'}
//             </div>
//             <div>
//               <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
//                 {user?.name || 'User Name'}
//               </h3>
//               <p className="text-gray-400 mt-1 flex items-center">
//                 <i className="fas fa-circle text-green-500 text-xs mr-2 animate-pulse"></i>
//                 Active Student
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Profile Details Grid */}
//         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//           {profileFields.map((field, index) => (
//             <div 
//               key={index}
//               className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30 hover:border-gray-600/50 transition-all duration-200"
//             >
//               <div className="flex items-center space-x-3">
//                 <div className={`w-10 h-10 bg-gray-600/50 rounded-lg flex items-center justify-center ${field.color}`}>
//                   <i className={`fas fa-${field.icon}`}></i>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{field.label}</p>
//                   <p className="text-white font-semibold mt-0.5">{field.value}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Resume Upload Section */}
//       <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
//         <div className="flex items-start space-x-4 mb-4">
//           <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
//             <i className="fas fa-file-upload text-white text-xl"></i>
//           </div>
//           <div className="flex-1">
//             <h3 className="text-xl font-bold text-white mb-1">Upload Resume</h3>
//             <p className="text-gray-400 text-sm">Keep your resume up to date for better opportunities</p>
//           </div>
//         </div>

//         <div className="relative">
//           <input
//             type="file"
//             id="resume-upload"
//             accept=".pdf"
//             onChange={handleResumeUpload}
//             disabled={uploading}
//             className="hidden"
//           />
//           <label
//             htmlFor="resume-upload"
//             className={`block w-full border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
//               uploading 
//                 ? 'bg-gray-700/30 cursor-not-allowed' 
//                 : 'hover:border-orange-500/50 hover:bg-gray-700/30'
//             }`}
//           >
//             {uploading ? (
//               <div className="flex flex-col items-center space-y-3">
//                 <i className="fas fa-spinner fa-spin text-4xl text-orange-400"></i>
//                 <p className="text-gray-400 font-medium">Uploading...</p>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center space-y-3">
//                 <i className="fas fa-cloud-upload-alt text-4xl text-orange-400"></i>
//                 <div>
//                   <p className="text-white font-medium">Click to upload or drag and drop</p>
//                   <p className="text-gray-400 text-sm mt-1">PDF files only (Max 5MB)</p>
//                 </div>
//               </div>
//             )}
//           </label>
//         </div>

//         {user?.resumeUrl && (
//           <div className="mt-4 flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl p-4">
//             <div className="flex items-center space-x-3">
//               <i className="fas fa-check-circle text-green-400 text-xl"></i>
//               <p className="text-green-400 font-medium">Resume uploaded successfully</p>
//             </div>
//             <a 
//               href={user.resumeUrl} 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="text-green-400 hover:text-green-300 transition-colors"
//             >
//               <i className="fas fa-external-link-alt"></i>
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ProfileTab

// import { useState } from 'react'
// import { studentAPI } from '../../utils/api'
// import { validateFile } from '../../utils/validation'
// import Modal from '../Shared/Modal'

// const ProfileTab = ({ user, showToast, onProfileUpdate }) => {
//   const [uploading, setUploading] = useState(false)
//   const [showUpdateModal, setShowUpdateModal] = useState(false)
//   const [formData, setFormData] = useState({
//     name: user?.name || '',
//     rollNo: user?.details?.rollNo || '',
//     semester: user?.details?.semester || '',
//     course: user?.details?.course || '',
//     graduationYear: user?.details?.graduationYear || '',
//     cgpa: user?.details?.cgpa || '',
//     activeBacklogs: user?.details?.activeBacklogs || '',
//     branch: user?.details?.branch || '',
//     year: user?.details?.year || '',
//     oldPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   })
//   const [resumeFile, setResumeFile] = useState(null)
//   const [updating, setUpdating] = useState(false)

//   const handleResumeUpload = async (e) => {
//     const file = e.target.files[0]
    
//     const validation = validateFile(file)
//     if (!validation.isValid) {
//       showToast(validation.error, 'error')
//       e.target.value = ''
//       return
//     }

//     setUploading(true)
//     try {
//       await studentAPI.uploadResume(file)
//       showToast('Resume updated successfully!', 'success')
//       if (onProfileUpdate) onProfileUpdate()
//     } catch (error) {
//       showToast(error.message || 'Failed to upload resume', 'error')
//     } finally {
//       setUploading(false)
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleResumeFileSelect = (e) => {
//     const file = e.target.files[0]
//     const validation = validateFile(file)
    
//     if (!validation.isValid) {
//       showToast(validation.error, 'error')
//       e.target.value = ''
//       return
//     }
    
//     setResumeFile(file)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     // Validate passwords if provided
//     if (formData.newPassword || formData.oldPassword) {
//       if (!formData.oldPassword) {
//         showToast('Please enter your old password', 'error')
//         return
//       }
//       if (!formData.newPassword) {
//         showToast('Please enter a new password', 'error')
//         return
//       }
//       if (formData.newPassword !== formData.confirmPassword) {
//         showToast('New passwords do not match', 'error')
//         return
//       }
//       if (formData.newPassword.length < 6) {
//         showToast('New password must be at least 6 characters', 'error')
//         return
//       }
//     }

//     setUpdating(true)
//     try {
//       const updateData = new FormData()
//       updateData.append('name', formData.name)
//       updateData.append('rollNo', formData.rollNo)
//       updateData.append('semester', formData.semester)
//       updateData.append('course', formData.course)
//       updateData.append('graduationYear', formData.graduationYear)
//       updateData.append('cgpa', formData.cgpa)
//       updateData.append('activeBacklogs', formData.activeBacklogs)
//       updateData.append('branch', formData.branch)
//       updateData.append('year', formData.year)
      
//       if (formData.oldPassword && formData.newPassword) {
//         updateData.append('oldPassword', formData.oldPassword)
//         updateData.append('newPassword', formData.newPassword)
//       }
      
//       if (resumeFile) {
//         updateData.append('resume', resumeFile)
//       }

//       await studentAPI.updateProfile(updateData)
//       showToast('Profile updated successfully! 🎉', 'success')
//       setShowUpdateModal(false)
//       setFormData(prev => ({
//         ...prev,
//         oldPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       }))
//       setResumeFile(null)
      
//       // Refresh user data
//       if (onProfileUpdate) {
//         onProfileUpdate()
//       }
      
//       // Reload page to refresh auth context
//       setTimeout(() => {
//         window.location.reload()
//       }, 1500)
      
//     } catch (error) {
//       showToast(error.message || 'Failed to update profile', 'error')
//     } finally {
//       setUpdating(false)
//     }
//   }

//   const profileFields = [
//     { icon: 'user', label: 'Full Name', value: user?.name || 'Not provided', color: 'text-blue-400' },
//     { icon: 'envelope', label: 'Email Address', value: user?.email, color: 'text-purple-400' },
//     { icon: 'id-card', label: 'Roll Number', value: user?.details?.rollNo || 'Not provided', color: 'text-green-400' },
//     { icon: 'book-open', label: 'Semester', value: user?.details?.semester || 'Not provided', color: 'text-yellow-400' },
//     { icon: 'graduation-cap', label: 'Course', value: user?.details?.course || 'Not provided', color: 'text-orange-400' },
//     { icon: 'code-branch', label: 'Branch', value: user?.details?.branch || 'Not provided', color: 'text-pink-400' },
//     { icon: 'calendar', label: 'Year', value: user?.details?.year || 'Not provided', color: 'text-indigo-400' },
//     { icon: 'calendar-check', label: 'Graduation Year', value: user?.details?.graduationYear || 'Not provided', color: 'text-cyan-400' },
//     { icon: 'chart-line', label: 'CGPA', value: user?.details?.cgpa ? `${user.details.cgpa}` : 'Not provided', color: 'text-teal-400' },
//     { icon: 'exclamation-triangle', label: 'Active Backlogs', value: user?.details?.activeBacklogs !== undefined ? user.details.activeBacklogs : 'Not provided', color: 'text-red-400' }
//   ]

//   const isProfileComplete = user?.details?.rollNo && user?.details?.semester && 
//                             user?.details?.course && user?.details?.graduationYear && 
//                             user?.defaultResume

//   return (
//     <div className="space-y-6">
//       {/* Header with Update Button */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-white mb-1">Your Profile</h2>
//           <p className="text-gray-400">Manage your profile information</p>
//         </div>
//         <button
//           onClick={() => setShowUpdateModal(true)}
//           className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-6 py-3 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
//         >
//           <i className="fas fa-edit"></i>
//           <span className="font-medium">Update Profile</span>
//         </button>
//       </div>

//       {/* Profile Completion Status */}
//       {!isProfileComplete && (
//         <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start space-x-3">
//           <i className="fas fa-exclamation-triangle text-yellow-500 text-xl mt-1"></i>
//           <div>
//             <h3 className="text-yellow-400 font-semibold mb-1">Incomplete Profile</h3>
//             <p className="text-gray-300 text-sm">
//               Please complete all fields and upload your resume to unlock all features.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Profile Card */}
//       <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
//         {/* Profile Header */}
//         <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-8 border-b border-gray-700/50">
//           <div className="flex items-center space-x-6">
//             <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
//               {user?.name?.charAt(0) || 'U'}
//             </div>
//             <div>
//               <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
//                 {user?.name || 'User Name'}
//               </h3>
//               <p className="text-gray-400 mt-1 flex items-center">
//                 <i className={`fas fa-circle ${isProfileComplete ? 'text-green-500' : 'text-yellow-500'} text-xs mr-2 animate-pulse`}></i>
//                 {isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Profile Details Grid */}
//         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//           {profileFields.map((field, index) => (
//             <div 
//               key={index}
//               className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30 hover:border-gray-600/50 transition-all duration-200"
//             >
//               <div className="flex items-center space-x-3">
//                 <div className={`w-10 h-10 bg-gray-600/50 rounded-lg flex items-center justify-center ${field.color}`}>
//                   <i className={`fas fa-${field.icon}`}></i>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{field.label}</p>
//                   <p className="text-white font-semibold mt-0.5">{field.value}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Resume Section */}
//       <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
//         <div className="flex items-start space-x-4 mb-4">
//           <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
//             <i className="fas fa-file-pdf text-white text-xl"></i>
//           </div>
//           <div className="flex-1">
//             <h3 className="text-xl font-bold text-white mb-1">Resume</h3>
//             <p className="text-gray-400 text-sm">Your uploaded resume for applications</p>
//           </div>
//         </div>

//         {user?.defaultResume ? (
//           <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl p-4">
//             <div className="flex items-center space-x-3">
//               <i className="fas fa-check-circle text-green-400 text-xl"></i>
//               <p className="text-green-400 font-medium">Resume uploaded successfully</p>
//             </div>
//             <a 
//               href={user.defaultResume} 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="text-green-400 hover:text-green-300 transition-colors flex items-center space-x-2"
//             >
//               <span>View</span>
//               <i className="fas fa-external-link-alt"></i>
//             </a>
//           </div>
//         ) : (
//           <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3">
//             <i className="fas fa-times-circle text-red-400 text-xl mt-1"></i>
//             <div>
//               <p className="text-red-400 font-medium">No resume uploaded</p>
//               <p className="text-gray-400 text-sm mt-1">Please upload your resume to complete your profile</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Update Profile Modal */}
//       <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} title="Update & Complete Profile">
//         <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
//           {/* Personal Information */}
//           <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
//             <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
//               <i className="fas fa-user-circle mr-2 text-blue-400"></i>
//               Personal Information
//             </h4>
            
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
//                   placeholder="Enter your full name"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Academic Information */}
//           <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
//             <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
//               <i className="fas fa-graduation-cap mr-2 text-purple-400"></i>
//               Academic Information
//             </h4>
            
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">Roll Number *</label>
//                 <input
//                   type="text"
//                   name="rollNo"
//                   value={formData.rollNo}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
//                   placeholder="e.g., CS23B1001"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">Semester *</label>
//                 <select
//                   name="semester"
//                   value={formData.semester}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
//                 >
//                   <option value="">Select Semester</option>
//                   {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
//                     <option key={sem} value={sem}>{sem}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">Course *</label>
//                 <select
//                   name="course"
//                   value={formData.course}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
//                 >
//                   <option value="">Select Course</option>
//                   <option value="B.Tech">B.Tech</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">Branch *</label>
//                 <select
//                   name="branch"
//                   value={formData.branch}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
//                 >
//                   <option value="">Select Branch</option>
//                   <option value="Computer Science and Engineering">Computer Science and Engineering</option>
//                   <option value="Artificial Intelligence and Data Science">Artificial Intelligence and Data Science</option>
//                   <option value="Mathematics and Computing">Mathematics and Computing</option>
          
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">Year *</label>
//                 <select
//                   name="year"
//                   value={formData.year}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
//                 >
//                   <option value="">Select Year</option>
//                   <option value="1st Year">1st Year</option>
//                   <option value="2nd Year">2nd Year</option>
//                   <option value="3rd Year">3rd Year</option>
//                   <option value="4th Year">4th Year</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">Graduation Year *</label>
//                 <input
//                   type="number"
//                   name="graduationYear"
//                   value={formData.graduationYear}
//                   onChange={handleInputChange}
//                   required
//                   min="2020"
//                   max="2030"
//                   className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
//                   placeholder="e.g., 2025"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">CGPA *</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   name="cgpa"
//                   value={formData.cgpa}
//                   onChange={handleInputChange}
//                   required
//                   min="0"
//                   max="10"
//                   className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
//                   placeholder="e.g., 8.5"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">Active Backlogs</label>
//                 <input
//                   type="number"
//                   name="activeBacklogs"
//                   value={formData.activeBacklogs}
//                   onChange={handleInputChange}
//                   min="0"
//                   className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
//                   placeholder="0"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Resume Upload */}
//           <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
//             <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
//               <i className="fas fa-file-pdf mr-2 text-orange-400"></i>
//               Upload Resume *
//             </h4>
            
//             <input
//               type="file"
//               accept=".pdf"
//               onChange={handleResumeFileSelect}
//               className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500/20 file:text-orange-400 hover:file:bg-orange-500/30"
//             />
//             {resumeFile && (
//               <p className="text-green-400 text-sm mt-2 flex items-center">
//                 <i className="fas fa-check-circle mr-2"></i>
//                 {resumeFile.name}
//               </p>
//             )}
//           </div>

//           {/* Password Change (Optional) */}
//           <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
//             <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
//               <i className="fas fa-lock mr-2 text-green-400"></i>
//               Change Password (Optional)
//             </h4>
            
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">Old Password</label>
//                 <input
//                   type="password"
//                   name="oldPassword"
//                   value={formData.oldPassword}
//                   onChange={handleInputChange}
//                   className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
//                   placeholder="Enter old password"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
//                 <input
//                   type="password"
//                   name="newPasswo  rd"
//                   value={formData.newPassword}
//                   onChange={handleInputChange}
//                   className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
//                   placeholder="Enter new password"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
//                   placeholder="Confirm new password"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Submit Buttons */}
//           <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-gray-800 pb-2">
//             <button
//               type="button"
//               onClick={() => setShowUpdateModal(false)}
//               disabled={updating}
//               className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={updating}
//               className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {updating ? (
//                 <>
//                   <i className="fas fa-spinner fa-spin"></i>
//                   <span>Updating...</span>
//                 </>
//               ) : (
//                 <>
//                   <i className="fas fa-save"></i>
//                   <span>Save & Continue</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   )
// }

// export default ProfileTab


import { useState, useEffect } from 'react'
import { studentAPI } from '../../utils/api'
import { validateFile } from '../../utils/validation'
import Modal from '../Shared/Modal'

const ProfileTab = ({ user, showToast, onProfileUpdate }) => {
  const [uploading, setUploading] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    rollNo: user?.details?.rollNo || '',
    semester: user?.details?.semester || '',
    course: user?.details?.course || '',
    graduationYear: user?.details?.graduationYear || '',
    cgpa: user?.details?.cgpa || '',
    activeBacklogs: user?.details?.activeBacklogs || '',
    branch: user?.details?.branch || '',
    year: user?.details?.year || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [resumeFile, setResumeFile] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      rollNo: user?.details?.rollNo || '',
      semester: user?.details?.semester || '',
      course: user?.details?.course || '',
      graduationYear: user?.details?.graduationYear || '',
      cgpa: user?.details?.cgpa || '',
      activeBacklogs: user?.details?.activeBacklogs || '',
      branch: user?.details?.branch || '',
      year: user?.details?.year || '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }, [user])

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]

    const validation = validateFile(file)
    if (!validation.isValid) {
      showToast(validation.error, 'error')
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      await studentAPI.uploadResume(file)
      showToast('Resume updated successfully!', 'success')
      if (onProfileUpdate) onProfileUpdate()
    } catch (error) {
      showToast(error.message || 'Failed to upload resume', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleResumeFileSelect = (e) => {
    const file = e.target.files[0]
    const validation = validateFile(file)

    if (!validation.isValid) {
      showToast(validation.error, 'error')
      e.target.value = ''
      return
    }

    setResumeFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.newPassword || formData.oldPassword) {
      if (!formData.oldPassword) {
        showToast('Please enter your old password', 'error')
        return
      }
      if (!formData.newPassword) {
        showToast('Please enter a new password', 'error')
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        showToast('New passwords do not match', 'error')
        return
      }
      if (formData.newPassword.length < 6) {
        showToast('New password must be at least 6 characters', 'error')
        return
      }
    }

    setUpdating(true)
    try {
      const updateData = new FormData()
      updateData.append('name', formData.name)
      updateData.append('rollNo', formData.rollNo)
      updateData.append('semester', formData.semester)
      updateData.append('course', formData.course)
      updateData.append('graduationYear', formData.graduationYear)
      updateData.append('cgpa', formData.cgpa)
      updateData.append('activeBacklogs', formData.activeBacklogs)
      updateData.append('branch', formData.branch)
      updateData.append('year', formData.year)

      if (formData.oldPassword && formData.newPassword) {
        updateData.append('oldPassword', formData.oldPassword)
        updateData.append('newPassword', formData.newPassword)
      }

      if (resumeFile) {
        updateData.append('resume', resumeFile)
      }

      await studentAPI.updateProfile(updateData)
      showToast('Profile updated successfully! 🎉', 'success')
      setShowUpdateModal(false)
      setFormData(prev => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
      setResumeFile(null)

      if (onProfileUpdate) {
        onProfileUpdate()
      }

      // Removed window.location.reload()
    } catch (error) {
      showToast(error.message || 'Failed to update profile', 'error')
    } finally {
      setUpdating(false)
    }
  }

  const profileFields = [
    { icon: 'user', label: 'Full Name', value: user?.name || 'Not provided', color: 'text-blue-400' },
    { icon: 'envelope', label: 'Email Address', value: user?.email, color: 'text-purple-400' },
    { icon: 'id-card', label: 'Roll Number', value: user?.details?.rollNo || 'Not provided', color: 'text-green-400' },
    { icon: 'book-open', label: 'Semester', value: user?.details?.semester || 'Not provided', color: 'text-yellow-400' },
    { icon: 'graduation-cap', label: 'Course', value: user?.details?.course || 'Not provided', color: 'text-orange-400' },
    { icon: 'code-branch', label: 'Branch', value: user?.details?.branch || 'Not provided', color: 'text-pink-400' },
    { icon: 'calendar', label: 'Year', value: user?.details?.year || 'Not provided', color: 'text-indigo-400' },
    { icon: 'calendar-check', label: 'Graduation Year', value: user?.details?.graduationYear || 'Not provided', color: 'text-cyan-400' },
    { icon: 'chart-line', label: 'CGPA', value: user?.details?.cgpa ? `${user.details.cgpa}` : 'Not provided', color: 'text-teal-400' },
    { icon: 'exclamation-triangle', label: 'Active Backlogs', value: user?.details?.activeBacklogs !== undefined ? user.details.activeBacklogs : 'Not provided', color: 'text-red-400' }
  ]

  const isProfileComplete = user?.details?.rollNo && user?.details?.semester &&
                            user?.details?.course && user?.details?.graduationYear &&
                            user?.defaultResume


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Your Profile</h2>
          <p className="text-gray-400">Manage your profile information</p>
        </div>
        <button
          onClick={() => setShowUpdateModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-6 py-3 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
        >
          <i className="fas fa-edit"></i>
          <span className="font-medium">Update Profile</span>
        </button>
      </div>

      {!isProfileComplete && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start space-x-3">
          <i className="fas fa-exclamation-triangle text-yellow-500 text-xl mt-1"></i>
          <div>
            <h3 className="text-yellow-400 font-semibold mb-1">Incomplete Profile</h3>
            <p className="text-gray-300 text-sm">
              Please complete all fields and upload your resume to unlock all features.
            </p>
          </div>
        </div>
      )}

      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-8 border-b border-gray-700/50">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {user?.name || 'User Name'}
              </h3>
              <p className="text-gray-400 mt-1 flex items-center">
                <i className={`fas fa-circle ${isProfileComplete ? 'text-green-500' : 'text-yellow-500'} text-xs mr-2 animate-pulse`}></i>
                {isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileFields.map((field, index) => (
            <div
              key={index}
              className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30 hover:border-gray-600/50 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gray-600/50 rounded-lg flex items-center justify-center ${field.color}`}>
                  <i className={`fas fa-${field.icon}`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{field.label}</p>
                  <p className="text-white font-semibold mt-0.5">{field.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-file-pdf text-white text-xl"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">Resume</h3>
            <p className="text-gray-400 text-sm">Your uploaded resume for applications</p>
          </div>
        </div>

        {user?.defaultResume ? (
          <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <i className="fas fa-check-circle text-green-400 text-xl"></i>
              <p className="text-green-400 font-medium">Resume uploaded successfully</p>
            </div>
            <a
              href={user.defaultResume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors flex items-center space-x-2"
            >
              <span>View</span>
              <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        ) : (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3">
            <i className="fas fa-times-circle text-red-400 text-xl mt-1"></i>
            <div>
              <p className="text-red-400 font-medium">No resume uploaded</p>
              <p className="text-gray-400 text-sm mt-1">Please upload your resume to complete your profile</p>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} title="Update & Complete Profile">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <i className="fas fa-user-circle mr-2 text-blue-400"></i>
              Personal Information
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <i className="fas fa-graduation-cap mr-2 text-purple-400"></i>
              Academic Information
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Roll Number *</label>
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="e.g., CS23B1001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Semester *</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Course *</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="">Select Course</option>
                  <option value="B.Tech">B.Tech</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Branch *</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="">Select Branch</option>
                  <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                  <option value="Artificial Intelligence and Data Science">Artificial Intelligence and Data Science</option>
                  <option value="Mathematics and Computing">Mathematics and Computing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Year *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Graduation Year *</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  required
                  min="2020"
                  max="2030"
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="e.g., 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">CGPA *</label>
                <input
                  type="number"
                  step="0.01"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="10"
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="e.g., 8.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Active Backlogs</label>
                <input
                  type="number"
                  name="activeBacklogs"
                  value={formData.activeBacklogs}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <i className="fas fa-file-pdf mr-2 text-orange-400"></i>
              Upload Resume *
            </h4>

            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeFileSelect}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500/20 file:text-orange-400 hover:file:bg-orange-500/30"
            />
            {resumeFile && (
              <p className="text-green-400 text-sm mt-2 flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                {resumeFile.name}
              </p>
            )}
          </div>

          <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <i className="fas fa-lock mr-2 text-green-400"></i>
              Change Password (Optional)
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Old Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                  placeholder="Enter old password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-gray-800 pb-2">
            <button
              type="button"
              onClick={() => setShowUpdateModal(false)}
              disabled={updating}
              className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>Save & Continue</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ProfileTab
