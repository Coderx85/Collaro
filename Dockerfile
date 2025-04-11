FROM node:slim

# Create app directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./

# Clean install for production
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]