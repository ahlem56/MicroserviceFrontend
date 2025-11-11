# Multi-stage build for Angular app (build with Node, serve with Nginx)

# -----------------------------
# 1) Build stage
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy the rest of the app and build
COPY . .

# Build in production mode (Angular v19 application builder)
RUN npm run build


# -----------------------------
# 2) Runtime stage
# -----------------------------
FROM nginx:alpine AS runtime

# Nginx config for SPA routing and gzip/static headers
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled app (Angular application builder outputs to browser/)
COPY --from=builder /app/dist/speedy-go-frontend/browser/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


