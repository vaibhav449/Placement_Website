// Companies.jsx
import React, { useMemo, useState, useEffect } from 'react';
import Modal from '../Shared/Modal';
import { formatCurrency as extFormatCurrency } from '../../utils/helpers';

/* -------------------------------------------------
   Tiny breakpoint hook (SSR-safe) — Tailwind-like
   sm: 640px, md: 768px, lg: 1024px
-------------------------------------------------- */
function useBreakpoints() {
  const getState = () => {
    if (typeof window === 'undefined') {
      return { smUp: false, mdUp: false, lgUp: false, width: 0, height: 0 };
    }
    const sm = window.matchMedia('(min-width: 640px)');
    const md = window.matchMedia('(min-width: 768px)');
    const lg = window.matchMedia('(min-width: 1024px)');
    return {
      smUp: sm.matches,
      mdUp: md.matches,
      lgUp: lg.matches,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  const [state, setState] = useState(getState);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mqls = [
      window.matchMedia('(min-width: 640px)'),
      window.matchMedia('(min-width: 768px)'),
      window.matchMedia('(min-width: 1024px)'),
    ];

    const onChange = () => {
      // rAF to coalesce resize events
      requestAnimationFrame(() => setState(getState()));
    };

    mqls.forEach((m) => m.addEventListener?.('change', onChange));
    window.addEventListener('resize', onChange);
    return () => {
      mqls.forEach((m) => m.removeEventListener?.('change', onChange));
      window.removeEventListener('resize', onChange);
    };
  }, []);

  return state; // { smUp, mdUp, lgUp, width, height }
}

/* -------------------------------------------------
   Component
-------------------------------------------------- */
const Companies = ({ companies = [], onAdd, onDelete }) => {
  const { smUp } = useBreakpoints();
  const isMobile = !smUp; // <640px → mobile, ≥640px → desktop

  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'Onsite' | 'Remote' | 'Hybrid'
  const [campusFilter, setCampusFilter] = useState('all'); // 'all' | 'on' | 'off'
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    applyLink: '',
    // other fields are optional
    description: '',
    package: '',
    skills: '',
    requirements: '',
    deadline: '',
    role: '',
    type: 'Onsite',
    isOnCampus: true,
    requiredCgpa: 0.0,
  });

  // Fallback currency formatter
  const safeFormatCurrency = (n) => {
    try {
      if (typeof extFormatCurrency === 'function') {
        const v = extFormatCurrency(n);
        if (v) return v;
      }
    } catch {}
    const num = Number(n);
    if (Number.isNaN(num)) return '0';
    return num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  // Normalize type
  const normalizeType = (raw) => {
    if (!raw && raw !== 0) return 'Onsite';
    const s = String(raw).trim().toLowerCase();
    if (s.includes('remote')) return 'Remote';
    if (s.includes('hybrid')) return 'Hybrid';
    if (s.includes('on') && s.includes('site')) return 'Onsite';
    if (s === 'onsite' || s === 'on-site' || s === 'on site') return 'Onsite';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  // Normalize campus to boolean
  const normalizeIsOnCampus = (company) => {
    if (typeof company.isOnCampus === 'boolean') return company.isOnCampus;
    if (company.campus) {
      const s = String(company.campus).trim().toLowerCase();
      if (s.includes('on')) return true;
      if (s.includes('off')) return false;
    }
    return normalizeType(company.type) === 'Onsite';
  };

  const normalizedCompanies = useMemo(
    () =>
      (companies || []).map((c) => {
        const _displayType = normalizeType(c.type);
        const _isOnCampus = normalizeIsOnCampus(c);
        return { ...c, _displayType, _isOnCampus };
      }),
    [companies]
  );

  const filteredCompanies = useMemo(
    () =>
      normalizedCompanies.filter((c) => {
        const typeMatch = typeFilter === 'all' ? true : c._displayType === typeFilter;
        const campusMatch =
          campusFilter === 'all' ? true : campusFilter === 'on' ? c._isOnCampus : !c._isOnCampus;
        return typeMatch && campusMatch;
      }),
    [normalizedCompanies, typeFilter, campusFilter]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only require title and applyLink
    if (!formData.title || !formData.applyLink) {
      return; // Optionally show a toast/error
    }
    const skillsArray = String(formData.skills || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      applyLink: formData.applyLink,
      // other fields are optional
      description: formData.description,
      package: parseFloat(formData.package) || 0,
      skills: skillsArray,
      requirements: formData.requirements,
      deadline: formData.deadline,
      role: formData.role,
      type: formData.type,
      isOnCampus: !!formData.isOnCampus,
      requiredCgpa: parseFloat(formData.requiredCgpa) || 0.0,
    };

    onAdd?.(payload);
    setShowModal(false);
    setFormData({
      title: '',
      applyLink: '',
      description: '',
      package: '',
      skills: '',
      requirements: '',
      deadline: '',
      role: '',
      type: 'Onsite',
      isOnCampus: true,
      requiredCgpa: 0.0,
    });
  };

  const filters = [
    { key: 'all', label: 'All Companies', icon: 'globe' },
    { key: 'Remote', label: 'Remote', icon: 'laptop' },
    { key: 'Onsite', label: 'Onsite', icon: 'building' },
    { key: 'Hybrid', label: 'Hybrid', icon: 'briefcase' },
  ];

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
              Companies
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              Manage on-campus and off-campus opportunities. Use filters to narrow down listings.
            </p>
          </div>

          {/* Filters (JS controlled) */}
          <div className="flex items-center gap-3">
            {!isMobile ? (
              <>
                {/* Desktop campus filter */}
                <div className="flex items-center gap-2 bg-gray-800/60 rounded-lg p-1 border border-gray-700/70">
                  <button
                    onClick={() => setCampusFilter('all')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      campusFilter === 'all' ? 'bg-white/10 text-white' : 'text-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setCampusFilter('on')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      campusFilter === 'on'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'text-gray-200'
                    }`}
                  >
                    On-campus
                  </button>
                  <button
                    onClick={() => setCampusFilter('off')}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      campusFilter === 'off'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'text-gray-200'
                    }`}
                  >
                    Off-campus
                  </button>
                </div>

                {/* Desktop type filter */}
                <div className="flex flex-wrap gap-3">
                  {filters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setTypeFilter(filter.key)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-150 text-sm ${
                        typeFilter === filter.key
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-gray-800/60 text-gray-200 hover:bg-gray-700/70'
                      }`}
                    >
                      <i className={`fas fa-${filter.icon}`}></i>
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Mobile campus filter */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setCampusFilter('all')}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium ${
                      campusFilter === 'all' ? 'bg-white/10 text-white' : 'bg-gray-800/60 text-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setCampusFilter('on')}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium ${
                      campusFilter === 'on'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-800/60 text-gray-200'
                    }`}
                  >
                    On-campus
                  </button>
                  <button
                    onClick={() => setCampusFilter('off')}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium ${
                      campusFilter === 'off'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-800/60 text-gray-200'
                    }`}
                  >
                    Off-campus
                  </button>
                </div>

                {/* Mobile type filter */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {filters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setTypeFilter(filter.key)}
                      className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium ${
                        typeFilter === filter.key
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-800/60 text-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Add button (common) */}
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm text-sm"
            >
              <i className="fas fa-plus"></i>
              <span>Add Company</span>
            </button>
          </div>
        </div>

        {/* Content area: Desktop table vs Mobile cards */}
        {!isMobile ? (
          /* Desktop table (≥640px) */
          <div className="w-full">
            <div className="overflow-x-auto w-full">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-800/80">
                  <tr>
                    {[
                      'Company',
                      'Role',
                      'Type',
                      'Campus',
                      'Package',
                      'Required CGPA',
                      'Deadline',
                      'Apply',
                      'Actions',
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-200 whitespace-nowrap border-b border-gray-700"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700/60">
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-10 text-center text-gray-400">
                        <i className="fas fa-building text-4xl text-gray-600 mb-3 block"></i>
                        <p className="text-lg">No companies found</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Click &quot;Add Company&quot; to create a new listing.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((company) => {
                      const key = company._id || company.id || company.title || Math.random();
                      const deadline =
                        company.deadline && !Number.isNaN(new Date(company.deadline).getTime())
                          ? new Date(company.deadline).toLocaleDateString()
                          : '-';
                      return (
                        <tr key={key} className="hover:bg-gray-700/30 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 min-w-[220px]">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                                <i className="fas fa-building"></i>
                              </div>
                              <div>
                                <div className="font-medium text-white">{company.title || '-'}</div>
                                <div className="text-xs text-gray-400 line-clamp-1">
                                  {company.description?.slice(0, 80)}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-gray-200">{company.role || '-'}</td>

                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                                company._displayType === 'Remote'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : company._displayType === 'Hybrid'
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'bg-orange-500/20 text-orange-300'
                              }`}
                            >
                              {company._displayType}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-gray-700/60 text-gray-100">
                              {company._isOnCampus ? 'On-campus' : 'Off-campus'}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-green-400 font-semibold whitespace-nowrap">
                              {company.package || company.package === 0
                                ? `${safeFormatCurrency(company.package)} LPA`
                                : 'Not specified'}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-gray-200 text-center">
                            {company.requiredCgpa ?? '-'}
                          </td>

                          <td className="px-6 py-4 text-gray-200 whitespace-nowrap">{deadline}</td>

                          <td className="px-6 py-4">
                            {company.applyLink ? (
                              <a
                                href={company.applyLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
                              >
                                Apply
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400">N/A</span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <button
                              onClick={() => onDelete?.(company._id || company.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-150"
                              title="Delete Company"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Mobile cards (<640px) */
          <div className="grid gap-3">
            {filteredCompanies.length === 0 ? (
              <div className="text-center py-8 bg-gray-800/60 rounded-2xl border border-gray-700/70">
                <i className="fas fa-building text-5xl text-gray-600 mb-3"></i>
                <p className="text-lg text-gray-300">No companies found</p>
              </div>
            ) : (
              filteredCompanies.map((company) => (
                <article
                  key={company._id || company.id || company.title}
                  className="bg-gray-800/60 border border-gray-700/70 rounded-xl p-4 flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                      <i className="fas fa-building"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-semibold text-white">{company.title}</h3>
                        <span className="text-xs text-gray-300">
                          {company.deadline && !Number.isNaN(new Date(company.deadline).getTime())
                            ? new Date(company.deadline).toLocaleDateString()
                            : '-'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{company.description}</p>
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-2 py-1 rounded-md bg-gray-700/60 text-gray-100">
                          {company.role}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-md bg-gray-700/60 text-gray-100">
                          {company._displayType}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-md bg-gray-700/60 text-green-300">
                          {company.package || company.package === 0
                            ? `${safeFormatCurrency(company.package)} LPA`
                            : 'N/A'}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-md bg-gray-700/60 text-gray-100">
                          {company._isOnCampus ? 'On-campus' : 'Off-campus'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {company.applyLink ? (
                        <a
                          href={company.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm"
                        >
                          Apply
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400 px-3 py-2">No apply link</span>
                      )}
                    </div>

                    <div>
                      <button
                        onClick={() => onDelete?.(company._id || company.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-150"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* Desktop empty-state banner (only show on desktop when empty) */}
        {!isMobile && filteredCompanies.length === 0 && (
          <div className="text-center py-12 bg-gray-800/60 rounded-2xl border border-gray-700/70">
            <i className="fas fa-building text-6xl text-gray-600 mr-4"></i>
            <div>
              <p className="text-xl text-gray-300">No companies found</p>
              <p className="text-sm text-gray-400 mt-2">
                Click &quot;Add Company&quot; to create a new listing.
              </p>
            </div>
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Add New Company"
          className="max-w-xl sm:max-w-3xl w-full"
          mobileFullScreen
        >
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-3">
              {/* Title (required) */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Company Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-4 py-3 text-white"
                  placeholder="e.g., Google India"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-4 py-3 text-white"
                  placeholder="Short description"
                  rows={2}
                />
              </div>

              {/* Package */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Package (LPA)
                </label>
                <input
                  type="number"
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-4 py-3 text-white"
                  placeholder="e.g., 20"
                  min={0}
                  step="0.01"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-4 py-3 text-white"
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Requirements
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-4 py-3 text-white"
                  placeholder="Any requirements"
                  rows={2}
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-4 py-3 text-white"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-4 py-3 text-white"
                  placeholder="e.g., SDE"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-4 py-3 text-white"
                >
                  <option value="">Select type</option>
                  <option value="Remote">Remote</option>
                  <option value="Onsite">Onsite</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Required CGPA */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Required CGPA
                </label>
                <input
                  type="number"
                  value={formData.requiredCgpa}
                  onChange={(e) => setFormData({ ...formData, requiredCgpa: e.target.value })}
                  className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-4 py-3 text-white"
                  placeholder="e.g., 7.5"
                  min={0}
                  max={10}
                  step="0.01"
                />
              </div>

              {/* Apply Link (required) */}
              <div>
                <label className="block  text-sm font-medium text-gray-200 mb-2">
                  Apply Link *
                </label>
                <input
                  type="url"
                  value={formData.applyLink}
                  onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                  required
                  className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-4 py-3 text-white"
                  placeholder="https://company.com/apply"
                />
              </div>

              {/* Is On Campus */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Is On Campus
                </label>
                <select
                  value={formData.isOnCampus ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, isOnCampus: e.target.value === 'true' })}
                  className="w-full bg-gray-700/60 border border-gray-600/60 rounded-lg px-4 py-3 text-white"
                >
                  <option value="true">On-campus</option>
                  <option value="false">Off-campus</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-700/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                <span>Add Company</span>
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Companies;
