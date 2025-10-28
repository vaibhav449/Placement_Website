import React from 'react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-gray-800/95 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
            <i className="fas fa-graduation-cap text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              IIIT Raichur
            </h1>
            <p className="text-xs text-gray-400">Placement Portal</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg px-4 py-2 transition-all duration-200 border border-gray-600/50"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white text-sm"></i>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-200">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role || 'Role'}</p>
            </div>
            <i className={`fas fa-chevron-down text-gray-400 text-sm transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}></i>
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border-b border-gray-700/50">
                  <p className="text-sm font-medium text-gray-200">{user?.email}</p>
                  <p className="text-xs text-gray-400 mt-1 capitalize">
                    <i className="fas fa-circle text-green-500 text-xs mr-1"></i>
                    {user?.role || 'Role'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left hover:bg-red-500/10 flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
