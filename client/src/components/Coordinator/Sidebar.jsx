import React from 'react'
const Sidebar = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { key: 'overview', icon: 'th-large', label: 'Overview', color: 'from-blue-500 to-cyan-500' },
    { key: 'students', icon: 'users', label: 'Students', color: 'from-green-500 to-emerald-500' },
    { key: 'companies', icon: 'building', label: 'Companies', color: 'from-purple-500 to-pink-500' },
    { key: 'resumes', icon: 'file-alt', label: 'Resumes', color: 'from-orange-500 to-red-500' }
  ]

  return (
    <aside className="w-72 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map(({ key, icon, label, color }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`w-full group relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              activeSection === key
                ? 'bg-gradient-to-r ' + color + ' text-white shadow-lg shadow-blue-500/20'
                : 'hover:bg-gray-700/50 text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              activeSection === key 
                ? 'bg-white/20' 
                : 'bg-gray-700/50 group-hover:bg-gray-600/50'
            }`}>
              <i className={`fas fa-${icon} text-lg`}></i>
            </div>
            <span className="font-medium">{label}</span>
            {activeSection === key && (
              <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
