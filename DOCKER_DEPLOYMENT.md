# Docker Deployment Guide — Movie Ticket Booking Application

This project is fully containerized using **Docker** and **Docker Compose**. It consists of 3 services:
1. **`movieticket-mysql`**: Database (MySQL 8.0)
2. **`movieticket-backend`**: Spring Boot 3 Java 17 REST API
3. **`movieticket-frontend`**: React + Vite SPA served via Nginx

---

## 🚀 Quick Start (Single Command Deployment)

Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed and running on your system, then open a terminal in the root directory of this project and run:

```bash
docker-compose up --build -d
```

---

## 📍 Accessing the Services

Once all containers start successfully:

- **Frontend Application (User & Admin Portals)**: [http://localhost:80](http://localhost:80) or [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:8080/api](http://localhost:8080/api)
- **MySQL Database**: `localhost:3306` (Database: `movieticket`, User: `root`, Password: `Nitin@2004`)

---

## 🛠️ Useful Docker Commands

### View Running Containers & Health Status:
```bash
docker-compose ps
```

### View Live Logs:
```bash
# All services
docker-compose logs -f

# Backend logs only
docker-compose logs -f backend

# Frontend logs only
docker-compose logs -f frontend
```

### Stop All Containers:
```bash
docker-compose down
```

### Stop Containers & Wipe Data Volumes (Clean Reset):
```bash
docker-compose down -v
```

---

## ⚙️ Environment Variables Customization

You can create a `.env` file in the root directory to override default keys:

```env
MYSQL_ROOT_PASSWORD=YourSecurePassword
MYSQL_DATABASE=movieticket
SPRING_MAIL_USERNAME=nitindiwewar0@gmail.com
SPRING_MAIL_PASSWORD=hddygbsicnmqvuun
TMDB_API_KEY=e01d0966ebcead42f3a3bec84c24b41d
RAZORPAY_KEY_ID=rzp_test_TJJY5Q4lsHDjQL
RAZORPAY_KEY_SECRET=wcoypHqN2jd0V23A5y3dweV8
FAST2SMS_API_KEY=gNDESxRv5IHj37KGeBFCdcuYXslOq4n8k1btUTVaM9frph6zLPlcdEiPUoNu5DxmJfXhpV8OegtBRkTS
```

---

## 🏗️ Architecture Diagram

```
+-------------------------------------------------------------------+
|                        Docker Network                             |
|                                                                   |
|   +-------------------+    /api/    +-------------------------+   |
|   | movieticket-      | ----------> | movieticket-backend     |   |
|   | frontend          |             | (Spring Boot 3, :8080)  |   |
|   | (Nginx, :80/5173) |             +-------------------------+   |
|   +-------------------+                          |                |
|                                                  | JDBC           |
|                                                  v                |
|                                     +-------------------------+   |
|                                     | movieticket-mysql       |   |
|                                     | (MySQL 8.0, :3306)      |   |
|                                     +-------------------------+   |
+-------------------------------------------------------------------+
```
