import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import Toast from '../Shared/Toast'
import '../../styles/Auth.css'

const Login = () => {
  const [loginRole, setLoginRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const { toasts, showToast, removeToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    console.log("Login attempt");
    e.preventDefault()
    setLoading(true)

    const result = await login(email, password, loginRole)
    
    if (result.success) {
      showToast('Login successful!', 'success')
      if (result.user.role === 'student') {
        if (result.user.profileIsCompleted) {
          navigate('/student/dashboard')
        } else {
          navigate('/profile-setup')
        }
      } else {
        navigate('/coordinator/dashboard')
      }
    } else {
      showToast(result.error, 'error')
    }
    
    setLoading(false)
  }

  return (
    <div className="landing-page">
      <div className="landing-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <header className="landing-header">
        <div className="container">
          <div className="logo-section">
            <i className="fas fa-graduation-cap"></i>
            <span>IIIT Raichur Placement Portal</span>
          </div>
        </div>
      </header>

      <main className="landing-main">
        <div className="container">
          <div className="landing-grid">
            <div className="landing-info">
              <h1 className="landing-title">
                Welcome to <br/>
                <span className="highlight">Placement Portal</span>
              </h1>
              <p className="landing-subtitle">
                Your gateway to career opportunities. Connect with top companies and build your future.
              </p>
              <div className="landing-features">
                <div className="feature-item">
                  <i className="fas fa-briefcase"></i>
                  <span>Access top companies</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-chart-line"></i>
                  <span>Track your applications</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-bell"></i>
                  <span>Get instant updates</span>
                </div>
              </div>
            </div>

            <div className="landing-login">
              <div className="login-card">
                <div className="role-toggle">
                  <button 
                    className={`role-btn ${loginRole === 'student' ? 'active' : ''}`}
                    onClick={() => setLoginRole('student')}
                  >
                    <i className="fas fa-user-graduate"></i>
                    <span>Student</span>
                  </button>
                  <button 
                    className={`role-btn ${loginRole === 'coordinator' ? 'active' : ''}`}
                    onClick={() => setLoginRole('coordinator')}
                  >
                    <i className="fas fa-user-tie"></i>
                    <span>Coordinator</span>
                  </button>
                  <div className="role-toggle-slider" style={{
                    transform: loginRole === 'student' ? 'translateX(0)' : 'translateX(100%)'
                  }}></div>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-group">
                    <label htmlFor="email">
                      <i className="fas fa-envelope"></i> Email Address
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">
                      <i className="fas fa-lock"></i> Password
                    </label>
                    <div className="password-input-wrapper">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Enter your password"
                        required
                      />
                      <button 
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
                    <span className="btn-text">{loading ? 'Signing in...' : 'Sign In'}</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </form>

                <div className="demo-info">
                  <p className="demo-title">Demo Credentials:</p>
                  <div className="demo-credentials">
                    <div className="demo-cred-item">
                      <strong>Student:</strong> student@iiitr.ac.in / password
                    </div>
                    <div className="demo-cred-item">
                      <strong>Coordinator:</strong> coordinator@iiitr.ac.in / password
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2025 IIIT Raichur. All rights reserved.</p>
      </footer>

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export default Login