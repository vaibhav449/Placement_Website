import { useState } from 'react'
import { studentAPI } from '../../utils/api'
import { validateFile } from '../../utils/validation'

const ProfileTab = ({ user, showToast }) => {
  const [uploading, setUploading] = useState(false)

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
    } catch (error) {
      showToast(error.message || 'Failed to upload resume', 'error')
    } finally {
      setUploading(false)
    }
  }

  const profileFields = [
    { icon: 'user', label: 'Full Name', value: user?.name || 'Not provided', color: 'text-blue-400' },
    { icon: 'envelope', label: 'Email Address', value: user?.email, color: 'text-purple-400' },
    { icon: 'id-card', label: 'Roll Number', value: user?.rollNo || 'Not provided', color: 'text-green-400' },
    { icon: 'graduation-cap', label: 'Course', value: user?.course || 'Not provided', color: 'text-orange-400' },
    { icon: 'calendar', label: 'Batch', value: user?.batch || 'Not provided', color: 'text-pink-400' },
    { icon: 'book', label: 'Cgpa', value: user?.cgpa ? `${user.cgpa} CGPA` : 'Not provided', color: 'text-cyan-400' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Your Profile</h2>
        <p className="text-gray-400">Manage your profile information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
        {/* Profile Header */}
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
                <i className="fas fa-circle text-green-500 text-xs mr-2 animate-pulse"></i>
                Active Student
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
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

      {/* Resume Upload Section */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-file-upload text-white text-xl"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">Upload Resume</h3>
            <p className="text-gray-400 text-sm">Keep your resume up to date for better opportunities</p>
          </div>
        </div>

        <div className="relative">
          <input
            type="file"
            id="resume-upload"
            accept=".pdf"
            onChange={handleResumeUpload}
            disabled={uploading}
            className="hidden"
          />
          <label
            htmlFor="resume-upload"
            className={`block w-full border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              uploading 
                ? 'bg-gray-700/30 cursor-not-allowed' 
                : 'hover:border-orange-500/50 hover:bg-gray-700/30'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center space-y-3">
                <i className="fas fa-spinner fa-spin text-4xl text-orange-400"></i>
                <p className="text-gray-400 font-medium">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <i className="fas fa-cloud-upload-alt text-4xl text-orange-400"></i>
                <div>
                  <p className="text-white font-medium">Click to upload or drag and drop</p>
                  <p className="text-gray-400 text-sm mt-1">PDF files only (Max 5MB)</p>
                </div>
              </div>
            )}
          </label>
        </div>

        {user?.resumeUrl && (
          <div className="mt-4 flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <i className="fas fa-check-circle text-green-400 text-xl"></i>
              <p className="text-green-400 font-medium">Resume uploaded successfully</p>
            </div>
            <a 
              href={user.resumeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileTab
