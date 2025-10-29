// import { useState, useEffect } from 'react'
// import { useAuth } from '../../hooks/useAuth'
// import { useToast } from '../../hooks/useToast'
// import { studentAPI } from '../../utils/api'
// import Header from '../Shared/Header'
// import CompaniesTab from './CompaniesTab'
// import ApplicationsTab from './ApplicationsTab'
// import ProfileTab from './ProfileTab'
// import Toast from '../Shared/Toast'
// import Loading from '../Shared/Loading'

// const StudentDashboard = () => {
//   const [activeTab, setActiveTab] = useState('companies')
//   const [companies, setCompanies] = useState([])
//   const [applications, setApplications] = useState([])
//   const [loading, setLoading] = useState(true)
  
//   const { user } = useAuth()
//   const { toasts, showToast, removeToast } = useToast()

//   // Check if profile is complete
//   const isProfileComplete = () => {
//     return (
//       user?.rollNo && 
//       user?.course && 
//       user?.batch && 
//       user?.cgpa && 
//       user?.resume
//     )
//   }

//   useEffect(() => {
//     fetchData()
    
//     // Force user to profile tab if incomplete
//     if (!isProfileComplete()) {
//       setActiveTab('profile')
//     }
//   }, [])

//   const fetchData = async () => {
//     try {
//       const [companiesData, applicationsData] = await Promise.all([
//         studentAPI.getCompanies(),
//         studentAPI.getApplications()
//       ])
      
//       setCompanies(companiesData.companies || [])
//       setApplications(applicationsData.applications || [])
//     } catch (error) {
//       showToast('Failed to fetch data', 'error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleApply = async (companyId) => {
//     try {
//       await studentAPI.applyToCompany(companyId)
//       showToast('Applied successfully!', 'success')
//       fetchData()
//     } catch (error) {
//       showToast(error.message || 'Application failed', 'error')
//     }
//   }

//   const handleTabChange = (tabKey) => {
//     // Prevent switching tabs if profile is incomplete
//     if (!isProfileComplete() && tabKey !== 'profile') {
//       showToast('Please complete your profile first!', 'error')
//       return
//     }
//     setActiveTab(tabKey)
//   }

//   if (loading) return <Loading />

//   const tabs = [
//     { key: 'companies', icon: 'building', label: 'Companies', color: 'from-blue-500 to-cyan-500' },
//     { key: 'applications', icon: 'paper-plane', label: 'Applications', color: 'from-purple-500 to-pink-500' },
//     { key: 'profile', icon: 'user', label: 'Profile', color: 'from-green-500 to-emerald-500' }
//   ]

//   const stats = [
//     {
//       value: companies.length,
//       label: 'Available Companies',
//       icon: 'building',
//       color: 'from-blue-500 to-cyan-500',
//       bgColor: 'bg-blue-500/10',
//       iconBg: 'bg-blue-500/20'
//     },
//     {
//       value: applications.length,
//       label: 'Your Applications',
//       icon: 'paper-plane',
//       color: 'from-purple-500 to-pink-500',
//       bgColor: 'bg-purple-500/10',
//       iconBg: 'bg-purple-500/20'
//     },
//     {
//       value: applications.filter(a => a.status === 'applied').length,
//       label: 'Pending Reviews',
//       icon: 'clock',
//       color: 'from-orange-500 to-red-500',
//       bgColor: 'bg-orange-500/10',
//       iconBg: 'bg-orange-500/20'
//     }
//   ]

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
//       <Header />

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8 animate-in fade-in duration-500">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
//             Welcome back, {user?.name}! 👋
//           </h1>
//           <p className="text-gray-400">Explore opportunities and track your applications</p>
          
//           {/* Profile Completion Warning */}
//           {!isProfileComplete() && (
//             <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start space-x-3">
//               <i className="fas fa-exclamation-triangle text-yellow-500 text-xl mt-1"></i>
//               <div>
//                 <h3 className="text-yellow-400 font-semibold mb-1">Complete Your Profile</h3>
//                 <p className="text-gray-300 text-sm">
//                   Please complete your profile (Roll No, Course, Batch, CGPA, Resume) to access companies and apply for placements.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {stats.map((stat, index) => (
//             <div 
//               key={index}
//               className={`${stat.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
//                   <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
//                 </div>
//                 <div className={`${stat.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center`}>
//                   <i className={`fas fa-${stat.icon} text-2xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}></i>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Tabs Navigation */}
//         <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden mb-6">
//           <div className="flex flex-wrap">
//             {tabs.map(tab => (
//               <button
//                 key={tab.key}
//                 onClick={() => handleTabChange(tab.key)}
//                 disabled={!isProfileComplete() && tab.key !== 'profile'}
//                 className={`flex-1 min-w-[120px] group relative flex items-center justify-center space-x-2 px-6 py-4 transition-all duration-200 ${
//                   activeTab === tab.key
//                     ? 'bg-gradient-to-r ' + tab.color + ' text-white'
//                     : 'hover:bg-gray-700/30 text-gray-400 hover:text-gray-200'
//                 } ${!isProfileComplete() && tab.key !== 'profile' ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 <i className={`fas fa-${tab.icon} text-lg`}></i>
//                 <span className="font-medium">{tab.label}</span>
//                 {!isProfileComplete() && tab.key !== 'profile' && (
//                   <i className="fas fa-lock text-xs ml-1"></i>
//                 )}
//                 {activeTab === tab.key && (
//                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="animate-in fade-in duration-300">
//           {activeTab === 'companies' && (
//             <CompaniesTab 
//               companies={companies} 
//               applications={applications}
//               onApply={handleApply}
//             />
//           )}
//           {activeTab === 'applications' && (
//             <ApplicationsTab applications={applications} />
//           )}
//           {activeTab === 'profile' && (
//             <ProfileTab 
//               user={user} 
//               showToast={showToast}
//               onProfileUpdate={fetchData}
//             />
//           )}
//         </div>
//       </main>

//       <Toast toasts={toasts} onClose={removeToast} />
//     </div>
//   )
// }

// export default StudentDashboard

// import { useState, useEffect } from 'react'
// import { useAuth } from '../../hooks/useAuth'
// import { useToast } from '../../hooks/useToast'
// import { studentAPI } from '../../utils/api'
// import Header from '../Shared/Header'
// import CompaniesTab from './CompaniesTab'
// import ApplicationsTab from './ApplicationsTab'
// import ProfileTab from './ProfileTab'
// import Toast from '../Shared/Toast'
// import Loading from '../Shared/Loading'

// const StudentDashboard = () => {
//   const [activeTab, setActiveTab] = useState('companies')
//   const [companies, setCompanies] = useState([])
//   const [applications, setApplications] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [userProfile, setUserProfile] = useState(null)
  
//   const { user, refreshUser } = useAuth()
//   const { toasts, showToast, removeToast } = useToast()

//   // Check if profile is complete based on actual schema
//   const isProfileComplete = () => {
//     if (!userProfile) return false
    
//     const details = userProfile.details || {}
//     return (
//       details.rollNo && 
//       details.semester && 
//       details.course && 
//       details.graduationYear && 
//       details.branch &&
//       details.year &&
//       userProfile.defaultResume
//     )
//   }

//   useEffect(() => {
//     fetchAllData()
//   }, [])

//   const fetchAllData = async () => {
//     try {
//       const [profileData, companiesData, applicationsData] = await Promise.all([
//         studentAPI.getProfile(),
//         studentAPI.getCompanies(),
//         studentAPI.getApplications()
//       ])
      
//       setUserProfile(profileData.student)
//       setCompanies(companiesData.companies || [])
//       setApplications(applicationsData.applications || [])
      
//       // Force profile tab if incomplete
//       if (!checkProfileComplete(profileData.student)) {
//         setActiveTab('profile')
//       }
//     } catch (error) {
//       showToast('Failed to fetch data', 'error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const checkProfileComplete = (profile) => {
//     if (!profile) return false
//     const details = profile.details || {}
//     return (
//       details.rollNo && 
//       details.semester && 
//       details.course && 
//       details.graduationYear && 
//       details.branch &&
//       details.year &&
//       profile.defaultResume
//     )
//   }

//   const handleApply = async (companyId) => {
//     try {
//       await studentAPI.applyToCompany(companyId)
//       showToast('Applied successfully!', 'success')
//       fetchAllData()
//     } catch (error) {
//       showToast(error.message || 'Application failed', 'error')
//     }
//   }

//   const handleTabChange = (tabKey) => {
//     // Prevent switching tabs if profile is incomplete
//     if (!isProfileComplete() && tabKey !== 'profile') {
//       showToast('Please complete your profile first!', 'error')
//       return
//     }
//     setActiveTab(tabKey)
//   }

//   const handleProfileUpdate = () => {
//     // Refresh all data after profile update
//     fetchAllData()
//   }

//   if (loading) return <Loading />

//   const tabs = [
//     { key: 'companies', icon: 'building', label: 'Companies', color: 'from-blue-500 to-cyan-500' },
//     { key: 'applications', icon: 'paper-plane', label: 'Applications', color: 'from-purple-500 to-pink-500' },
//     { key: 'profile', icon: 'user', label: 'Profile', color: 'from-green-500 to-emerald-500' }
//   ]

//   const stats = [
//     {
//       value: companies.length,
//       label: 'Available Companies',
//       icon: 'building',
//       color: 'from-blue-500 to-cyan-500',
//       bgColor: 'bg-blue-500/10',
//       iconBg: 'bg-blue-500/20'
//     },
//     {
//       value: applications.length,
//       label: 'Your Applications',
//       icon: 'paper-plane',
//       color: 'from-purple-500 to-pink-500',
//       bgColor: 'bg-purple-500/10',
//       iconBg: 'bg-purple-500/20'
//     },
//     {
//       value: applications.filter(a => a.status === 'applied').length,
//       label: 'Pending Reviews',
//       icon: 'clock',
//       color: 'from-orange-500 to-red-500',
//       bgColor: 'bg-orange-500/10',
//       iconBg: 'bg-orange-500/20'
//     }
//   ]

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
//       <Header />

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8 animate-in fade-in duration-500">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
//             Welcome back, {userProfile?.name || user?.name}! 👋
//           </h1>
//           <p className="text-gray-400">Explore opportunities and track your applications</p>
          
//           {/* Profile Completion Warning */}
//           {!isProfileComplete() && (
//             <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start space-x-3">
//               <i className="fas fa-exclamation-triangle text-yellow-500 text-xl mt-1"></i>
//               <div>
//                 <h3 className="text-yellow-400 font-semibold mb-1">Complete Your Profile</h3>
//                 <p className="text-gray-300 text-sm">
//                   Please complete your profile (Roll No, Semester, Course, Branch, Year, Graduation Year, CGPA, Resume) to access companies and apply for placements.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {stats.map((stat, index) => (
//             <div 
//               key={index}
//               className={`${stat.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
//                   <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
//                 </div>
//                 <div className={`${stat.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center`}>
//                   <i className={`fas fa-${stat.icon} text-2xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}></i>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Tabs Navigation */}
//         <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden mb-6">
//           <div className="flex flex-wrap">
//             {tabs.map(tab => (
//               <button
//                 key={tab.key}
//                 onClick={() => handleTabChange(tab.key)}
//                 disabled={!isProfileComplete() && tab.key !== 'profile'}
//                 className={`flex-1 min-w-[120px] group relative flex items-center justify-center space-x-2 px-6 py-4 transition-all duration-200 ${
//                   activeTab === tab.key
//                     ? 'bg-gradient-to-r ' + tab.color + ' text-white'
//                     : 'hover:bg-gray-700/30 text-gray-400 hover:text-gray-200'
//                 } ${!isProfileComplete() && tab.key !== 'profile' ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 <i className={`fas fa-${tab.icon} text-lg`}></i>
//                 <span className="font-medium">{tab.label}</span>
//                 {!isProfileComplete() && tab.key !== 'profile' && (
//                   <i className="fas fa-lock text-xs ml-1"></i>
//                 )}
//                 {activeTab === tab.key && (
//                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="animate-in fade-in duration-300">
//           {activeTab === 'companies' && (
//             <CompaniesTab 
//               companies={companies} 
//               applications={applications}
//               onApply={handleApply}
//             />
//           )}
//           {activeTab === 'applications' && (
//             <ApplicationsTab applications={applications} />
//           )}
//           {activeTab === 'profile' && (
//             <ProfileTab 
//               user={userProfile || user} 
//               showToast={showToast}
//               onProfileUpdate={handleProfileUpdate}
//             />
//           )}
//         </div>
//       </main>

//       <Toast toasts={toasts} onClose={removeToast} />
//     </div>
//   )
// }

// export default StudentDashboard

import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { studentAPI } from '../../utils/api'
import Header from '../Shared/Header'
import CompaniesTab from './CompaniesTab'
import ApplicationsTab from './ApplicationsTab'
import ProfileTab from './ProfileTab'
import Toast from '../Shared/Toast'
import Loading from '../Shared/Loading'

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('companies')
  const [companies, setCompanies] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  
  const { user } = useAuth()
  const { toasts, showToast, removeToast } = useToast()

  // Check if profile is complete
  const isProfileComplete = () => {
    if (!userProfile) return false
    const details = userProfile.details || {}
    return (
      details.rollNo && 
      details.semester && 
      details.course && 
      details.graduationYear && 
      details.branch &&
      details.year &&
      userProfile.defaultResume
    )
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [profileData, companiesData, applicationsData] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getCompanies(),  
        studentAPI.getApplications()
      ])
      console.log("Fetched profile data in dashboard:", applicationsData.data)
      setUserProfile(profileData.data.user)
      setCompanies(companiesData.data || [])
      setApplications(applicationsData.data || [])
      
      // Force profile tab if incomplete
      if (!checkProfileComplete(profileData.student)) {
        setActiveTab('profile')
      }
    } catch (error) {
      showToast('Failed to fetch data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const checkProfileComplete = (profile) => {
    if (!profile) return false
    const details = profile.details || {}
    return (
      details.rollNo && 
      details.semester && 
      details.course && 
      details.graduationYear && 
      details.branch &&
      details.year &&
      profile.defaultResume
    )
  }

const handleApply = async (companyId, resumeFile /* a File|Blob or undefined */) => {
  try {
    const formData = new FormData();
    formData.append('companyId', companyId);          // <- include companyId in the form body
    if (resumeFile) formData.append('resume', resumeFile); // field name MUST be "resume"

    await studentAPI.applyToCompany(formData);

    showToast('Applied successfully!', 'success');
    fetchAllData();
  } catch (error) {
    showToast(error?.response?.data?.message || error.message || 'Application failed', 'error');
  }
};

  const handleTabChange = (tabKey) => {
    // Prevent switching tabs if profile is incomplete
    if (!isProfileComplete() && tabKey !== 'profile') {
      showToast('Please complete your profile first!', 'error')
      return
    }
    setActiveTab(tabKey)
  }

  const handleProfileUpdate = () => {
    // Refresh all data after profile update
    fetchAllData()
  }

  if (loading) return <Loading />

  const tabs = [
    { key: 'companies', icon: 'building', label: 'Companies', color: 'from-blue-500 to-cyan-500' },
    { key: 'applications', icon: 'paper-plane', label: 'Applications', color: 'from-purple-500 to-pink-500' },
    { key: 'profile', icon: 'user', label: 'Profile', color: 'from-green-500 to-emerald-500' }
  ]

  const stats = [
    {
      value: companies.length,
      label: 'Available Companies',
      icon: 'building',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      iconBg: 'bg-blue-500/20'
    },
    {
      value: applications.length,
      label: 'Your Applications',
      icon: 'paper-plane',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      iconBg: 'bg-purple-500/20'
    },
    {
      value: applications.filter(a => a.status === 'applied').length,
      label: 'Pending Reviews',
      icon: 'clock',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      iconBg: 'bg-orange-500/20'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-in fade-in duration-500">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Welcome back, {userProfile?.name || user?.name}! 👋
          </h1>
          <p className="text-gray-400">Explore opportunities and track your applications</p>
          
          {/* Profile Completion Warning */}
          {!isProfileComplete() && (
            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start space-x-3">
              <i className="fas fa-exclamation-triangle text-yellow-500 text-xl mt-1"></i>
              <div>
                <h3 className="text-yellow-400 font-semibold mb-1">Complete Your Profile</h3>
                <p className="text-gray-300 text-sm">
                  Please complete your profile (Roll No, Semester, Course, Branch, Year, Graduation Year, CGPA, Resume) to access companies and apply for placements.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`${stat.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                </div>
                <div className={`${stat.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center`}>
                  <i className={`fas fa-${stat.icon} text-2xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Navigation */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden mb-6">
          <div className="flex flex-wrap">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                disabled={!isProfileComplete() && tab.key !== 'profile'}
                className={`flex-1 min-w-[120px] group relative flex items-center justify-center space-x-2 px-6 py-4 transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r ' + tab.color + ' text-white'
                    : 'hover:bg-gray-700/30 text-gray-400 hover:text-gray-200'
                } ${!isProfileComplete() && tab.key !== 'profile' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <i className={`fas fa-${tab.icon} text-lg`}></i>
                <span className="font-medium">{tab.label}</span>
                {!isProfileComplete() && tab.key !== 'profile' && (
                  <i className="fas fa-lock text-xs ml-1"></i>
                )}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'companies' && (
            <CompaniesTab 
              companies={companies} 
              applications={applications}
              onApply={handleApply}
            />
          )}
          {activeTab === 'applications' && (
            <ApplicationsTab applications={applications} />
          )}
          {activeTab === 'profile' && (
            <ProfileTab 
              user={userProfile || user} 
              showToast={showToast}
              onProfileUpdate={handleProfileUpdate}
            />
          )}
        </div>
      </main>

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export default StudentDashboard
