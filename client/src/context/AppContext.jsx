import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalApplications: 0
  });

  const updateCompanies = (newCompanies) => {
    setCompanies(newCompanies);
  };

  const updateStudents = (newStudents) => {
    setStudents(newStudents);
  };

  const updateApplications = (newApplications) => {
    setApplications(newApplications);
  };

  const updateStats = (newStats) => {
    setStats(newStats);
  };

  return (
    <AppContext.Provider value={{
      companies,
      students,
      applications,
      stats,
      updateCompanies,
      updateStudents,
      updateApplications,
      updateStats
    }}>
      {children}
    </AppContext.Provider>
  );
};
