# --- Base Node image ---
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json & package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app files
COPY . .

# Expose backend port
EXPOSE 4000

# Start server
CMD ["node", "server.js"]
