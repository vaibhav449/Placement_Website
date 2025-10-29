
# Placement Website v2

## Overview
Placement Website v2 is a full-stack web application designed to streamline college placement activities. It enables students to manage profiles and applications, coordinators to oversee placement processes, and companies to post opportunities and review candidates. The platform supports secure authentication, resume management, and bulk operations for efficient placement workflows.

## Features
- Student registration, login, and profile management
- Resume upload/download (Cloudinary integration)
- Company management (add, edit, delete, filter by type/campus)
- Application tracking and status updates
- Coordinator dashboard for statistics and management
- Secure authentication (JWT) and role-based access
- On-campus/off-campus, on-site/remote/hybrid company distinction
- Download all resumes as ZIP
- Bulk student registration via CSV/Excel

## Tech Stack
- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **File Storage:** Cloudinary
- **Authentication:** JWT

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Cloudinary account

### Installation & Setup
1. **Clone the repository:**
  ```sh
  git clone https://github.com/vaibhav449/Placement_Website.git
  cd Placement_Website
  ```
2. **Install dependencies:**
  ```sh
  cd client && npm install
  cd ../server && npm install
  ```
3. **Configure environment variables:**
  - Copy `.env.example` to `.env` in the `server` folder.
  - Fill in your MongoDB URI, JWT secret, and Cloudinary credentials.

### Running the Application
- **Backend:**
  ```sh
  cd server
  npm start
  ```
- **Frontend:**
  ```sh
  cd client
  npm run dev
  ```

### Seeding Dummy Data
To populate the database with test students and companies:
```sh
cd server
node scripts/insertDummyData.js
```
or use other scripts in `server/scripts/` as needed.

### Usage
- Register as a student or coordinator and log in.
- Students can upload resumes, view/apply to companies, and track applications.
- Coordinators can add/edit companies, view stats, and download resumes.
- Companies can be filtered by type (on-site, remote, hybrid) and campus (on-campus, off-campus).


## Folder Structure
```
client/
  src/
    components/        # React components (Auth, Coordinator, Student, Shared)
    context/           # React context providers
    hooks/             # Custom React hooks
    styles/            # CSS files (Tailwind, custom)
    utils/             # Helper functions, API logic
  index.html           # Main HTML file
  tailwind.config.js   # Tailwind CSS config
  postcss.config.js    # PostCSS config
server/
  controller/          # Express controllers (auth, coordinators, students)
  models/              # Mongoose models (application, companies, students)
  routes/              # Express routes
  scripts/             # Seed scripts for dummy data
  uploads/             # Resume uploads
  utils/               # Helper utilities (Cloudinary, etc.)
  config/              # DB connection config
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License



## License
MIT


## Author & Contact
Created by Vaibhav ([vaibhav449](https://github.com/vaibhav449))
For questions or support, open an issue or contact via GitHub.
