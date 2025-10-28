import React from 'react'
import CompanyCard from './CompanyCard'

const CompaniesTab = ({ companies, applications, onApply }) => {
  const onCampusCompanies = companies.filter(c => c.companyType === 'on-campus' || !c.companyType)
  const offCampusCompanies = companies.filter(c => c.companyType === 'off-campus')

  return (
    <div className="space-y-8">
      {/* On-Campus Section */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <i className="fas fa-building text-white text-lg"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">On-Campus Companies</h2>
            <p className="text-gray-400 text-sm">Companies visiting campus for placements</p>
          </div>
        </div>

        {onCampusCompanies.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700/50">
            <i className="fas fa-building text-5xl text-gray-600 mb-3"></i>
            <p className="text-gray-400">No on-campus companies available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {onCampusCompanies.map(company => (
              <CompanyCard
                key={company._id}
                company={company}
                hasApplied={applications.some(app => app.company === company._id)}
                onApply={onApply}
              />
            ))}
          </div>
        )}
      </div>

      {/* Off-Campus Section */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <i className="fas fa-globe text-white text-lg"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Off-Campus Opportunities</h2>
            <p className="text-gray-400 text-sm">External opportunities and job postings</p>
          </div>
        </div>

        {offCampusCompanies.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700/50">
            <i className="fas fa-globe text-5xl text-gray-600 mb-3"></i>
            <p className="text-gray-400">No off-campus opportunities available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offCampusCompanies.map(company => (
              <CompanyCard
                key={company._id}
                company={company}
                hasApplied={applications.some(app => app.company === company._id)}
                onApply={onApply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CompaniesTab
