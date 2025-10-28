import React from 'react'
import { formatDate } from '../../utils/helpers'

const ApplicationsTab = ({ applications }) => {
  if (applications.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700/50">
        <div className="mb-6">
          <i className="fas fa-paper-plane text-6xl text-gray-600"></i>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No applications yet</h3>
        <p className="text-gray-400">Start applying to companies to track your applications here</p>
      </div>
    )
  }
  // console.log("Rendering ApplicationsTab with applications:", applications[0].companyId.title)
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'accepted':
        return 'from-green-500 to-emerald-500'
      case 'rejected':
        return 'from-red-500 to-pink-500'
      case 'applied':
      default:
        return 'from-blue-500 to-cyan-500'
    }
  }

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'accepted':
        return 'fa-check-circle'
      case 'rejected':
        return 'fa-times-circle'
      case 'applied':
      default:
        return 'fa-clock'
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Your Applications</h2>
        <p className="text-gray-400">Track your application status</p>
      </div>

      <div className="space-y-4">
        {applications.map(app => (
          <div 
            key={app._id}
            className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-building text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {app.companyId.title || 'Company Name'}
                    </h3>
                    <p className="text-gray-400 text-sm flex items-center">
                      <i className="fas fa-calendar-alt mr-2"></i>
                      Applied on {formatDate(app.createdAt)}
                    </p>
                  </div>
                </div>
                
                <span className={`px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${getStatusColor(app.status)} text-white shadow-lg flex items-center space-x-2`}>
                  <i className={`fas ${getStatusIcon(app.status)}`}></i>
                  <span className="capitalize">{app.status}</span>
                </span>
              </div>

              {app.comments && (
                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                  <p className="text-sm text-gray-300">
                    <i className="fas fa-comment-dots mr-2 text-blue-400"></i>
                    {app.comments}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ApplicationsTab
