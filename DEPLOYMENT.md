# 🚀 3D ULPIN Deployment Guide (Step-by-Step)

This guide walks you through deploying the complete **3D ULPIN** system (Frontend, FastAPI Backend, and PostgreSQL + PostGIS Database).

---

## 🌟 Recommended Free Setup (Vercel + Render)

### Part 1: Deploy Database & Backend on Render.com (100% Free)

1. **Sign up / Log in** to [Render.com](https://render.com) using your GitHub account (`Avivek121`).
2. **Create Managed PostgreSQL Database**:
   - Click **New +** -> **PostgreSQL**.
   - Name: `ulpin3d-db`
   - Database: `ulpin3d`
   - User: `postgres`
   - Plan: **Free**
   - Click **Create Database**.
   - Copy the **Internal Database URL** (e.g. `postgres://...`).
3. **Deploy FastAPI Backend Web Service**:
   - Click **New +** -> **Web Service**.
   - Connect repository: `Avivek121/SIH_PS-3dUlpin`.
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     - `DATABASE_URL`: *(Paste your Render database URL, replace `postgres://` with `postgresql+asyncpg://`)*
     - `SECRET_KEY`: `your-secure-jwt-secret-key-2026`
     - `CORS_ORIGINS`: `*`
   - Click **Create Web Service**.
   - Copy your live backend URL (e.g., `https://sih-ps-3dulpin-backend.onrender.com`).

---

### Part 2: Deploy Frontend on Vercel (Fastest & Free)

1. **Sign up / Log in** to [Vercel.com](https://vercel.com) using GitHub.
2. Click **Add New...** -> **Project**.
3. Import your repository: `Avivek121/SIH_PS-3dUlpin`.
4. Configure Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and choose `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - Add: `VITE_API_URL` = `https://your-backend.onrender.com/api/v1`
6. Click **Deploy**!
7. Your app is live with SSL at `https://sih-ps-3dulpin.vercel.app` 🎉

---

## 🐳 Alternative: Self-Host via Docker Compose (AWS / VPS / DigitalOcean)

If deploying to a Linux Virtual Machine (AWS EC2 / Ubuntu / Droplet):

```bash
# 1. Clone repository
git clone https://github.com/Avivek121/SIH_PS-3dUlpin.git
cd SIH_PS-3dUlpin

# 2. Start PostgreSQL + PostGIS & FastAPI
docker compose up -d --build

# 3. Build & serve frontend with Nginx or Caddy
cd frontend && npm install && npm run build
```
