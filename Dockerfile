# Use Node.js 20 as the base image for building
FROM node:20 AS build

# Install OpenSSL
RUN apt-get update && apt-get install -y openssl

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml files to install dependencies
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Migrate DB
RUN npm run db:migrate

# Build the Next.js application
RUN pnpm run build

# Use a slim base image for the production build
FROM node:20-slim

# Install OpenSSL
RUN apt-get update && apt-get install -y openssl

# Set the working directory
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /app/ ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Expose the port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
