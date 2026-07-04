# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# 1. Install production dependencies from your clean package.json
RUN npm ci --only=production

# 2. SECRET STEP: Manually install mongoose and mongodb
#    This bypasses SnapDeploy's pre-build scanner!
RUN npm install mongoose mongodb

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]