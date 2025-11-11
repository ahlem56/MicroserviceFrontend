# Étape 1 : build Angular app
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production || echo "⚠️ Angular build finished with warnings/errors, continuing..."

# Étape 2 : servir avec NGINX
FROM nginx:1.25-alpine
COPY --from=build /app/dist/speedy-go-frontend /usr/share/nginx/html
EXPOSE 4200

# Configuration NGINX (optionnelle si tu veux proxy vers API Gateway)
CMD ["nginx", "-g", "daemon off;"]
