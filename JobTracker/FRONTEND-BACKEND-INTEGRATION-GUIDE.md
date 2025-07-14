# Frontend-Backend Integration Testing Guide

## Overview
This guide walks you through testing the complete frontend-backend integration for the JobTracker file upload system. We've successfully integrated React components with a backend API that handles file uploads to AWS S3.

## Current Status: ✅ COMPLETE + TESTING
- ✅ Backend server running on http://localhost:3001
- ✅ Frontend server running on http://localhost:5175
- ✅ Authentication system (register/login) fully implemented
- ✅ Frontend API service layer created and configured  
- ✅ ResumesContext updated for async backend operations
- ✅ AddResumeModal updated with loading states and error handling
- ✅ Resumes page updated with download and delete functionality
- ✅ Error handling and loading states implemented throughout
- ✅ Register and Login pages integrated with backend
- 🧪 UI Testing: Registration and login flow via web interface

## Architecture Summary

### Backend (JobTracker-Backend) - Port 3001
- **Express server** with authentication middleware
- **File upload system** using Multer + AWS S3 integration
- **SQLite database** with Prisma ORM for development
- **JWT authentication** for secure API access
- **CORS enabled** for frontend communication on port 5175

### Frontend (JobTracker) - Port 5175 (Vite)
- **React + Vite** for fast development
- **API service layer** for backend communication
- **Context-based state management** for resumes
- **File upload with drag-and-drop** interface
- **Loading states and error handling** throughout
- **Registration and Login pages** with backend integration

## Testing the Integration

### 1. Start Both Servers

#### Backend (currently running):
```bash
cd /Users/mahdicheraghali/Desktop/My\ Project/JobTracker-Backend
npm start
```
Should show: `🚀 JobTracker Backend Server Started! 🌐 Server running on port: 3001`

#### Frontend (currently running):
```bash
cd /Users/mahdicheraghali/Desktop/My\ Project/JobTracker
npm run dev
```
Currently running on: `http://localhost:5175`

### 2. Test API Connectivity
First, verify the backend health endpoint:
```bash
curl http://localhost:3001/api/health
```
Expected response: `{"status":"ok","message":"JobTracker Backend is running"}`

### 3. Test User Registration/Login via curl (Optional)
Before testing UI, you can optionally test the API directly:

#### Register a test user:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User", 
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response includes a JWT token:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com"
  }
}
```

### 4. 🧪 UI Testing - Register & Login Flow (CURRENT)

#### Test via Web Interface (http://localhost:5175):

**Step 1: Register a New Account**
1. Open http://localhost:5175 in your browser
2. Click "Sign up here" link on the login page (or go to /register)
3. Fill out the registration form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com (or any valid email)
   - Password: password123
4. Click "Create Account"
5. Should show loading spinner, then redirect to dashboard on success
6. Should show error message if email already exists

**Step 2: Test Login Flow**
1. If auto-redirected after registration, click logout (or navigate to /login)
2. Enter the same credentials used for registration
3. Click "Sign In"
4. Should show loading spinner, then redirect to dashboard on success
5. Should show error for invalid credentials

**Step 3: Test Navigation Between Register/Login**
1. On login page, click "Sign up here" → should go to /register
2. On register page, click "Sign in here" → should go to /login
3. Both pages should be fully functional and responsive

### 5. Frontend Integration Testing (After Authentication)

#### In the Browser (http://localhost:5175):

1. **Navigate to Login Page**
   - Click on "Profile" or any protected route
   - Should redirect to login page if not authenticated

2. **Login with Test Credentials**
   - Email: `test@example.com`
   - Password: `password123`
   - Should successfully login and redirect to dashboard

3. **Navigate to Resumes Page**
   - Click "Resumes" in navigation
   - Should show empty state: "No resumes yet"

4. **Test File Upload**
   - Click "Upload New Resume" button
   - Modal should open with drag-and-drop interface
   - Try uploading a PDF or Word document
   - Should show loading spinner during upload
   - Should close modal on success and show uploaded resume

5. **Test File Download**
   - Click the green download button on an uploaded resume
   - Browser should download the file

6. **Test File Deletion**
   - Click the red delete button on a resume
   - Resume should be removed from the list

### 6. Error Scenarios to Test

1. **Invalid File Types**
   - Try uploading an image or text file
   - Should show error: "Please select a PDF or Word document"

2. **Large Files**
   - Try uploading a file larger than 10MB
   - Should show error: "File size must be less than 10MB"

3. **Network Errors**
   - Stop the backend server
   - Try uploading a file
   - Should show connection error

4. **Authentication Errors**
   - Clear localStorage in browser dev tools
   - Try accessing protected routes
   - Should redirect to login

## File Structure Summary

### Frontend Files Modified:
```
JobTracker/
├── src/
│   ├── services/api.js                 # ✅ NEW: API service layer
│   ├── contexts/ResumesContext.jsx     # ✅ UPDATED: Backend integration
│   ├── components/AddResumeModal.jsx   # ✅ UPDATED: Async upload handling
│   └── pages/Resumes.jsx              # ✅ UPDATED: Download/delete handlers
```

### Backend Files (Already Complete):
```
JobTracker-Backend/
├── src/
│   ├── services/api.js              # API service layer
│   ├── utils/fileUpload.js          # File upload utilities
│   ├── routes/resumes.js            # Resume CRUD endpoints
│   ├── middleware/auth.js           # Authentication middleware
│   └── server-auth.js              # Main server with auth
├── .env                             # Environment configuration
└── temp/uploads/                    # Temporary file storage
```

## Integration Features Implemented

### ✅ File Upload Flow
1. **Frontend**: User selects file in AddResumeModal
2. **Validation**: Client-side file type and size validation
3. **API Call**: FormData sent to POST /api/resumes
4. **Backend**: Multer processes file, validates, uploads to S3
5. **Database**: Resume metadata stored in SQLite
6. **Response**: Frontend updates context with new resume

### ✅ File Download Flow
1. **Frontend**: User clicks download button
2. **API Call**: GET /api/resumes/:id/download with auth token
3. **Backend**: Retrieves file from S3, streams to client
4. **Browser**: Automatically downloads file

### ✅ File Delete Flow
1. **Frontend**: User clicks delete button
2. **API Call**: DELETE /api/resumes/:id with auth token
3. **Backend**: Removes file from S3 and database record
4. **Frontend**: Updates context to remove deleted resume

### ✅ Error Handling
- **File validation** errors shown in modal
- **Network errors** displayed in UI
- **Authentication errors** redirect to login
- **Server errors** show user-friendly messages

### ✅ Loading States
- **Upload progress** spinner in modal button
- **Page loading** spinner while fetching resumes
- **Button states** prevent double-clicks during operations

## Next Steps for Production

1. **AWS S3 Setup**: Configure real AWS credentials and bucket
2. **Database Migration**: Switch from SQLite to PostgreSQL
3. **Authentication Enhancement**: Add password reset, email verification
4. **File Preview**: Add PDF preview capabilities
5. **File Versioning**: Track multiple versions of same resume
6. **Bulk Operations**: Upload multiple files at once
7. **Search & Filter**: Add resume search and filtering
8. **Analytics**: Track download counts, view statistics

## Troubleshooting

### Backend Issues:
- **Port conflicts**: Change PORT in .env file
- **Database errors**: Run `npm run db:push` to sync schema
- **File upload errors**: Check temp/uploads directory permissions

### Frontend Issues:
- **API connection**: Verify API_BASE_URL in src/services/api.js
- **CORS errors**: Check backend CORS_ORIGIN setting
- **Authentication**: Clear localStorage and re-login

### Common Fixes:
- **Restart both servers** if seeing stale data
- **Check browser console** for detailed error messages
- **Verify environment variables** in .env files

## Success Indicators

When everything is working correctly, you should see:
- ✅ Backend server running without errors
- ✅ Frontend connecting to backend successfully
- ✅ User can register/login via UI
- ✅ File uploads work with progress indicators
- ✅ Downloaded files match uploaded files
- ✅ Error messages display appropriately
- ✅ Loading states provide good UX

This completes the frontend-backend integration for the JobTracker file upload system!
