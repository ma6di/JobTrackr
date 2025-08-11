# 🚀 JobTracker - Full-Stack Job Application Manager

A modern, full-stack web application for tracking job applications, managing resumes, and organizing your job search process.

![JobTracker](https://img.shields.io/badge/Status-Live-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-blue)
![Frontend](https://img.shields.io/badge/Frontend-Vercel-black)
![Backend](https://img.shields.io/badge/Backend-Railway-purple)

## 🌐 **Live Application**

**🎯 Try it now:** **[https://job-trackr-murex.vercel.app](https://job-trackr-murex.vercel.app)**

---

## ✨ Features

### 🔐 **User Authentication**
- Secure user registration and login
- JWT-based authentication
- Password strength validation
- Secure session management

### 💼 **Job Application Management**
- Create, edit, and delete job applications
- Track application status (Applied, Interview, Offer, Rejected)
- Store job details (company, position, location, salary, etc.)
- Application date tracking and sorting

### 📄 **Resume Management**
- Upload and manage multiple resumes
- Support for PDF, DOC, DOCX formats
- Resume preview and download
- Link resumes to specific job applications

### 👤 **User Profile**
- Personal information management
- Profile picture upload
- Contact information
- Account settings

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma** - Next-generation ORM
- **JWT** - Secure authentication tokens
- **Bcrypt** - Password hashing

### Database
- **PostgreSQL** - Robust relational database
- **Railway** - Cloud database hosting

### Deployment
- **Railway** - Backend and database hosting
- **SSL/TLS** - Secure connections

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jobtracker.git
   cd jobtracker
   ```

2. **Install Backend Dependencies**
   ```bash
   cd JobTracker-Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../JobTracker
   npm install
   ```

4. **Environment Setup**
   
   Backend (`.env`):
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/jobtracker"
   JWT_SECRET="your-super-secure-jwt-secret"
   NODE_ENV="development"
   PORT=3000
   ```
   
   Frontend (`.env.local`):
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_NODE_ENV=development
   ```

5. **Database Setup**
   ```bash
   cd JobTracker-Backend
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Start Development Servers**
   
   Backend:
   ```bash
   cd JobTracker-Backend
   npm run dev
   ```
   
   Frontend:
   ```bash
   cd JobTracker
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📱 Usage

### 🔐 **Password Requirements**
When creating an account, ensure your password meets these security requirements:
- ✅ **Minimum 8 characters**
- ✅ **At least one uppercase letter (A-Z)**
- ✅ **At least one lowercase letter (a-z)**
- ✅ **At least one number (0-9)**
- ✅ **At least one special character (!@#$%^&*)**

### 🚀 **Getting Started**
1. **Visit:** https://job-trackr-murex.vercel.app
2. **Register** a new account with a strong password
3. **Create job applications** with company details and application status
4. **Upload resumes** and link them to specific applications
5. **Track your progress** through the job search process
6. **Manage your profile** and account settings

## 🏗️ Project Structure

```
JobTracker/
├── JobTracker-Backend/          # Backend API
│   ├── src/
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Express middleware
│   │   ├── services/           # Business logic
│   │   ├── utils/             # Helper functions
│   │   └── server.js          # Main server file
│   ├── prisma/                # Database schema and migrations
│   └── package.json
├── JobTracker/                 # Frontend React app
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── contexts/         # React contexts
│   ├── public/               # Static assets
│   └── package.json
└── docs/                     # Documentation
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Jobs
- `GET /api/jobs` - Get user's job applications
- `POST /api/jobs` - Create new job application
- `PUT /api/jobs/:id` - Update job application
- `DELETE /api/jobs/:id` - Delete job application

### Resumes
- `GET /api/resumes` - Get user's resumes
- `POST /api/resumes` - Upload new resume
- `DELETE /api/resumes/:id` - Delete resume

## 🚀 Deployment

### Live Production URLs
- **Frontend:** https://job-trackr-murex.vercel.app
- **Backend API:** https://jobtrackr-production.up.railway.app

### Frontend (Vercel)
✅ **Currently Deployed**
- Automatic deployments on push to main branch
- Environment variables configured for production backend
- Optimized build with Vite

### Backend (Railway)
✅ **Currently Deployed**
- PostgreSQL database hosted on Railway
- Environment variables configured
- Automatic schema migration on startup
- SSL/TLS encryption enabled

### Environment Configuration
**Production Backend Environment:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secure token for authentication
- `NODE_ENV=production`
- `CORS_ORIGIN=https://job-trackr-murex.vercel.app`

**Production Frontend Environment:**
- `VITE_API_URL=https://jobtrackr-production.up.railway.app/api`
- `VITE_NODE_ENV=production`

## 🔧 Development

### Available Scripts

Backend:
- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Prisma client

Frontend:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Deployed on Railway cloud platform
- Designed for job seekers and career professionals

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact the development team.

---

**Happy Job Hunting!** 🎯
