# Stage 1: Base Node image for development
FROM node:20.17.0 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Install Angular CLI
RUN npm install -g @angular/cli --force

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Expose port 4200 for Angular CLI
EXPOSE 4200

# Development command to run Angular CLI for hot reloading
CMD ["ng", "serve","--poll","2000", "--host", "0.0.0.0", "--disable-host-check"]