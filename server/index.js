// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDb = require('./config/connectDb');

dotenv.config();

const coordinatorRoutes = require('./routes/coordinatorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Create uploads directory in development only (avoid writing to read-only serverless fs)
// If you need local uploads during development set NODE_ENV=development or ENABLE_LOCAL_UPLOADS=true
const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
if (process.env.NODE_ENV === 'development' || process.env.ENABLE_LOCAL_UPLOADS === 'true') {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  // Serve uploaded files statically only in development/local mode
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
} else {

}

app.use(cors({ origin: "https://placement-website-ozbc.vercel.app" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start function: connect to DB then mount routes and listen
const PORT = process.env.PORT || 5000;

async function start() {
  const ok = await connectDb();
  if (!ok) {
    console.error('Failed to connect to MongoDB. Exiting.');
    process.exit(1);
  }

  // mount routes after successful DB connection
  app.use('/api/coordinators', coordinatorRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/auth', authRoutes);
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();
