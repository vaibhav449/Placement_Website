export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Mock data for development
export const mockData = {
  companies: [
    {
      _id: '1',
      name: 'Google',
      companyType: 'on-campus',
      description: 'Software Engineer role at Google with competitive package and excellent growth opportunities.',
      type: 'Hybrid',
      stipend: 1800000
    },
    {
      _id: '2',
      name: 'Microsoft',
      companyType: 'on-campus',
      description: 'Full Stack Developer position at Microsoft Azure team.',
      type: 'Remote',
      stipend: 1600000
    },
    {
      _id: '3',
      name: 'Startup XYZ',
      companyType: 'off-campus',
      description: 'Full Stack Developer at a fast-growing startup.',
      type: 'Remote',
      stipend: 800000
    }
  ],
  students: [
    {
      _id: 's1',
      name: 'Rahul Sharma',
      rollNo: '21CS001',
      email: 'rahul@iiitr.ac.in',
      course: 'B.Tech CSE',
      batch: '2022',
      semester: 6,
      profileIsCompleted: true,
      hasResume: true
    }
  ]
};
