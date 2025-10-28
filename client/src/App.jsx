import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './components/Auth/Login'
import ProfileSetup from './components/Auth/ProfileSetup'
import StudentDashboard from './components/Student/Dashboard'
import CoordinatorDashboard from './components/Coordinator/Dashboard'
import Loading from './components/Shared/Loading'

function App() {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          isAuthenticated ? (
            user?.role === 'student' ? <Navigate to="/student/dashboard" /> : <Navigate to="/coordinator/dashboard" />
          ) : <Login />
        } />
        
        <Route path="/profile-setup" element={
          isAuthenticated && user?.role === 'student' && !user?.profileIsCompleted ? 
            <ProfileSetup /> : 
            <Navigate to="/" />
        } />
        
        <Route path="/student/dashboard" element={
          isAuthenticated && user?.role === 'student' ? 
            (user?.profileIsCompleted ? <StudentDashboard /> : <Navigate to="/profile-setup" />) :
            <Navigate to="/" />
        } />
        
        <Route path="/coordinator/dashboard" element={
          isAuthenticated && user?.role === 'coordinator' ? 
            <CoordinatorDashboard /> :  
            <Navigate to="/" />
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App