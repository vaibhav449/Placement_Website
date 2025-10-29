// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/';
//     }
//     return Promise.reject(error.response?.data || error.message);
//   }
// );

// // Auth APIs
// export const authAPI = {
//   login: (email, password, role) => 
//     api.post('/auth/login', { email, password, role }),

//   logout: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   }
// };

// // Student APIs
// export const studentAPI = {
//   getProfile: () => api.get('/students/profile'),
//   updateProfile: (data) => api.put('/students/profile', data),
//   completeProfile: (formData) => api.post('/students/profile/complete', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),
//   getCompanies: () => api.get('/students/companies'),
//   applyToCompany: (companyId) => api.post('/students/apply', { companyId }),
//   getApplications: () => api.get('/students/applications'),
//   uploadResume: (file) => {
//     const formData = new FormData();
//     formData.append('resume', file);
//     return api.post('/students/resume/default', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   }
// };

// // Coordinator APIs
// export const coordinatorAPI = {
//   getStats: () => api.get('/coordinators/stats'),
//   getStudents: () => api.get('/coordinators/students'),
//   deleteStudent: (id) => api.delete(`/coordinators/students/${id}`),
//   getCompanies: () => api.get('/coordinators/companies'),
//   addCompany: (data) => api.post('/coordinators/companies', data),
//   updateCompany: (id, data) => api.put(`/coordinators/companies/${id}`, data),
//   deleteCompany: (id) => api.delete(`/coordinators/companies/${id}`),
//   getResumes: () => api.get('/coordinators/resumes'),
//   downloadResumes: (filters) => api.get('/coordinators/resumes/download', { 
//     params: filters,
//     responseType: 'blob'
//   })
// };

// export default api;

// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/';
//     }
//     return Promise.reject(error.response?.data || error.message);
//   }
// );

// // Auth APIs
// export const authAPI = {
//   login: (email, password, role) => 
//     api.post('/auth/login', { email, password, role }),

//   logout: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   }
// };

// // Student APIs
// export const studentAPI = {
//   getProfile: () => api.get('/students/profile'),

//   // Updated to support FormData for file uploads
//   updateProfile: (formData) => api.put('/students/profile', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),

//   completeProfile: (formData) => api.post('/students/profile/complete', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),

//   getCompanies: () => api.get('/students/companies'),

//   applyToCompany: (companyId) => api.post('/students/apply', { companyId }),

//   getApplications: () => api.get('/students/applications'),

//   uploadResume: (file) => {
//     const formData = new FormData();
//     formData.append('resume', file);
//     return api.post('/students/resume/default', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   }
// };

// // Coordinator APIs
// export const coordinatorAPI = {
//   getStats: () => api.get('/coordinators/stats'),
//   getStudents: () => api.get('/coordinators/students'),
//   deleteStudent: (id) => api.delete(`/coordinators/students/${id}`),
//   getCompanies: () => api.get('/coordinators/companies'),
//   addCompany: (data) => api.post('/coordinators/companies', data),
//   updateCompany: (id, data) => api.put(`/coordinators/companies/${id}`, data),
//   deleteCompany: (id) => api.delete(`/coordinators/companies/${id}`),
//   getResumes: () => api.get('/coordinators/resumes'),
//   downloadResumes: (filters) => api.get('/coordinators/resumes/download', { 
//     params: filters,
//     responseType: 'blob'
//   })
// };

// export default api;

import axios from 'axios';

const API_BASE_URL = "https://placement-website-kappa.vercel.app/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password, role) =>
    api.post('/auth/login', { email, password, role }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Student APIs
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  completeProfile: (formData) => api.post('/students/profile/complete', formData), // removed header override
  getCompanies: () => api.get('/students/companies'),
  // studentAPI.js (axios instance `api`)
  applyToCompany: ( formData) =>
    api.post('/students/apply', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getApplications: () => api.get('/students/applications'),
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/students/resume/default', formData); // removed header override
  }
};

// Coordinator APIs
export const coordinatorAPI = {
  getStats: () => api.get('/coordinators/stats'),
  getStudents: () => api.get('/coordinators/students'),
  deleteStudent: (id) => api.delete(`/coordinators/students/${id}`),
  getCompanies: () => api.get('/coordinators/companies'),
  addCompany: (data) => api.post('/coordinators/companies', data),
  updateCompany: (id, data) => api.put(`/coordinators/companies/${id}`, data),
  deleteCompany: (id) => api.delete(`/coordinators/companies/${id}`),
  getResumes: () => api.get('/coordinators/resumes'),
  downloadResumes: (filters) => api.get('/coordinators/resumes/download', {
    params: filters,
    responseType: 'blob'
  }),
  registerStudentsFromFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/coordinators/register-students-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getAllApplications: () => api.get('/coordinators/applications'),
  updateStudentPassword: (studentId, newPassword) =>
    api.put('/coordinators/update-password', { studentId, newPassword }),
};

export default api;
