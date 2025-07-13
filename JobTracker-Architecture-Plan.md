# 🏗️ JobTrackr Complete Architecture & Development Plan

## 📋 **PROJECT OVERVIEW**
**JobTrackr** - A professional job application tracking system with resume management, application tracking, and analytics.

---

## 🎯 **FRONTEND ARCHITECTURE**

### **🛠️ Technology Stack**
```
⚛️  React 18              - UI framework
🚀  Vite                  - Build tool & dev server  
🎨  Tailwind CSS v4       - Styling framework
🧭  React Router          - Client-side routing
📱  Responsive Design     - Mobile-first approach
🌙  Dark Mode             - Theme switching
```

### **📁 Frontend File Structure**
```
JobTracker/
├── 📦 package.json           # Dependencies & scripts
├── ⚙️ vite.config.js          # Vite configuration
├── 🎨 tailwind.config.js      # Tailwind CSS config
├── 🎨 postcss.config.js       # PostCSS config
├── 📄 index.html              # Entry HTML file
└── src/
    ├── 🏠 main.jsx            # React app entry point
    ├── 🎯 App.jsx             # Main app component
    ├── 🎨 index.css           # Global styles
    ├── 🌍 contexts/           # Global state management
    │   ├── ThemeContext.jsx   # Dark/light mode
    │   ├── ResumesContext.jsx # Resume data
    │   ├── JobsContext.jsx    # Job application data
    │   └── AuthContext.jsx    # User authentication (future)
    ├── 🧩 components/         # Reusable UI components
    │   ├── Navigation.jsx     # Top navigation
    │   ├── AddResumeModal.jsx # Resume upload modal
    │   ├── AddJobModal.jsx    # Job application modal
    │   ├── LoadingSpinner.jsx # Loading indicator (future)
    │   └── ErrorBoundary.jsx  # Error handling (future)
    └── 📄 pages/              # Individual page components
        ├── Login.jsx          # Authentication page
        ├── Dashboard.jsx      # Main overview
        ├── Resumes.jsx        # Resume management
        ├── Jobs.jsx           # Job application tracking
        ├── Analytics.jsx      # Charts & reports (future)
        └── Profile.jsx        # User settings
```

### **🔄 Frontend Data Flow**
```
User Action → Component Event → Context State → UI Update
     ↓              ↓               ↓            ↓
  Click Button → onClick Handler → setState() → Re-render
     ↓              ↓               ↓            ↓
  Upload File → Modal Form → Resume Context → Resume List
```

---

## 🖥️ **BACKEND ARCHITECTURE**

### **🛠️ Technology Stack**
```
🟢 Node.js               - Runtime environment
🚀 Express.js            - Web framework
🗄️ PostgreSQL (AWS RDS)  - Primary database
🔧 Prisma                - ORM (Object-Relational Mapping)
🔐 JWT                   - Authentication tokens
🗂️ Multer                - File upload handling
📁 AWS S3                - File storage for resumes
🌐 AWS EC2/Lambda        - Server hosting
📊 AWS CloudWatch        - Monitoring & logs
```

### **📁 Backend File Structure**
```
JobTracker-Backend/
├── 📦 package.json           # Dependencies & scripts
├── ⚙️ .env                    # Environment variables (secrets)
├── 🗄️ prisma/                # Database configuration
│   ├── schema.prisma         # Database schema definition
│   └── migrations/           # Database version history
├── 📁 uploads/               # Temporary file storage
└── src/
    ├── 🏠 server.js           # Express server entry point
    ├── ⚙️ config/             # Configuration files
    │   ├── database.js        # Database connection
    │   ├── aws.js             # AWS services config
    │   └── auth.js            # JWT configuration
    ├── 🧩 middleware/         # Express middleware
    │   ├── auth.js            # Authentication middleware
    │   ├── validation.js      # Request validation
    │   ├── fileUpload.js      # File handling
    │   └── errorHandler.js    # Error management
    ├── 🗄️ models/             # Database models (Prisma)
    │   ├── User.js            # User model
    │   ├── Resume.js          # Resume model
    │   └── JobApplication.js  # Job application model
    ├── 🎯 controllers/        # Business logic
    │   ├── authController.js  # Login/register/logout
    │   ├── userController.js  # User profile management
    │   ├── resumeController.js # Resume CRUD operations
    │   └── jobController.js   # Job application CRUD
    ├── 🛣️ routes/              # API endpoints
    │   ├── auth.js            # /api/auth/* routes
    │   ├── users.js           # /api/users/* routes
    │   ├── resumes.js         # /api/resumes/* routes
    │   └── jobs.js            # /api/jobs/* routes
    └── 🔧 utils/              # Helper functions
        ├── fileUtils.js       # File processing
        ├── emailUtils.js      # Email notifications (future)
        └── validation.js      # Data validation helpers
```

### **🗄️ Database Schema (PostgreSQL)**
```sql
-- 👤 Users table
Users {
  id          UUID PRIMARY KEY
  email       VARCHAR UNIQUE NOT NULL
  password    VARCHAR NOT NULL (hashed)
  firstName   VARCHAR NOT NULL
  lastName    VARCHAR NOT NULL
  createdAt   TIMESTAMP DEFAULT NOW()
  updatedAt   TIMESTAMP DEFAULT NOW()
}

-- 📄 Resumes table  
Resumes {
  id          UUID PRIMARY KEY
  userId      UUID FOREIGN KEY → Users.id
  name        VARCHAR NOT NULL
  fileName    VARCHAR NOT NULL (original filename)
  fileUrl     VARCHAR NOT NULL (S3 URL)
  fileSize    INTEGER (bytes)
  mimeType    VARCHAR (PDF, DOC, etc.)
  description TEXT
  createdAt   TIMESTAMP DEFAULT NOW()
  updatedAt   TIMESTAMP DEFAULT NOW()
}

-- 💼 Job Applications table
JobApplications {
  id              UUID PRIMARY KEY
  userId          UUID FOREIGN KEY → Users.id
  resumeId        UUID FOREIGN KEY → Resumes.id (optional)
  
  -- Company & Position Info
  company         VARCHAR NOT NULL
  position        VARCHAR NOT NULL
  location        VARCHAR
  salary          VARCHAR
  jobType         VARCHAR (Full-time, Part-time, Contract)
  remoteType      VARCHAR (Remote, Hybrid, On-site)
  
  -- Application Details
  applicationDate DATE NOT NULL
  source          VARCHAR (Manual, LinkedIn, Indeed, etc.)
  jobUrl          VARCHAR (link to job posting)
  status          VARCHAR NOT NULL (Applied, Pending, Interview, Rejected, Offer)
  
  -- Job Content
  description     TEXT
  requirements    TEXT
  notes           TEXT
  
  -- Tracking
  matchScore      INTEGER (0-100, how well skills match)
  followUpDate    DATE (when to follow up)
  
  createdAt       TIMESTAMP DEFAULT NOW()
  updatedAt       TIMESTAMP DEFAULT NOW()
}

-- 📞 Interview Tracking (future enhancement)
Interviews {
  id              UUID PRIMARY KEY
  jobApplicationId UUID FOREIGN KEY → JobApplications.id
  interviewType   VARCHAR (Phone, Video, In-person)
  scheduledDate   TIMESTAMP
  interviewer     VARCHAR
  notes           TEXT
  outcome         VARCHAR (Passed, Failed, Pending)
  createdAt       TIMESTAMP DEFAULT NOW()
}
```

---

## 🌐 **API ENDPOINTS DESIGN**

### **🔐 Authentication Routes**
```javascript
POST   /api/auth/register        // Create new user account
POST   /api/auth/login           // Login user & get JWT token  
POST   /api/auth/logout          // Logout user
POST   /api/auth/refresh         // Refresh JWT token
POST   /api/auth/forgot-password // Password reset email
POST   /api/auth/reset-password  // Reset password with token
```

### **👤 User Routes**
```javascript
GET    /api/users/profile        // Get current user profile
PUT    /api/users/profile        // Update user profile
DELETE /api/users/account        // Delete user account
GET    /api/users/stats          // Get dashboard statistics
```

### **📄 Resume Routes**
```javascript
GET    /api/resumes              // Get all user's resumes
POST   /api/resumes              // Upload new resume
GET    /api/resumes/:id          // Get specific resume details
PUT    /api/resumes/:id          // Update resume info
DELETE /api/resumes/:id          // Delete resume
GET    /api/resumes/:id/download // Download resume file
```

### **💼 Job Application Routes**
```javascript
GET    /api/jobs                 // Get all user's job applications
POST   /api/jobs                 // Create new job application
GET    /api/jobs/:id             // Get specific job application
PUT    /api/jobs/:id             // Update job application
DELETE /api/jobs/:id             // Delete job application
GET    /api/jobs/stats           // Get application statistics
POST   /api/jobs/:id/notes       // Add note to application
```

---

## 🔄 **DATA FLOW & INTEGRATION**

### **📱 Frontend → Backend Communication**
```javascript
// Frontend makes HTTP requests to backend API
const response = await fetch('/api/resumes', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(resumeData)
})

// Backend processes request and returns JSON
const result = await response.json()
```

### **🔐 Authentication Flow**
```
1. User enters credentials → Frontend
2. Frontend sends POST /api/auth/login → Backend  
3. Backend validates → Database
4. Backend returns JWT token → Frontend
5. Frontend stores token → localStorage
6. Frontend includes token in all API requests
7. Backend validates token for protected routes
```

### **📁 File Upload Flow**
```
1. User selects file → Frontend
2. Frontend shows upload progress
3. File sent to → Backend (Multer middleware)
4. Backend validates file type/size
5. Backend uploads to → AWS S3
6. Backend saves metadata → Database
7. Backend returns file URL → Frontend
8. Frontend updates UI with new resume
```

---

## ☁️ **AWS INFRASTRUCTURE**

### **🏗️ AWS Services Used**
```
🗄️ RDS PostgreSQL        - Database hosting
📁 S3 Bucket             - Resume file storage  
🖥️ EC2 / Lambda          - Backend API hosting
🌐 CloudFront            - CDN for file delivery
📊 CloudWatch            - Monitoring & logging
🔒 IAM                   - Access management
🌍 Route 53              - Domain management (optional)
```

### **💰 AWS Cost Breakdown**
```
📊 FREE TIER (First 12 months):
├── RDS PostgreSQL: 750 hours/month FREE
├── EC2 t3.micro: 750 hours/month FREE
├── S3 Storage: 5GB FREE
├── CloudFront: 50GB transfer FREE
└── Lambda: 1M requests FREE

📈 AFTER FREE TIER:
├── RDS: ~$15-25/month
├── EC2: ~$8-15/month  
├── S3: ~$1-5/month
├── CloudFront: ~$1-5/month
└── Total: ~$25-50/month
```

---

## 🚀 **DEVELOPMENT PHASES**

### **Phase 1: Foundation (Week 1-2)**
```
✅ Frontend modal integration (COMPLETED)
⏳ Backend basic setup
⏳ Database schema creation
⏳ AWS account & RDS setup
⏳ Authentication system
⏳ Basic CRUD operations
```

### **Phase 2: Core Features (Week 3-4)**
```
⏳ Resume upload & management
⏳ Job application tracking
⏳ File storage (S3 integration)
⏳ API integration with frontend
⏳ Error handling & validation
```

### **Phase 3: Enhancement (Week 5-6)**
```
⏳ Advanced job application features
⏳ Dashboard analytics
⏳ Search & filtering
⏳ Email notifications
⏳ Performance optimization
```

### **Phase 4: Production (Week 7-8)**
```
⏳ Security hardening
⏳ Production deployment
⏳ Monitoring setup
⏳ Backup strategies
⏳ User testing & feedback
```

---

## 🔧 **DEVELOPMENT TOOLS & SETUP**

### **👨‍💻 Local Development Environment**
```
📝 Code Editor: VS Code
🐙 Version Control: Git + GitHub
🗄️ Database: PostgreSQL (local) + AWS RDS (production)
🧪 API Testing: Postman or Thunder Client
🔍 Debugging: Browser DevTools, Node.js debugger
📊 Monitoring: Console logs, AWS CloudWatch
```

### **📦 Package Management**
```javascript
// Frontend dependencies
"react": "^18.x"           // UI framework
"react-router-dom": "^6.x" // Routing
"tailwindcss": "^4.x"      // Styling

// Backend dependencies  
"express": "^4.x"          // Web framework
"prisma": "^5.x"           // Database ORM
"jsonwebtoken": "^9.x"     // Authentication
"multer": "^1.x"           // File uploads
"aws-sdk": "^3.x"          // AWS services
```

---

## 🎯 **SUCCESS METRICS**

### **📊 Technical Goals**
- ⚡ Page load time < 2 seconds
- 📱 Mobile responsive design
- 🔒 Secure authentication & authorization
- 📁 Support files up to 10MB
- 🌐 99.9% uptime in production

### **👤 User Experience Goals**
- 🎯 Intuitive job application tracking
- 📊 Clear visual status indicators
- 🔄 Seamless file upload process
- 🌙 Smooth dark/light mode switching
- 📱 Mobile-friendly interface

This architecture provides a solid foundation for building a professional, scalable job tracking application that can grow with user needs!
