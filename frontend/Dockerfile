# --- Build Phase ---
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Nginx Serve Phase ---
FROM nginx:alpine

# Entferne Standard-Nginx-Inhalte
RUN rm -rf /usr/share/nginx/html/*

# Kopiere gebaute App
COPY --from=builder /app/dist /usr/share/nginx/html

# Eigene default.conf für React Router
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
