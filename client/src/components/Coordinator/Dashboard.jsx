// import { useState, useEffect } from 'react'
// import { useToast } from '../../hooks/useToast'
// import { coordinatorAPI } from '../../utils/api'
// import { downloadFile } from '../../utils/helpers'
// import Header from '../Shared/Header'
// import Sidebar from './Sidebar'
// import Overview from './Overview'
// import Students from './Students'
// import Companies from './Companies'
// import Resumes from './Resumes'
// import Toast from '../Shared/Toast'
// import Loading from '../Shared/Loading'

// const CoordinatorDashboard = () => {
//   const [activeSection, setActiveSection] = useState('overview')
//   const [stats, setStats] = useState({})
//   const [students, setStudents] = useState([])
//   const [companies, setCompanies] = useState([])
//   const [loading, setLoading] = useState(true)
  
//   const { toasts, showToast, removeToast } = useToast()

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     try {
//       const [statsData, studentsData, companiesData] = await Promise.all([
//         coordinatorAPI.getStats(),
//         coordinatorAPI.getStudents(),
//         coordinatorAPI.getCompanies()
//       ])
//       console.log("student ka data", studentsData)
//       setStats(statsData.stats || {})
//       setStudents(studentsData.students || [])
//       setCompanies(companiesData.companies || [])
//     } catch (error) {
//       showToast('Failed to fetch data', 'error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleNavigateFromOverview = (section) => {
//     setActiveSection(section)
//   }

//   const handleAddCompanyFromOverview = async (companyData) => {
//     try {
//       await coordinatorAPI.addCompany(companyData)
//       showToast('Company added successfully', 'success')
//       fetchData()
//     } catch (error) {
//       showToast(error.message || 'Failed to add company', 'error')
//     }
//   }

//   const handleDownloadAllResumesFromOverview = async () => {
//     try {
//       const blob = await coordinatorAPI.downloadResumes({})
//       downloadFile(blob, 'all_resumes.zip')
//       showToast('All resumes downloaded successfully', 'success')
//     } catch (error) {
//       showToast(error.message || 'Failed to download resumes', 'error')
//     }
//   }

//   const handleDeleteStudent = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this student?')) return
    
//     try {
//       await coordinatorAPI.deleteStudent(id)
//       showToast('Student deleted successfully', 'success')
//       fetchData()
//     } catch (error) {
//       showToast(error.message || 'Failed to delete student', 'error')
//     }
//   }

//   const handleAddCompany = async (companyData) => {
//     try {
//       await coordinatorAPI.addCompany(companyData)
//       showToast('Company added successfully', 'success')
//       fetchData()
//     } catch (error) {
//       showToast(error.message || 'Failed to add company', 'error')
//     }
//   }

//   const handleDeleteCompany = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this company?')) return
    
//     try {
//       await coordinatorAPI.deleteCompany(id)
//       showToast('Company deleted successfully', 'success')
//       fetchData()
//     } catch (error) {
//       showToast(error.message || 'Failed to delete company', 'error')
//     }
//   }

//   if (loading) return <Loading />

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
//       <Header />

//       <div className="flex h-[calc(100vh-64px)]">
//         <Sidebar 
//           activeSection={activeSection} 
//           setActiveSection={setActiveSection} 
//         />

//         <main className="flex-1 overflow-y-auto bg-gray-900/50 backdrop-blur-sm">
//           <div className="p-8">
//             {activeSection === 'overview' && (
//               <Overview 
//                 stats={stats}
//                 onNavigate={handleNavigateFromOverview}
//                 onAddCompany={handleAddCompanyFromOverview}
//                 onDownloadAllResumes={handleDownloadAllResumesFromOverview}
//               />
//             )}
//             {activeSection === 'students' && (
//               <Students 
//                 students={students} 
//                 onDelete={handleDeleteStudent}
//               />
//             )}
//             {activeSection === 'companies' && (
//               <Companies 
//                 companies={companies}
//                 onAdd={handleAddCompany}
//                 onDelete={handleDeleteCompany}
//               />
//             )}
//             {activeSection === 'resumes' && (
//               <Resumes 
//                 students={students}
//                 companies={companies}
//                 showToast={showToast}
//               />
//             )}
//           </div>
//         </main>
//       </div>

//       <Toast toasts={toasts} onClose={removeToast} />
//     </div>
//   )
// }

// export default CoordinatorDashboard
import { useState, useEffect } from 'react'
import { useToast } from '../../hooks/useToast'
import { coordinatorAPI } from '../../utils/api'
import { downloadFile } from '../../utils/helpers'
import Header from '../Shared/Header'
import Sidebar from './Sidebar'
import Overview from './Overview'
import Students from './Students'
import Companies from './Companies'
import Resumes from './Resumes'
import Toast from '../Shared/Toast'
import Loading from '../Shared/Loading'

const CoordinatorDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview')
  const [stats, setStats] = useState({})
  const [students, setStudents] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  
  const { toasts, showToast, removeToast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsData, studentsData, companiesData] = await Promise.all([
        coordinatorAPI.getStats(),
        coordinatorAPI.getStudents(),
        coordinatorAPI.getCompanies()
      ])
      console.log("student ka data", studentsData)
      setStats(statsData.stats || {})
      setStudents(studentsData.students || [])
      setCompanies(companiesData.companies || [])
    } catch (error) {
      showToast('Failed to fetch data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const studentsData = await coordinatorAPI.getStudents()
      setStudents(studentsData.students || [])
    } catch (error) {
      showToast('Failed to fetch students', 'error')
    }
  }

  const handleNavigateFromOverview = (section) => {
    setActiveSection(section)
  }

  const handleAddCompanyFromOverview = async (companyData) => {
    try {
      await coordinatorAPI.addCompany(companyData)
      showToast('Company added successfully', 'success')
      fetchData()
    } catch (error) {
      showToast(error.message || 'Failed to add company', 'error')
    }
  }

  const handleDownloadAllResumesFromOverview = async () => {
    try {
      const blob = await coordinatorAPI.downloadResumes({})
      downloadFile(blob, 'all_resumes.zip')
      showToast('All resumes downloaded successfully', 'success')
    } catch (error) {
      showToast(error.message || 'Failed to download resumes', 'error')
    }
  }

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return
    
    try {
      await coordinatorAPI.deleteStudent(id)
      showToast('Student deleted successfully', 'success')
      fetchData()
    } catch (error) {
      showToast(error.message || 'Failed to delete student', 'error')
    }
  }

  const handleAddCompany = async (companyData) => {
    try {
      await coordinatorAPI.addCompany(companyData)
      showToast('Company added successfully', 'success')
      fetchData()
    } catch (error) {
      showToast(error.message || 'Failed to add company', 'error')
    }
  }

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return
    
    try {
      await coordinatorAPI.deleteCompany(id)
      showToast('Company deleted successfully', 'success')
      fetchData()
    } catch (error) {
      showToast(error.message || 'Failed to delete company', 'error')
    }
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Header />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />

        <main className="flex-1 overflow-y-auto bg-gray-900/50 backdrop-blur-sm">
          <div className="p-8">
            {activeSection === 'overview' && (
              <Overview 
                stats={stats}
                onNavigate={handleNavigateFromOverview}
                onAddCompany={handleAddCompanyFromOverview}
                onDownloadAllResumes={handleDownloadAllResumesFromOverview}
              />
            )}
            {activeSection === 'students' && (
              <Students 
                students={students} 
                onDelete={handleDeleteStudent}
                onRefresh={fetchStudents}
              />
            )}
            {activeSection === 'companies' && (
              <Companies 
                companies={companies}
                onAdd={handleAddCompany}
                onDelete={handleDeleteCompany}
              />
            )}
            {activeSection === 'resumes' && (
              <Resumes 
                students={students}
                companies={companies}
                showToast={showToast}
              />
            )}
          </div>
        </main>
      </div>

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export default CoordinatorDashboard
