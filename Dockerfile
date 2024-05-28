# Use Node.js 20-alpine as the base image for building
FROM node:20-alpine AS build

# Install necessary packages
RUN apk add --no-cache libc6-compat

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
FROM node:20-alpine

# Install necessary packages
RUN apk add --no-cache libc6-compat

# Set the working directory
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /app/ ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Expose the port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]

