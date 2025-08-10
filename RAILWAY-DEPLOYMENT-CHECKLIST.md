# 🚀 Railway Deployment Checklist

## ✅ Pre-Deployment Preparation (COMPLETED)

- [x] Updated Prisma schema to use PostgreSQL
- [x] Added PostgreSQL driver (pg) dependency
- [x] Created railway.json configuration file
- [x] Added production scripts to package.json
- [x] Created Dockerfile for containerization
- [x] Updated server port configuration
- [x] Generated secure JWT secret
- [x] Created deployment documentation

## 📋 Deployment Steps

### 1. Create Railway Account & Project
- [ ] Sign up at [railway.app](https://railway.app)
- [ ] Click "Start a New Project"
- [ ] Choose "Deploy from GitHub repo"
- [ ] Select your JobTracker repository
- [ ] Set source directory to `JobTracker-Backend`

### 2. Add PostgreSQL Database
- [ ] In Railway dashboard, click "New Service"
- [ ] Choose "Database" → "PostgreSQL"
- [ ] Wait for database to provision (2-3 minutes)

### 3. Configure Environment Variables
In Railway dashboard → Your Service → Variables tab, add:

```
NODE_ENV=production
JWT_SECRET=f5018c249217a61757acda8a0c2c0c3bf5a08dea2f1c2e77473775115d19615d84d5aee15e3a3ef21564c506d393c1bdbe81ffd6f0b2ba837589a50f7ca3c9ef
JWT_EXPIRES_IN=7d
PORT=3001
```

**Note:** DATABASE_URL is automatically provided by Railway when you add PostgreSQL

### 4. Deploy Application
- [ ] Railway will auto-deploy from GitHub
- [ ] Monitor deployment logs for errors
- [ ] Wait for "Deployed" status (5-10 minutes)

### 5. Run Database Migrations
- [ ] In Railway dashboard, go to your service
- [ ] Open the "Deploy" logs or use Railway CLI
- [ ] Run: `npx prisma migrate deploy`

### 6. Test Deployment
- [ ] Get your Railway app URL (e.g., `https://your-app.up.railway.app`)
- [ ] Test health endpoint: `GET /health`
- [ ] Test API base: `GET /api`
- [ ] Try login endpoint: `POST /api/auth/login`

### 7. Update Frontend Configuration
- [ ] Update frontend API_BASE_URL to point to Railway
- [ ] Test frontend-backend integration

## 🎯 Quick Start Commands

```bash
# Generate JWT secret (already done)
node generate-jwt-secret.js

# Test local build
npm run build

# Check dependencies
npm audit

# Test PostgreSQL connection (after deployment)
npx prisma db push
```

## 🚨 Important Notes

1. **JWT Secret**: Use the generated secret above - keep it secure!
2. **Database**: Railway auto-provides DATABASE_URL when you add PostgreSQL
3. **Port**: Railway will override PORT environment variable automatically
4. **CORS**: You'll need to update CORS_ORIGIN after deploying frontend
5. **Migrations**: Must run `prisma migrate deploy` after first deployment

## 🔧 Troubleshooting

### ⚠️ CURRENT ERROR: "Error creating build plan with Railpack"

**IMMEDIATE SOLUTION - Try these steps in order:**

1. **Check Root Directory Setting:**
   - In Railway dashboard → Your Service → Settings
   - Under "Source" section, ensure "Root Directory" is set to: `JobTracker-Backend`
   - Click "Update" if needed

2. **Force Builder Selection:**
   - In Railway dashboard → Settings → "Build"
   - Set "Builder" to "Nixpacks" (not Auto-detect)
   - Save and redeploy

3. **Use Updated Config Files:**
   - Ensure you've pushed the latest changes (updated `railway.json`, `nixpacks.toml`)
   - Both files have been optimized for Railway

4. **Clean Redeploy:**
   - Delete current Railway service
   - Create new service: "Deploy from GitHub repo"
   - Select repository and set root directory to `JobTracker-Backend`

### Build Failures ("Error creating build plan with Railpack"):

**Solution 1: Use simplified configuration**
1. Ensure these files exist in your backend folder:
   - `.nvmrc` (contains: `18`)
   - `Procfile` (contains: `web: npm start`)
   - `nixpacks.toml` (simplified build config)
   - `engines` field in package.json

**Solution 2: Manual build trigger**
1. In Railway dashboard → Your Service
2. Go to "Deployments" tab
3. Click "Deploy Now" to retry
4. Check build logs for specific errors

**Solution 3: Alternative deployment method**
1. Delete current service in Railway
2. Create new service
3. Choose "Empty Service" instead of GitHub
4. Connect GitHub repo afterward
5. Set root directory to `JobTracker-Backend`

### If deployment fails:
1. Check build logs in Railway dashboard
2. Verify all environment variables are set
3. Ensure PostgreSQL service is running
4. Check for dependency issues

### If database connection fails:
1. Verify PostgreSQL addon is added
2. Check DATABASE_URL is available
3. Run migrations: `npma prisma migrate deploy`

### If API calls fail:
1. Check CORS configuration
2. Verify JWT_SECRET is set correctly
3. Test endpoints individually

## 🎉 Success Indicators

- ✅ Railway shows "Deployed" status
- ✅ Health endpoint returns 200 OK
- ✅ Database migrations completed
- ✅ API endpoints respond correctly
- ✅ No errors in deployment logs

## 📞 Next Steps After Deployment

1. Note your Railway app URL
2. Update TODO-NEXT-STEPS.md with deployment URL
3. Proceed to frontend deployment on Vercel
4. Test complete application flow

---

**Your Railway URL will be:** `https://[generated-name].up.railway.app`

Good luck with the deployment! 🚀
