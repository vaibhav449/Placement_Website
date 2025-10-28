import React from 'react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false) // mobile toggle

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
      console.log(statsData, studentsData, companiesData);
      setStats(statsData || {})
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
    // close sidebar on mobile after navigation
    setSidebarOpen(false)
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

      {/* Top small-screen bar: hamburger + title */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-900/50 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen((s) => !s)}
            className="p-2 rounded-md hover:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg className="w-6 h-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">Coordinator Dashboard</h2>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleDownloadAllResumesFromOverview()}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-medium"
          >
            Download resumes
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar: desktop always visible, mobile toggled */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-gray-900/80 backdrop-blur-sm border-r border-gray-800 lg:static lg:translate-x-0 transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="h-full overflow-y-auto">
            <Sidebar
              activeSection={activeSection}
              setActiveSection={(s) => { setActiveSection(s); setSidebarOpen(false); }}
            />
          </div>
        </aside>

        {/* backdrop overlay when sidebar open on mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content (add left padding on large screens to avoid overlap with fixed sidebar) */}
        <main className="flex-1 overflow-y-auto " >
          <div className="w-full mx-auto p-6 lg:p-8">
            {/* Top actions row (responsive) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold">Welcome, Coordinator</h1>
                <p className="text-sm text-gray-300 mt-1">Manage students, companies and resumes</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadAllResumesFromOverview()}
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-medium"
                >
                  Download all resumes
                </button>

                <div className="bg-gray-800 rounded-md px-3 py-2 text-sm text-gray-200">
                  <span className="font-medium mr-2">Total Students:</span> {stats.totalStudents ?? 0}
                </div>
              </div>
            </div>

            {/* Content area: overview / list / forms */}
            <section className="space-y-6">
              {activeSection === 'overview' && (
                <Overview
                  stats={stats}
                  onNavigate={handleNavigateFromOverview}
                  onAddCompany={handleAddCompanyFromOverview}
                  onDownloadAllResumes={handleDownloadAllResumesFromOverview}
                />
              )}

              {activeSection === 'students' && (
                <Students students={students} onDelete={handleDeleteStudent} onRefresh={fetchStudents} />
              )}

              {activeSection === 'companies' && (
                <Companies companies={companies} onAdd={handleAddCompany} onDelete={handleDeleteCompany} />
              )}

              {activeSection === 'resumes' && (
                <Resumes students={students} companies={companies} showToast={showToast} />
              )}
            </section>
          </div>
        </main>
      </div>

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export default CoordinatorDashboard
