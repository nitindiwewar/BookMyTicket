# =========================================================
# Stage 1: Build React + Vite App with Node.js
# =========================================================
FROM node:20-alpine AS build
WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build

# =========================================================
# Stage 2: Serve Production SPA with Nginx
# =========================================================
FROM nginx:alpine

# Copy built production assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx SPA routing configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
