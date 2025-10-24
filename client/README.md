# IIIT Raichur Placement Portal - Frontend

A modern, responsive React application for managing campus placements built with React + Vite.

## 🚀 Features

### Authentication
- ✅ **Unified Login Page** with Student/Coordinator toggle
- ✅ Beautiful animated gradient background
- ✅ Role-based authentication and routing

### Student Features
- ✅ **Profile Completion Enforcement** - Must complete profile before accessing dashboard
- ✅ **Dashboard** with statistics and tabs
- ✅ **Companies Tab** - Browse on-campus and off-campus opportunities
- ✅ **Applications Tab** - Track application status
- ✅ **Profile Tab** - View and update profile information
- ✅ Resume upload functionality

### Coordinator Features
- ✅ **Overview Dashboard** with quick stats and actions
- ✅ **Students Management**
  - View all registered students
  - **Filter by batch** (2022, 2023, 2024, 2025)
  - **Delete students** with confirmation
  - View profile completion status
- ✅ **Companies Management**
  - Add/Edit/Delete companies
  - Toggle between **On-Campus** and **Off-Campus** companies
  - Categorize opportunities by type
- ✅ **Resumes Management**
  - View all student resumes
  - **Filter by batch**
  - **Filter by company** (students who applied)
  - Download individual or bulk resumes

### UI/UX
- ✅ Modern, responsive design
- ✅ Smooth animations and transitions
- ✅ Toast notifications for user feedback
- ✅ Loading states
- ✅ Mobile-friendly interface

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend setup)

## 🛠️ Installation

1. **Clone or download the project**

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and update the API URL:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

4. **Start development server**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

## 🔑 Demo Credentials

### Student Login
- **Email:** `student@iiitr.ac.in`
- **Password:** `password`

### Coordinator Login
- **Email:** `coordinator@iiitr.ac.in`
- **Password:** `password`

## 📁 Project Structure

```
placement-portal-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── Auth/         # Login, ProfileSetup
│   │   ├── Student/      # Student dashboard components
│   │   ├── Coordinator/  # Coordinator dashboard components
│   │   └── Shared/       # Shared components (Header, Toast, etc.)
│   ├── context/          # React Context for state management
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions and API calls
│   ├── styles/           # CSS files
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── .env                   # Environment variables
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore file
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── index.html            # HTML template
└── README.md             # This file
```

## 🔌 API Integration

The frontend expects these API endpoints:

### Authentication
- `POST /api/auth/login` - Login with email, password, role

### Student APIs
- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update profile
- `POST /api/students/profile/complete` - Complete profile setup
- `GET /api/students/companies` - Get all companies
- `POST /api/students/apply` - Apply to company
- `GET /api/students/applications` - Get applications
- `POST /api/students/resume` - Upload resume

### Coordinator APIs
- `GET /api/coordinators/stats` - Get dashboard stats
- `GET /api/coordinators/students` - Get all students
- `DELETE /api/coordinators/students/:id` - Delete student
- `GET /api/coordinators/companies` - Get all companies
- `POST /api/coordinators/companies` - Add company
- `PUT /api/coordinators/companies/:id` - Update company
- `DELETE /api/coordinators/companies/:id` - Delete company
- `GET /api/coordinators/resumes` - Get all resumes
- `GET /api/coordinators/resumes/download` - Download resumes

## 🎨 Customization

### Colors
Edit `src/styles/index.css` to change the color scheme:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --success-color: #22c55e;
  --error-color: #ef4444;
}
```

### Branding
Update the app name in `.env`:
```env
VITE_APP_NAME=Your Institution Name
```

## 🧪 Development

### Adding New Components
1. Create component file in appropriate folder under `src/components/`
2. Import and use in parent components
3. Add styles in respective CSS file

### Adding New API Calls
1. Add function in `src/utils/api.js`
2. Use in components via async/await
3. Handle errors with try-catch

### State Management
- Auth state: `src/context/AuthContext.jsx`
- App state: `src/context/AppContext.jsx`
- Custom hooks: `src/hooks/`

## 🐛 Troubleshooting

### Port already in use
Change port in `vite.config.js`:
```js
server: {
  port: 5174, // Change to any available port
}
```

### API connection issues
1. Verify backend is running
2. Check `.env` has correct `VITE_API_BASE_URL`
3. Check CORS settings in backend

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is for IIIT Raichur's internal use.

## 👥 Contributors

- Placement Cell, IIIT Raichur

## 📞 Support

For issues or questions, contact the Placement Cell.

---

**Built with ❤️ for IIIT Raichur**
