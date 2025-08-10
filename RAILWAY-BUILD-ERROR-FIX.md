# 🚨 QUICK FIX: Railway "Error creating build plan with Railpack"

## Immediate Steps (Fix Current Error)

### 1. Check Railway Settings
Go to your Railway dashboard → Your Service → Settings:

- **Root Directory**: Must be set to `JobTracker-Backend`
- **Builder**: Set to `Nixpacks` (not Auto-detect)
- **Start Command**: Should be `npm start`

### 2. Environment Variables
Ensure these are set in Railway → Variables:
```
NODE_ENV=production
JWT_SECRET=f5018c249217a61757acda8a0c2c0c3bf5a08dea2f1c2e77473775115d19615d84d5aee15e3a3ef21564c506d393c1bdbe81ffd6f0b2ba837589a50f7ca3c9ef
JWT_EXPIRES_IN=7d
PORT=3001
```

### 3. If Still Failing - Nuclear Option
1. **Delete** current Railway service completely
2. Create **new service**: "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `JobTracker-Backend`
5. Add PostgreSQL database service separately
6. Set environment variables
7. Deploy

## Why This Happens
- Railway can't detect project type
- Wrong root directory setting
- Config file conflicts
- Missing Node.js version specification

## Files Updated to Fix This
- ✅ `package.json` - Added engines field
- ✅ `railway.json` - Simplified configuration
- ✅ `nixpacks.toml` - Fixed build commands
- ✅ `railway.toml` - Backup configuration
- ✅ `.nvmrc` - Node 18 specified
- ✅ `Procfile` - Web process defined

## Next Steps After Fix
1. Push changes to GitHub
2. Follow steps above
3. Monitor deployment logs
4. Test health endpoint: `https://your-app.up.railway.app/health`

**The error should be resolved with these updated configuration files!**
