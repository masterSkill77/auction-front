FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

COPY . .

EXPOSE 5173

# Serveur de développement : le code est monté depuis l'hôte (voir docker-compose.yml)
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]
