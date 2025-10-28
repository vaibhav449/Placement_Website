import React from 'react'
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-2xl transform transition-all animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg p-2 transition-all duration-200"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="p-6 text-gray-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
