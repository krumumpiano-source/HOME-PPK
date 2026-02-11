# Deployment Guide for HOME PPK

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│         Frontend (React + Vite + Vercel)             │
│  https://home-ppk-frontend.vercel.app                 │
└─────────────────┬───────────────────────────────────┘
                  │ API Calls
                  │
┌─────────────────▼───────────────────────────────────┐
│      Backend (Node.js + Express + Render)            │
│  https://home-ppk-backend.onrender.com               │
└─────────────────────────────────────────────────────┘
```

---

## Frontend Setup (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free)
- Node.js 18+

### Steps

1. **Push to GitHub**
   ```bash
   cd d:\AI\ CURSER\HOME\ PPK\ GAS
   git init
   git add .
   git commit -m "Initial commit: HOME PPK System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/home-ppk.git
   git push -u origin main
   ```

2. **Setup Vercel**
   - Go to https://vercel.com/
   - Click "New Project"
   - Import GitHub repository
   - Select `home-ppk` repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add Environment Variables:
     - `REACT_APP_API_URL`: `https://home-ppk-backend.onrender.com`
   - Click "Deploy"

3. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your domain name
   - Update DNS records as instructed

---

## Backend Setup (Render)

### Prerequisites
- Render account (free)
- GitHub account

### Steps

1. **Prepare Backend**
   ```bash
   # Backend directory
   cd backend
   
   # Create .env file
   cp .env.example .env
   
   # Update .env with your settings
   ```

2. **Setup Render**
   - Go to https://render.com/
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository
   - Configure:
     - **Name**: `home-ppk-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Root Directory**: `backend`
   - Add Environment Variables:
     ```
     NODE_ENV=production
     PORT=3000
     FRONTEND_URL=https://home-ppk-frontend.vercel.app
     ```
   - Click "Create Web Service"

3. **Get Deployment Hook**
   - In Render dashboard, find your service
   - Go to "Settings" → "Deploy Hook"
   - Copy the webhook URL
   - Add to GitHub as `RENDER_DEPLOY_HOOK` secret

---

## GitHub Secrets Setup

### For Frontend (Vercel)
1. Go to Repository Settings → Secrets
2. Add:
   - `VERCEL_TOKEN`: From Vercel Account Settings → Tokens
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: From project settings

### For Backend (Render)
1. Go to Repository Settings → Secrets
2. Add:
   - `RENDER_DEPLOY_HOOK`: From Render service settings

---

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://home-ppk-backend.onrender.com
```

### Backend (.env)
```
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://home-ppk-frontend.vercel.app
```

---

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## Monitoring & Logs

### Vercel
- Dashboard shows build status
- Click deployment to see logs
- Check analytics and performance metrics

### Render
- Dashboard shows service status
- Click service to view logs
- Check metrics and CPU usage

---

## Troubleshooting

### Frontend not connecting to backend
- Check `REACT_APP_API_URL` environment variable
- Ensure backend server is running
- Check CORS settings in backend

### Backend deployment fails
- Check logs in Render dashboard
- Verify `package.json` in backend directory
- Ensure all dependencies are listed

### API errors
- Check Network tab in browser DevTools
- Verify endpoint URLs match
- Check backend server logs

---

## CI/CD Pipeline

Automated deployments on push to main:

1. **Push to main** → GitHub
2. **Frontend workflow** → Build & Deploy to Vercel
3. **Backend workflow** → Trigger Render deploy hook

---

## Next Steps

1. ✅ Setup GitHub repository
2. ✅ Configure Vercel for frontend
3. ✅ Configure Render for backend
4. ✅ Setup GitHub secrets for CI/CD
5. ✅ Test API connection
6. ✅ Update production URLs in code
7. ✅ Add custom domain (optional)

