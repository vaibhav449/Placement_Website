import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { studentAPI } from '../../utils/api'
import { validateFile } from '../../utils/validation'
import Toast from '../Shared/Toast'
import '../../styles/Auth.css'

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    course: '',
    batch: '',
    semester: '',
    graduationYear: ''
  })
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const { updateUser } = useAuth()
  const { toasts, showToast, removeToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    const validation = validateFile(file)
    
    if (!validation.isValid) {
      showToast(validation.error, 'error')
      e.target.value = ''
      return
    }
    
    setResume(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!resume) {
      showToast('Please upload your resume', 'error')
      return
    }

    setLoading(true)

    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key])
      })
      data.append('resume', resume)

      await studentAPI.completeProfile(data)
      
      updateUser({ 
        ...formData,
        profileIsCompleted: true 
      })
      
      showToast('Profile completed successfully!', 'success')
      setTimeout(() => navigate('/student/dashboard'), 1000)
    } catch (error) {
      showToast(error.message || 'Failed to complete profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-setup-page">
      <div className="profile-setup-container">
        <div className="profile-setup-header">
          <div className="profile-icon">
            <i className="fas fa-user-circle"></i>
          </div>
          <h1>Complete Your Profile</h1>
          <p>Please fill in your details to access the placement portal</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                <i className="fas fa-user"></i> Full Name *
              </label>
              <input 
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rollNo">
                <i className="fas fa-id-card"></i> Roll Number *
              </label>
              <input 
                type="text"
                id="rollNo"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="course">
                <i className="fas fa-book"></i> Course *
              </label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select your course</option>
                <option value="B.Tech CSE">B.Tech CSE</option>
                <option value="B.Tech ECE">B.Tech ECE</option>
                <option value="B.Tech EE">B.Tech EE</option>
                <option value="B.Tech ME">B.Tech ME</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="batch">
                <i className="fas fa-calendar"></i> Batch *
              </label>
              <select
                id="batch"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select your batch</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="semester">
                <i className="fas fa-graduation-cap"></i> Current Semester *
              </label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select semester</option>
                {[1,2,3,4,5,6,7,8].map(sem => (
                  <option key={sem} value={sem}>{sem} Semester</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="graduationYear">
                <i className="fas fa-calendar-check"></i> Graduation Year *
              </label>
              <select
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select year</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="resume">
              <i className="fas fa-file-pdf"></i> Upload Resume * (PDF only, max 5MB)
            </label>
            <label htmlFor="resume" className="file-upload-label">
              <i className="fas fa-cloud-upload-alt"></i>
              <span className="file-upload-text">
                {resume ? resume.name : 'Click to upload resume'}
              </span>
              <span className="file-upload-subtext">or drag and drop</span>
            </label>
            <input 
              type="file"
              id="resume"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
              required
            />
          </div>

          <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={loading}>
            <i className="fas fa-check-circle"></i>
            {loading ? 'Completing Profile...' : 'Complete Profile'}
          </button>
        </form>
      </div>

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export default ProfileSetup