// import { useState } from 'react'

// const Students = ({ students, onDelete }) => {
//   const [batchFilter, setBatchFilter] = useState('all')
//   const [searchTerm, setSearchTerm] = useState('')

//   const filteredStudents = students.filter(student => {
//     const year = student.details?.year;
//     const matchesBatch = batchFilter === 'all' || year === batchFilter;
//     const matchesSearch =
//       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.email.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesBatch && matchesSearch;
//   })

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
//             Students Management
//           </h1>
//           <p className="text-gray-400">Manage student registrations and profiles</p>
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="flex-1">
//           <div className="relative">
//             <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
//             <input
//               type="text"
//               placeholder="Search students by name or email..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
//             />
//           </div>
//         </div>
//         <select
//           value={batchFilter}
//           onChange={e => setBatchFilter(e.target.value)}
//           className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
//         >
//           <option value="all">All Batches</option>
//           <option value="2022">2022</option>
//           <option value="2023">2023</option>
//           <option value="2024">2024</option>
//           <option value="2025">2025</option>
//         </select>
//       </div>

//       {filteredStudents.length === 0 ? (
//         <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700/50">
//           <i className="fas fa-users-slash text-6xl text-gray-600 mb-4"></i>
//           <p className="text-xl text-gray-400">No students found</p>
//         </div>
//       ) : (
//         <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-800/50">
//                 <tr>
//                   {['Name', 'Roll No', 'Email', 'Course', 'Batch', 'Status', 'Actions'].map(header => (
//                     <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-700/50">
//                 {filteredStudents.map(student => (
//                   <tr key={student._id} className="hover:bg-gray-700/30 transition-colors duration-200">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
//                           <span className="text-white font-semibold">{student.name.charAt(0)}</span>
//                         </div>
//                         <span className="font-medium text-white">{student.name}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-gray-300">{student.details?.rollNo || 'N/A'}</td>
//                     <td className="px-6 py-4 text-gray-300">{student.email}</td>
//                     <td className="px-6 py-4 text-gray-300">{student.details?.course || 'N/A'}</td>
//                     <td className="px-6 py-4">
//                       <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
//                         {student.details?.year || 'N/A'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
//                         {student.status || 'Active'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => onDelete(student._id)}
//                         className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200"
//                         title="Delete Student"
//                       >
//                         <i className="fas fa-trash"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Students

// import { useState } from 'react'
// import Modal from '../Shared/Modal'

// const Students = ({ students, onDelete }) => {
//   const [batchFilter, setBatchFilter] = useState('all')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedStudent, setSelectedStudent] = useState(null)
//   const [showProfileModal, setShowProfileModal] = useState(false)

//   const filteredStudents = students.filter(student => {
//     const year = student.details?.year;
//     const matchesBatch = batchFilter === 'all' || year === batchFilter;
//     const matchesSearch =
//       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.email.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesBatch && matchesSearch;
//   })

//   const handleViewProfile = (student) => {
//     setSelectedStudent(student)
//     setShowProfileModal(true)
//   }

//   const handleCloseModal = () => {
//     setShowProfileModal(false)
//     setSelectedStudent(null)
//   }

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
//             Students Management
//           </h1>
//           <p className="text-gray-400">Manage student registrations and profiles</p>
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="flex-1">
//           <div className="relative">
//             <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
//             <input
//               type="text"
//               placeholder="Search students by name or email..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
//             />
//           </div>
//         </div>
//         <select
//           value={batchFilter}
//           onChange={e => setBatchFilter(e.target.value)}
//           className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
//         >
//           <option value="all">All Batches</option>
//           <option value="2022">2022</option>
//           <option value="2023">2023</option>
//           <option value="2024">2024</option>
//           <option value="2025">2025</option>
//         </select>
//       </div>

//       {filteredStudents.length === 0 ? (
//         <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700/50">
//           <i className="fas fa-users-slash text-6xl text-gray-600 mb-4"></i>
//           <p className="text-xl text-gray-400">No students found</p>
//         </div>
//       ) : (
//         <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-800/50">
//                 <tr>
//                   {['Name', 'Roll No', 'Email', 'Course', 'Batch', 'Status', 'Actions'].map(header => (
//                     <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-700/50">
//                 {filteredStudents.map(student => (
//                   <tr key={student._id} className="hover:bg-gray-700/30 transition-colors duration-200">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
//                           <span className="text-white font-semibold">{student.name.charAt(0)}</span>
//                         </div>
//                         <span className="font-medium text-white">{student.name}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-gray-300">{student.details?.rollNo || 'N/A'}</td>
//                     <td className="px-6 py-4 text-gray-300">{student.email}</td>
//                     <td className="px-6 py-4 text-gray-300">{student.details?.course || 'N/A'}</td>
//                     <td className="px-6 py-4">
//                       <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
//                         {student.details?.year || 'N/A'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
//                         {student.status || 'Active'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => handleViewProfile(student)}
//                           className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-2 rounded-lg transition-all duration-200"
//                           title="View Profile"
//                         >
//                           <i className="fas fa-eye"></i>
//                         </button>
//                         <button
//                           onClick={() => onDelete(student._id)}
//                           className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200"
//                           title="Delete Student"
//                         >
//                           <i className="fas fa-trash"></i>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Student Profile Modal */}
//       {selectedStudent && (
//         <Modal 
//           isOpen={showProfileModal} 
//           onClose={handleCloseModal} 
//           title={`${selectedStudent.name}'s Profile`}
//         >
//           <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
//             {/* Profile Header */}
//             <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-xl p-6 border border-green-500/30">
//               <div className="flex items-center space-x-6">
//                 <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
//                   {selectedStudent.name.charAt(0)}
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
//                     {selectedStudent.name}
//                   </h2>
//                   <p className="text-gray-400 mt-1">{selectedStudent.email}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Personal Information */}
//             <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
//               <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
//                 <i className="fas fa-user mr-2 text-blue-400"></i>
//                 Personal Information
//               </h3>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-gray-700/30 rounded-lg p-3">
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
//                   <p className="text-white font-semibold">{selectedStudent.name}</p>
//                 </div>
//                 <div className="bg-gray-700/30 rounded-lg p-3">
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
//                   <p className="text-white font-semibold">{selectedStudent.email}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Academic Information */}
//             <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
//               <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
//                 <i className="fas fa-graduation-cap mr-2 text-purple-400"></i>
//                 Academic Information
//               </h3>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-gray-700/30 rounded-lg p-3">
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Roll Number</p>
//                   <p className="text-white font-semibold">{selectedStudent.details?.rollNo || 'Not provided'}</p>
//                 </div>
//                 <div className="bg-gray-700/30 rounded-lg p-3">
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Semester</p>
//                   <p className="text-white font-semibold">{selectedStudent.details?.semester || 'Not provided'}</p>
//                 </div>
//                 <div className="bg-gray-700/30 rounded-lg p-3">
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Course</p>
//                   <p className="text-white font-semibold">{selectedStudent.details?.course || 'Not provided'}</p>
//                 </div>
//                 <div className="bg-gray-700/30 rounded-lg p-3">
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Branch</p>
//                   <p className="text-white font-semibold">{selectedStudent.details?.branch || 'Not provided'}</p>
//                 </div>
//                 <div className="bg-gray-700/30 rounded-lg p-3">
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Year</p>
//                   <p className="text-white font-semibold">{selectedStudent.details?.year || 'Not provided'}</p>
//                 </div>
//                 <div className="bg-gray-700/30 rounded-lg p-3">
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Graduation Year</p>
//                   <p className="text-white font-semibold">{selectedStudent.details?.graduationYear || 'Not provided'}</p>
//                 </div>
//                 <div className="bg-gray-700/30 rounded-lg p-3">
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">CGPA</p>
//                   <p className="text-white font-semibold">{selectedStudent.details?.cgpa || 'Not provided'}</p>
//                 </div>
//                 <div className="bg-gray-700/30 rounded-lg p-3">
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Active Backlogs</p>
//                   <p className="text-white font-semibold">
//                     {selectedStudent.details?.activeBacklogs !== undefined ? selectedStudent.details.activeBacklogs : 'Not provided'}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Resume */}
//             <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
//               <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
//                 <i className="fas fa-file-pdf mr-2 text-orange-400"></i>
//                 Resume
//               </h3>
//               {selectedStudent.defaultResume ? (
//                 <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <i className="fas fa-check-circle text-green-400 text-xl"></i>
//                     <span className="text-green-400 font-medium">Resume Available</span>
//                   </div>
//                   <a
//                     href={selectedStudent.defaultResume}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all duration-200 flex items-center space-x-2"
//                   >
//                     <i className="fas fa-download"></i>
//                     <span>View Resume</span>
//                   </a>
//                 </div>
//               ) : (
//                 <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center space-x-3">
//                   <i className="fas fa-times-circle text-red-400 text-xl"></i>
//                   <span className="text-red-400 font-medium">No resume uploaded</span>
//                 </div>
//               )}
//             </div>

//             {/* Close Button */}
//             <div className="flex justify-end pt-4">
//               <button
//                 onClick={handleCloseModal}
//                 className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2"
//               >
//                 <i className="fas fa-times"></i>
//                 <span>Close</span>
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   )
// }

// export default Students
import React from 'react'
import { useState } from 'react'
import Modal from '../Shared/Modal'

const Students = ({ students, onDelete, onRefresh }) => {
  const [batchFilter, setBatchFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  
  const filteredStudents = students.filter(student => {
    const year = student.details?.year;
    const matchesBatch = batchFilter === 'all' || year === batchFilter;
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBatch && matchesSearch;
  })

  const handleViewProfile = (student) => {
    setSelectedStudent(student)
    setShowProfileModal(true)
  }

  const handleCloseModal = () => {
    setShowProfileModal(false)
    setSelectedStudent(null)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const ext = file.name.split('.').pop().toLowerCase()
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      alert('Please upload a CSV or Excel file (.csv, .xlsx, .xls)')
      e.target.value = ''
      return
    }

    setSelectedFile(file)
  }

  const handleUploadFile = async () => {
    if (!selectedFile) {
      alert('Please select a file first')
      return
    }

    setUploading(true)
    setUploadResult(null)

    try {
      const { coordinatorAPI } = await import('../../utils/api')
      const result = await coordinatorAPI.registerStudentsFromFile(selectedFile)
      
      setUploadResult(result)
      setSelectedFile(null)
      
      // Refresh student list
      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      setUploadResult({
        message: error.error || 'Upload failed',
        successful: 0,
        failed: 0,
        errors: error.details || []
      })
    } finally {
      setUploading(false)
    }
  }

  const handleCloseUploadModal = () => {
    setShowUploadModal(false)
    setSelectedFile(null)
    setUploadResult(null)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
            Students Management
          </h1>
          <p className="text-gray-400">Manage student registrations and profiles</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl px-6 py-3 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-green-500/50 hover:scale-105"
        >
          <i className="fas fa-file-upload"></i>
          <span className="font-medium">Upload CSV/Excel</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
            />
          </div>
        </div>
        <select
          value={batchFilter}
          onChange={e => setBatchFilter(e.target.value)}
          className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
        >
          <option value="all">All Batches</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700/50">
          <i className="fas fa-users-slash text-6xl text-gray-600 mb-4"></i>
          <p className="text-xl text-gray-400">No students found</p>
        </div>
      ) : (
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  {['Name', 'Roll No', 'Email', 'Course', 'Batch', 'Status', 'Actions'].map(header => (
                    <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredStudents.map(student => (
                  <tr key={student._id} className="hover:bg-gray-700/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{student.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-white">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{student.details?.rollNo || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-300">{student.email}</td>
                    <td className="px-6 py-4 text-gray-300">{student.details?.course || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                        {student.details?.year || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                        {student.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewProfile(student)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-2 rounded-lg transition-all duration-200"
                          title="View Profile"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => onDelete(student._id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200"
                          title="Delete Student"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudent && (
        <Modal 
          isOpen={showProfileModal} 
          onClose={handleCloseModal} 
          title={`${selectedStudent.name}'s Profile`}
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-xl p-6 border border-green-500/30">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-gray-400 mt-1">{selectedStudent.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <i className="fas fa-user mr-2 text-blue-400"></i>
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-white font-semibold">{selectedStudent.name}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-white font-semibold">{selectedStudent.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <i className="fas fa-graduation-cap mr-2 text-purple-400"></i>
                Academic Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Roll Number</p>
                  <p className="text-white font-semibold">{selectedStudent.details?.rollNo || 'Not provided'}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Semester</p>
                  <p className="text-white font-semibold">{selectedStudent.details?.semester || 'Not provided'}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Course</p>
                  <p className="text-white font-semibold">{selectedStudent.details?.course || 'Not provided'}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Branch</p>
                  <p className="text-white font-semibold">{selectedStudent.details?.branch || 'Not provided'}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Year</p>
                  <p className="text-white font-semibold">{selectedStudent.details?.year || 'Not provided'}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Graduation Year</p>
                  <p className="text-white font-semibold">{selectedStudent.details?.graduationYear || 'Not provided'}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">CGPA</p>
                  <p className="text-white font-semibold">{selectedStudent.details?.cgpa || 'Not provided'}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Active Backlogs</p>
                  <p className="text-white font-semibold">
                    {selectedStudent.details?.activeBacklogs !== undefined ? selectedStudent.details.activeBacklogs : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <i className="fas fa-file-pdf mr-2 text-orange-400"></i>
                Resume
              </h3>
              {selectedStudent.defaultResume ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-green-400 text-xl"></i>
                    <span className="text-green-400 font-medium">Resume Available</span>
                  </div>
                  <a
                    href={selectedStudent.defaultResume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all duration-200 flex items-center space-x-2"
                  >
                    <i className="fas fa-download"></i>
                    <span>View Resume</span>
                  </a>
                </div>
              ) : (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center space-x-3">
                  <i className="fas fa-times-circle text-red-400 text-xl"></i>
                  <span className="text-red-400 font-medium">No resume uploaded</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2"
              >
                <i className="fas fa-times"></i>
                <span>Close</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload CSV/Excel Modal */}
      <Modal 
        isOpen={showUploadModal} 
        onClose={handleCloseUploadModal} 
        title="Upload Students CSV/Excel"
      >
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
              <i className="fas fa-info-circle mr-2"></i>
              File Format Instructions
            </h4>
            <p className="text-gray-300 text-sm mb-2">
              Upload a CSV or Excel file (.csv, .xlsx, .xls) with the following columns:
            </p>
            <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
              <li><strong>name</strong> - Student's full name (required)</li>
              <li><strong>email</strong> - Student's email (required)</li>
              <li><strong>rollNo</strong> - Student's roll number (required)</li>
              <li><strong>role</strong> - Must be "student" (required)</li>
              <li><strong>semester</strong> - Current semester (optional)</li>
              <li><strong>course</strong> - Course name (optional)</li>
              <li><strong>graduationYear</strong> - Expected graduation year (optional)</li>
            </ul>
            <p className="text-gray-400 text-sm mt-2">
              Note: Password will be auto-generated as <strong>rollNo + "007"</strong>
            </p>
          </div>

          <div className="bg-gray-700/20 rounded-lg p-4 border border-gray-600/30">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select CSV or Excel File
            </label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-500/20 file:text-green-400 hover:file:bg-green-500/30"
            />
            {selectedFile && (
              <p className="text-green-400 text-sm mt-2 flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                {selectedFile.name}
              </p>
            )}
          </div>

          {uploadResult && (
            <div className={`rounded-lg p-4 border ${
              uploadResult.successful > 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                uploadResult.successful > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                Upload Result
              </h4>
              <p className="text-gray-300 text-sm mb-2">{uploadResult.message}</p>
              <div className="text-sm text-gray-400">
                <p>✅ Successful: {uploadResult.successful || 0}</p>
                <p>❌ Failed: {uploadResult.failed || 0}</p>
              </div>
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="mt-3 max-h-32 overflow-y-auto">
                  <p className="text-red-400 text-sm font-semibold mb-1">Errors:</p>
                  {uploadResult.errors.map((err, idx) => (
                    <p key={idx} className="text-red-300 text-xs">• {err}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleCloseUploadModal}
              disabled={uploading}
              className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadFile}
              disabled={uploading || !selectedFile}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-upload"></i>
                  <span>Upload Students</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Students
