import React, { useState } from 'react'

const CompanyCard = ({ company, hasApplied, onApply }) => {
  const [showModal, setShowModal] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)

  // Determine campus type label
  const companyTypeLabel = company.isOnCampus ? '🏢 On-Campus' : '🌐 Off-Campus'

  const handleApplyClick = () => {
    setShowModal(true)
  }

  const handleUseDefault = () => {
    setShowModal(false)
    onApply(company._id, null)
    if (company.applyLink) {
      window.open(company.applyLink, '_blank')
    }
  }

  const handleCustomResume = (e) => {
    e.preventDefault()
    if (resumeFile) {
      setShowModal(false)
      onApply(company._id, resumeFile)
      if (company.applyLink) {
        window.open(company.applyLink, '_blank')
      }
    }
  }

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
                {company.title}
              </h3>
            </div>
          </div>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          company.isOnCampus
            ? 'bg-blue-500/20 text-blue-400'
            : 'bg-purple-500/20 text-purple-400'
        }`}>
          {companyTypeLabel}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        <p className="text-gray-400 text-sm line-clamp-3">
          {company.description}
        </p>

        <div className="flex flex-wrap items-center justify-between text-sm gap-2">
          <div className="flex items-center space-x-2 text-gray-400">
            <i className="fas fa-map-marker-alt text-blue-400"></i>
            <span>{company.type || 'Not specified'}</span>
          </div>
          {company.package && (
            <div className="flex items-center space-x-2 text-green-400 font-semibold">
              <i className="fas fa-money-bill-wave"></i>
              <span>{company.package} LPA</span>
            </div>
          )}
          {company.requiredCgpa && (
            <div className="flex items-center space-x-2 text-orange-400 font-semibold">
              <i className="fas fa-graduation-cap"></i>
              <span>CGPA: {company.requiredCgpa}</span>
            </div>
          )}
          {company.deadline && (
            <div className="flex items-center space-x-2 text-red-400 font-semibold">
              <i className="fas fa-calendar-alt"></i>
              <span>
                Deadline: {new Date(company.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {company.skills && company.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {company.skills.map((skill, idx) => (
              <span key={idx} className="bg-gray-700/40 text-xs text-gray-200 px-2 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        )}

        {company.requirements && (
          <div className="mt-2 text-gray-400 text-xs">
            <span className="font-semibold text-gray-300">Requirements:</span> {company.requirements}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-4 pt-0 flex flex-col gap-2">
        <a
          href={company.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 rounded-xl font-medium bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
        >
          <i className="fas fa-link mr-2"></i>
          Apply Link
        </a>
        <button
          onClick={handleApplyClick}
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

      {/* Modal for resume choice */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4">Choose Resume</h2>
            <button
              onClick={handleUseDefault}
              className="w-full mb-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
            >
              Use Default Resume
            </button>
            <form onSubmit={handleCustomResume}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Or upload a custom resume (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => setResumeFile(e.target.files[0])}
                className="mb-4 w-full text-gray-200"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!resumeFile}
                  className="px-4 py-2 rounded bg-orange-500 text-white font-medium hover:bg-orange-600"
                >
                  Apply with Custom Resume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyCard
