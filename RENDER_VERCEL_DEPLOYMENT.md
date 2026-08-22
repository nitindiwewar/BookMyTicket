# Complete Cloud Deployment Guide (Render + Vercel / Railway)

Follow this step-by-step guide to deploy your **Movie Ticket Booking Application** online for free.

---

## 📌 Phase 1: Create Free Managed MySQL Database

1. Sign up at [Aiven.io](https://aiven.io) or [Railway.app](https://railway.app).
2. Create a **MySQL Service** (Free tier).
3. Once created, copy the database connection details:
   - **Host**: `e.g. mysql-xxxxx.aivencloud.com`
   - **Port**: `e.g. 12345`
   - **Database Name**: `defaultdb` or `movieticket`
   - **User**: `avnadmin` or `root`
   - **Password**: `<YOUR_DB_PASSWORD>`

---

## 📌 Phase 2: Deploy Backend to Render.com

1. Push your code to a **GitHub repository**.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + -> Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service:
   - **Name**: `movie-ticket-backend`
   - **Root Directory**: `backend`
   - **Runtime / Environment**: `Docker`
   - **Instance Type**: `Free`
5. Add **Environment Variables** under Environment tab:

   > ⚠️ **Important:** Do NOT type `${...}` in Render's Value box. Put your actual configuration and credentials directly.

   | Key | Example Value | Description |
   | :--- | :--- | :--- |
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://mysql-xxxx.aivencloud.com:12345/defaultdb?useSSL=true` | Remote MySQL JDBC Connection URL |
   | `SPRING_DATASOURCE_USERNAME` | `avnadmin` | MySQL username |
   | `SPRING_DATASOURCE_PASSWORD` | `your_db_password` | MySQL password |
   | `SPRING_MAIL_HOST` | `smtp.gmail.com` | SMTP Host (Default: smtp.gmail.com) |
   | `SPRING_MAIL_PORT` | `587` | SMTP Port (Default: 587) |
   | `SPRING_MAIL_USERNAME` | `your_email@gmail.com` | Gmail sender address |
   | `SPRING_MAIL_PASSWORD` | `your_16_char_app_password` | Gmail App Password |
   | `APP_JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | 256-bit JWT secret token |
   | `APP_CORS_ALLOWED_ORIGINS` | `https://movie-ticket-app.vercel.app,http://localhost:5173` | Allowed frontend domains for CORS |
   | `TMDB_API_KEY` | `e01d0966ebcead42f3a3bec84c24b41d` | TMDB API Key for movie catalog & posters |
   | `RAZORPAY_KEY_ID` | `rzp_test_TJJY5Q4lsHDjQL` | Razorpay Key ID |
   | `RAZORPAY_KEY_SECRET` | `wcoypHqN2jd0V23A5y3dweV8` | Razorpay Key Secret |
   | `FAST2SMS_API_KEY` | `your_fast2sms_api_key` | Fast2SMS API Key for OTP SMS (Optional) |
   | `TWILIO_ACCOUNT_SID` | `your_twilio_sid` | Twilio Account SID (Optional) |
   | `TWILIO_AUTH_TOKEN` | `your_twilio_token` | Twilio Auth Token (Optional) |
   | `TWILIO_FROM_NUMBER` | `+1234567890` | Twilio Sender Number (Optional) |

6. Click **Create Web Service** (or **Manual Deploy -> Deploy latest commit**). Render will build and deploy your backend:
   `https://movie-ticket-backend.onrender.com`

---

## 📌 Phase 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New -> Project**.
2. Import your GitHub repository.
3. Configure Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables** under Environment Variables tab:

   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://movie-ticket-backend.onrender.com` | Deployed backend URL |
   | `VITE_GOOGLE_MAPS_API_KEY` | `AIzaSy...` | (Optional) Google Maps API Key for location picker |
   | `VITE_GOOGLE_CLIENT_ID` | `88373...apps.googleusercontent.com` | (Optional) Google OAuth Client ID |

5. Click **Deploy**. Vercel will build and deploy your React frontend:
   `https://movie-ticket-app.vercel.app`

---

## 🎉 Done! Your App is Live Worldwide

- **Public Website**: `https://movie-ticket-app.vercel.app`
- **Admin Panel**: Navigate to `/admin` and log in with `admin@movieticket.com` / `admin123`.
