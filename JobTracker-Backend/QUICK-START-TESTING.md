# 🚀 Quick Start: Testing Your Backend Server

## 📋 **Prerequisites Check**

Before we start, let's make sure you have everything:

### **1. Node.js Installed?**
```bash
node --version
# Should show: v18.x.x or higher
```

If not installed: Download from [nodejs.org](https://nodejs.org)

### **2. In the Right Directory?**
```bash
pwd
# Should show: /Users/mahdicheraghali/Desktop/My Project/JobTracker-Backend
```

If not:
```bash
cd "/Users/mahdicheraghali/Desktop/My Project/JobTracker-Backend"
```

---

## 🛠️ **Step 1: Install Dependencies**

```bash
# Install all the packages we defined in package.json
npm install
```

**What's happening?**
- npm reads package.json
- Downloads all dependencies (express, cors, helmet, etc.)
- Creates node_modules folder with all the code

**You should see:**
```
added 250+ packages, and audited 251 packages in 30s
```

---

## ⚙️ **Step 2: Create Environment File**

```bash
# Copy the example environment file
cp .env.example .env
```

Now edit the .env file:
```bash
# Open in VS Code (recommended)
code .env
```

**Minimal setup for testing:**
```env
# Basic configuration for testing
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-key-for-testing-only
CORS_ORIGIN=http://localhost:3000

# Database - leave empty for now (we'll set this up later)
DATABASE_URL=""

# AWS - leave empty for now (we'll configure this later)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET=""
AWS_REGION=""
```

---

## 🚀 **Step 3: Start the Server**

```bash
# Start the simplified server (no database required)
node src/server-simple.js
```

**You should see:**
```
🎉 JobTracker Backend Server Started!
=====================================
🌐 Server running on: http://localhost:5000
📍 Health check: http://localhost:5000/health
🔗 API test: http://localhost:5000/api/test
🌍 Environment: development
⏰ Started at: 2024-01-XX...
=====================================

🎯 Try these URLs in your browser:
   • http://localhost:5000/health
   • http://localhost:5000/api/test
   • http://localhost:5000/api/auth/status

📝 To test POST requests, use:
   • Postman, Thunder Client, or curl
```

---

## 🧪 **Step 4: Test Your Server**

### **Test 1: Health Check (Browser)**
Open your browser and go to:
```
http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-XX...",
  "environment": "development",
  "version": "1.0.0",
  "message": "🎉 Your backend is working!"
}
```

### **Test 2: API Test (Browser)**
```
http://localhost:5000/api/test
```

**Expected Response:**
```json
{
  "message": "🚀 API is working!",
  "timestamp": "2024-01-XX...",
  "method": "GET",
  "url": "/api/test",
  "headers": {
    "user-agent": "Mozilla/5.0...",
    "content-type": null
  }
}
```

### **Test 3: Auth Status (Browser)**
```
http://localhost:5000/api/auth/status
```

**Expected Response:**
```json
{
  "message": "🔐 Auth endpoints coming soon!",
  "endpoints": [
    "POST /api/auth/register",
    "POST /api/auth/login",
    "POST /api/auth/logout"
  ]
}
```

### **Test 4: 404 Handler (Browser)**
```
http://localhost:5000/nonexistent
```

**Expected Response:**
```json
{
  "error": "Not Found",
  "message": "Route GET /nonexistent not found",
  "availableRoutes": [
    "GET /health - Server health check",
    "GET /api/test - Test API endpoint",
    "POST /api/test - Test POST endpoint",
    "GET /api/auth/status - Auth status",
    "GET /api/resumes - Resume endpoints (coming)",
    "GET /api/jobs - Job endpoints (coming)"
  ],
  "tip": "Try visiting /health or /api/test"
}
```

---

## 📝 **Step 5: Test POST Requests**

### **Using curl (Terminal)**
```bash
# Test POST endpoint with JSON data
curl -X POST http://localhost:5000/api/test \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "message": "Testing backend!"}'
```

**Expected Response:**
```json
{
  "message": "📝 POST request received!",
  "receivedData": {
    "name": "John",
    "message": "Testing backend!"
  },
  "timestamp": "2024-01-XX..."
}
```

### **Using VS Code Extension (Recommended)**

1. Install "Thunder Client" extension in VS Code
2. Create a new request:
   - Method: POST
   - URL: `http://localhost:5000/api/test`
   - Body: JSON
   ```json
   {
     "name": "Test User",
     "message": "Hello from frontend!"
   }
   ```
3. Send the request

---

## 🔍 **Understanding What Each Test Does**

### **Health Check** (`/health`)
- **Purpose**: Verify server is running
- **Learning**: Basic Express route, JSON response
- **Middleware**: None (direct route)

### **API Test** (`/api/test`)
- **Purpose**: Test API functionality 
- **Learning**: Request information extraction
- **Middleware**: Rate limiting applied (15min/100 requests)

### **POST Test** (`/api/test`)
- **Purpose**: Test request body parsing
- **Learning**: JSON parsing, POST handling
- **Middleware**: Body parser, rate limiting

### **404 Handler** (Any invalid URL)
- **Purpose**: Handle unknown routes gracefully
- **Learning**: Wildcard route matching
- **Middleware**: Runs after all other routes

---

## 🛠️ **Troubleshooting**

### **Error: "Cannot find module"**
```bash
# Solution: Install dependencies
npm install
```

### **Error: "Port 5000 already in use"**
```bash
# Solution: Use different port
echo "PORT=5001" >> .env
```

### **Error: "Permission denied"**
```bash
# Solution: Check file permissions
chmod +x src/server-simple.js
```

### **Error: "SyntaxError: Unexpected token"**
```bash
# Solution: Check Node.js version (needs 14+)
node --version
```

---

## 🎯 **Next Steps**

Once your server is running successfully:

1. ✅ **Server Working** - You should see all test endpoints responding
2. 🔄 **Test from Frontend** - Try connecting your React app
3. 🗄️ **Add Database** - Set up Prisma and PostgreSQL
4. 🔐 **Add Authentication** - Implement JWT auth system
5. 📁 **Add File Upload** - Configure AWS S3 integration

**Keep the server running** as we build more features!

---

## 🎉 **Success Indicators**

✅ Server starts without errors  
✅ Health check returns 200 status  
✅ API test shows request info  
✅ POST test accepts JSON data  
✅ 404 handler works for invalid routes  
✅ Console shows helpful startup messages  

**If all tests pass, your backend foundation is solid!** 🚀

---

## 📚 **What You've Learned**

- ✅ How to set up Express.js server
- ✅ Understanding middleware (security, CORS, parsing)
- ✅ Creating REST API endpoints
- ✅ Error handling and 404 responses
- ✅ Environment variables for configuration
- ✅ Testing backend endpoints manually
- ✅ Reading server logs and debugging

**Ready for the next level? Let's add database integration!** 📊
