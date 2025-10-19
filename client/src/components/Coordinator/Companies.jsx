import { useState } from 'react'
import Modal from '../Shared/Modal'
import { formatCurrency } from '../../utils/helpers'

const Companies = ({ companies, onAdd, onDelete }) => {
  const [typeFilter, setTypeFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    companyType: 'on-campus',
    type: 'Onsite',
    description: '',
    stipend: ''
  })

  const filteredCompanies = typeFilter === 'all'
    ? companies
    : companies.filter(c => c.companyType === typeFilter)

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({
      ...formData,
      stipend: formData.stipend ? parseInt(formData.stipend) : null
    })
    setShowModal(false)
    setFormData({
      name: '',
      companyType: 'on-campus',
      type: 'Onsite',
      description: '',
      stipend: ''
    })
  }

  const filters = [
    { key: 'all', label: 'All Companies', icon: 'globe' },
    { key: 'on-campus', label: 'On-Campus', icon: 'building' },
    { key: 'off-campus', label: 'Off-Campus', icon: 'map-marker-alt' }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
            Companies Management
          </h1>
          <p className="text-gray-400">Manage on-campus and off-campus opportunities</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl px-6 py-3 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
        >
          <i className="fas fa-plus"></i>
          <span className="font-medium">Add Company</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map(filter => (
          <button
            key={filter.key}
            onClick={() => setTypeFilter(filter.key)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              typeFilter === filter.key
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 border border-gray-700/50'
            }`}
          >
            <i className={`fas fa-${filter.icon}`}></i>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700/50">
          <i className="fas fa-building text-6xl text-gray-600 mb-4"></i>
          <p className="text-xl text-gray-400">No companies found</p>
        </div>
      ) : (
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  {['Company Name', 'Type', 'Location', 'Stipend', 'Actions'].map(header => (
                    <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredCompanies.map(company => (
                  <tr key={company._id} className="hover:bg-gray-700/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <i className="fas fa-building text-white"></i>
                        </div>
                        <span className="font-medium text-white">{company.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        company.companyType === 'off-campus' 
                          ? 'bg-orange-500/20 text-orange-400' 
                          : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {company.companyType === 'off-campus' ? '🌐 Off-Campus' : '🏢 On-Campus'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{company.type || 'Not specified'}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {company.stipend ? (
                        <span className="text-green-400 font-semibold">{formatCurrency(company.stipend)}</span>
                      ) : (
                        'Not specified'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onDelete(company._id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200"
                        title="Delete Company"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Company">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              placeholder="Enter company name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company Type *</label>
              <select
                value={formData.companyType}
                onChange={e => setFormData({...formData, companyType: e.target.value})}
                required
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              >
                <option value="on-campus">🏢 On-Campus</option>
                <option value="off-campus">🌐 Off-Campus</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location Type *</label>
              <select
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                required
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              >
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows="3"
              required
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              placeholder="Enter company description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Stipend (₹)</label>
            <input
              type="number"
              value={formData.stipend}
              onChange={e => setFormData({...formData, stipend: e.target.value})}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              placeholder="Enter stipend amount"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
            >
              <i className="fas fa-plus"></i>
              <span>Add Company</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Companies
