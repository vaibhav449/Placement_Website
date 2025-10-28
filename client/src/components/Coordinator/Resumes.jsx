import React from 'react'
import { useState } from 'react'
import { coordinatorAPI } from '../../utils/api'
import { downloadFile } from '../../utils/helpers'
import { useEffect } from 'react'
const Resumes = ({ students, companies, showToast }) => {
  const [batchFilter, setBatchFilter] = useState('all')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [applications, setApplications] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [filteredApplications, setFilteredApplications] = useState(applications);
  // console.log("companies in resumes component:-",companies)
  // ask backend to send all the applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await coordinatorAPI.getAllApplications();
        console.log("applications in resumes component:-", response.applications)
        setApplications(response.applications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    }
    fetchApplications();
  }, []);

  useEffect(() => {
  console.log("ran again");

  const filtered = applications.filter(application => {
    const email = application.userEmail || "";
    const company = application.companyId || "";
    console.log("email:", email, "company:", company, "batchFilter:", batchFilter, "companyFilter:", companyFilter);
    // Extract last two digits of the year
    const yearSuffix = batchFilter !== 'all' ? batchFilter.toString().slice(-2) : null;
    console.log("yearSuffix:", yearSuffix);
    // Batch filter check
    const matchesBatch = batchFilter === 'all' || email.includes(yearSuffix);

    // Company filter check (case-insensitive + trimmed)
    const matchesCompany =
      companyFilter === 'all' ||
      company.toLowerCase().trim() === companyFilter.toLowerCase().trim();

    return matchesBatch && matchesCompany;
  });

  setFilteredApplications(filtered);
  console.log("filtered applications:-", filtered);
}, [applications, batchFilter, companyFilter]);

  useEffect(() => {
    const filtered = students.filter(student => {
      if (batchFilter !== 'all' && student.details?.year !== batchFilter) return false;
      if (companyFilter !== 'all' && !student.companies?.includes(companyFilter)) return false;
      return true;
    });
    setFilteredStudents(filtered);
  }, [students, batchFilter, companyFilter]);
  console.log("resumes coordinator component mai  companies:-", companies)
  const handleDownloadAll = async () => {
    setLoading(true)
    try {
      const blob = await coordinatorAPI.downloadResumes({
        batch: batchFilter !== 'all' ? batchFilter : undefined,
        company: companyFilter !== 'all' ? companyFilter : undefined,
      })
      downloadFile(blob, 'resumes.zip')
      showToast('Downloaded successfully', 'success')
    } catch (error) {
      showToast('Failed to download resumes', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
            Student Resumes
          </h1>
          <p className="text-gray-400">Download and manage student resumes</p>
        </div>
        <button
          onClick={handleDownloadAll}
          disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl px-6 py-3 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-orange-500/50 hover:scale-105 disabled:cursor-not-allowed disabled:scale-100"
        >
          <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-download'}`}></i>
          <span className="font-medium">{loading ? 'Downloading...' : 'Download All'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <i className="fas fa-filter mr-2 text-orange-400"></i>
            Filter by Batch
          </label>
          <select
            value={batchFilter}
            onChange={e => setBatchFilter(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
          >
            <option value="all">All Batches</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <i className="fas fa-building mr-2 text-orange-400"></i>
            Filter by Company
          </label>
          <select
            value={companyFilter}
            onChange={e => setCompanyFilter(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
          >
            <option value="all">All Companies</option>
            {companies.map(company => (
              <option key={company._id} value={company._id}>{company.title}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700/50">
          <i className="fas fa-file-alt text-6xl text-gray-600 mb-4"></i>
          <p className="text-xl text-gray-400">No resumes found</p>
        </div>
      ) : (
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  {['Student Name', 'Email', 'Company', 'Status'].map(header => (
                    <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {/* {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{student.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-white">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                        {student.batch}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{student.course || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {student.resumeUrl ? (
                        <a 
                          href={student.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 px-4 py-2 rounded-lg transition-all duration-200"
                        >
                          <i className="fas fa-eye"></i>
                          <span>View</span>
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">Not available</span>
                      )}
                    </td>
                  </tr>
                ))} */}
                {filteredApplications.map(application => (
                  <tr
                    key={application._id}
                    className="hover:bg-gray-700/30 transition-colors duration-200"
                  >
                    {/* Student Name + Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {application.userName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-white">{application.userName}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-300">
                      {application.userEmail}
                    </td>

                    {/* Company Name */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                        {application.companyName}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-gray-300">
                      {application.status}
                    </td>

                    {/* Resume Link */}
                    {/* <td className="px-6 py-4">
      {application.resume ? (
        <a
          href={application.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 px-4 py-2 rounded-lg transition-all duration-200"
        >
          <i className="fas fa-eye"></i>
          <span>View</span>
        </a>
      ) : (
        <span className="text-gray-500 italic">Not available</span>
      )}
    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-info-circle text-orange-400 text-xl"></i>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Download Information</h3>
            <p className="text-gray-400 text-sm">
              Click "Download All" to download resumes based on selected filters. The resumes will be downloaded as a ZIP file.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resumes
