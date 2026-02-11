# HOME PPK - Frontend + Backend Setup Guide

## 📦 Project Structure

```
HOME PPK GAS/
├── frontend/                 # React + Vite (Deploy to Vercel)
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   ├── .env.example
│   └── .gitignore
│
├── backend/                  # Node.js + Express (Deploy to Render)
│   ├── src/server.js
│   ├── src/routes/
│   ├── package.json
│   ├── render.yaml
│   ├── .env.example
│   └── .gitignore
│
├── docs/
│   ├── DEPLOYMENT.md        # Step-by-step deployment guide
│   ├── SETUP_GUIDE.md       # System setup
│   └── README.md            # Complete documentation
│
└── .github/
    └── workflows/
        ├── deploy-frontend.yml
        └── deploy-backend.yml
```

---

## 🚀 Quick Start

### 1. Local Development

**Backend:**
```bash
cd backend
npm install
npm run dev
# http://localhost:3000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

---

### 2. Deploy to Vercel (Frontend)

1. Push code to GitHub
2. Go to https://vercel.com/
3. Import `frontend` folder
4. Set environment: `REACT_APP_API_URL=https://home-ppk-backend.onrender.com`
5. Deploy

---

### 3. Deploy to Render (Backend)

1. Go to https://render.com/
2. Create Web Service from GitHub
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Set environment variables
7. Deploy

---

## 🔗 API Endpoints

All endpoints use base URL:
- **Local**: `http://localhost:3000`
- **Production**: `https://home-ppk-backend.onrender.com`

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/verify`

### Users
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Bills
- `GET /api/bills`
- `GET /api/bills/:id`
- `POST /api/bills`

### Payments
- `GET /api/payments`
- `POST /api/payments`

### Requests
- `GET /api/requests`
- `POST /api/requests`

### Expenses
- `GET /api/expenses`
- `POST /api/expenses`

### Utilities
- `GET /api/utilities`
- `POST /api/utilities`

### Regulations
- `GET /api/regulations`
- `POST /api/regulations`

### Admin
- `GET /api/admin/settings`
- `PUT /api/admin/settings`

### Statistics
- `GET /api/statistics/dashboard`

---

## 📋 Checklist

- [ ] GitHub repository created and code pushed
- [ ] Vercel account created and frontend deployed
- [ ] Render account created and backend deployed
- [ ] GitHub secrets configured
- [ ] Frontend can connect to backend API
- [ ] Login functionality working
- [ ] Database connections configured
- [ ] Email notifications setup (optional)
- [ ] Custom domain setup (optional)
- [ ] Monitoring and logs enabled

---

## 💡 Tips

- Keep `.env` files in `.gitignore` (never commit secrets)
- Use `.env.example` as template
- Test API locally before deployment
- Monitor logs regularly
- Set up email alerts on Render

---

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed step-by-step instructions.
