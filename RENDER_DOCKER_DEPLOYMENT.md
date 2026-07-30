# 🚀 Render.com Docker Deployment Guide for BookMyTicket

This guide walks you through deploying your **BookMyTicket** Full-Stack application (Spring Boot + React + MySQL) onto **Render.com** using Docker containers.

---

## 🛠️ Created Deployment Artifacts

We have configured multi-stage Docker builds and Render Blueprint specifications:

1. 🐳 **Backend Dockerfile** ([backend/Dockerfile](file:///d:/python%20language/IT%20Vedant/MovieTicket%20-%20Copy%20%282%29/backend/Dockerfile)):
   - Multi-stage Maven 3.9 + Eclipse Temurin JDK 17 build.
   - Generates minimal Alpine production container exposing Port `8080`.

2. 🐳 **Frontend Dockerfile & Nginx Config** ([frontend/Dockerfile](file:///d:/python%20language/IT%20Vedant/MovieTicket%20-%20Copy%20%282%29/frontend/Dockerfile) & [frontend/nginx.conf](file:///d:/python%20language/IT%20Vedant/MovieTicket%20-%20Copy%20%282%29/frontend/nginx.conf)):
   - Node.js 20 build stage compiling Vite bundle.
   - Nginx Alpine web server with client-side SPA routing fallback exposing Port `80`.

3. 📋 **Render Blueprint Specification** ([render.yaml](file:///d:/python%20language/IT%20Vedant/MovieTicket%20-%20Copy%20%282%29/render.yaml)):
   - Automates deployment of both Backend and Frontend Docker Web Services with environment variables.

---

## 🌐 3-Step Deployment Instructions on Render.com

### Step 1: Push Code to GitHub
Ensure all new deployment files are pushed to your GitHub repository:
```bash
git add -A
git commit -m "feat: add Dockerfiles and Render blueprint for Docker deployment"
git push origin main
```

---

### Step 2: Connect GitHub Repository on Render
1. Log into your **[Render.com Dashboard](https://dashboard.render.com)**.
2. Click **New +** at the top right and select **Blueprint**.
3. Connect your GitHub repository: **`nitindiwewar/BookMyTicket`**.
4. Render will automatically detect `render.yaml` and create two Docker web services:
   - `bookmyticket-backend` (Docker)
   - `bookmyticket-frontend` (Docker)

---

### Step 3: Configure Database Connection
1. In your Render Dashboard, click **New +** -> **MySQL Database** (or connect a free **Aiven / PlanetScale / Railway** MySQL database).
2. Under `bookmyticket-backend` Environment Variables, set:
   - `SPRING_DATASOURCE_URL` = `jdbc:mysql://YOUR_HOST:3306/movieticket?useSSL=false&allowPublicKeyRetrieval=true`
   - `SPRING_DATASOURCE_USERNAME` = `your_username`
   - `SPRING_DATASOURCE_PASSWORD` = `your_password`
3. Click **Apply Changes** or **Deploy**.

---

### 🎉 Verification
Once deployment completes, Render will provide live production URLs for both services:
- **Frontend URL**: `https://bookmyticket-frontend.onrender.com`
- **Backend URL**: `https://bookmyticket-backend.onrender.com`
