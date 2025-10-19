import { formatCurrency } from '../../utils/helpers'

const CompanyCard = ({ company, hasApplied, onApply }) => {
  const companyTypeLabel = company.companyType === 'off-campus' ? '🌐 Off-Campus' : '🏢 On-Campus'

  return (
    <div className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <i className="fas fa-building text-white text-lg"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                {company.name}
              </h3>
            </div>
          </div>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          company.companyType === 'off-campus' 
            ? 'bg-purple-500/20 text-purple-400' 
            : 'bg-blue-500/20 text-blue-400'
        }`}>
          {companyTypeLabel}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        <p className="text-gray-400 text-sm line-clamp-3">
          {company.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <i className="fas fa-map-marker-alt text-blue-400"></i>
            <span>{company.type || 'Not specified'}</span>
          </div>
          {company.stipend && (
            <div className="flex items-center space-x-2 text-green-400 font-semibold">
              <i className="fas fa-money-bill-wave"></i>
              <span>{formatCurrency(company.stipend)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 pt-0">
        <button
          onClick={() => onApply(company._id)}
          disabled={hasApplied}
          className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
            hasApplied
              ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-blue-500/50'
          }`}
        >
          {hasApplied ? (
            <>
              <i className="fas fa-check-circle mr-2"></i>
              Already Applied
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane mr-2"></i>
              Apply Now
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CompanyCard
