const Overview = ({ stats }) => {
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
    { icon: 'user-plus', label: 'Manage Students', color: 'from-blue-500 to-cyan-500' },
    { icon: 'building', label: 'Add Company', color: 'from-green-500 to-emerald-500' },
    { icon: 'download', label: 'Download Resumes', color: 'from-purple-500 to-pink-500' }
  ]

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
              className={`group bg-gradient-to-br ${action.color} p-6 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <i className={`fas fa-${action.icon} text-3xl text-white`}></i>
                </div>
                <span className="font-semibold text-white text-lg">{action.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Overview
