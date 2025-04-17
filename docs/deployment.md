# Deployment Guide

This guide provides instructions for deploying the Task Management System in different environments.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (v12 or higher)
- Git

## Local Development Deployment

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/f3mi/DTS-developer-challenge.git
   cd dts-developer-challenge
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with your database credentials and JWT secret
   ```

4. Run database migrations and seeders:
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The backend should now be running at `http://localhost:3000`.

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Set VITE_API_URL to point to your backend (default: http://localhost:3000/api)
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend should now be running at `http://localhost:5173`.

## Production Deployment

### Backend Production Setup

1. Set production environment variables:
   ```bash
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=your_secure_jwt_secret
   DB_HOST=your_db_host
   DB_PORT=5432
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   ```

2. Build the backend (if applicable):
   ```bash
   npm run build
   ```

3. Start the production server:
   ```bash
   npm start
   ```

### Frontend Production Build

1. Set production environment variables:
   ```bash
   VITE_API_URL=https://your-api-domain.com/api
   ```

2. Build the frontend:
   ```bash
   npm run build
   ```

3. The build output will be in the `dist` directory, which can be deployed to any static web hosting service.

## Deployment Options

### Option 1: Traditional Server Deployment

#### Backend

1. Set up a Node.js environment on your server
2. Install PM2 for process management:
   ```bash
   npm install -g pm2
   ```
3. Deploy your code to the server
4. Configure environment variables
5. Start the application with PM2:
   ```bash
   pm2 start server.js --name task-management-api
   ```

#### Frontend

1. Build the frontend as described above
2. Deploy the `dist` directory to a web server (Apache, Nginx, etc.)
3. Configure the web server to serve the static files and handle SPA routing

### Option 2: Docker Deployment

This project can be containerized using Docker for easier deployment.

1. Backend Dockerfile:
   ```dockerfile
   FROM node:14-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. Frontend Dockerfile:
   ```dockerfile
   FROM node:14-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. Docker Compose:
   ```yaml
   version: '3'
   services:
     backend:
       build: ./backend
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - PORT=3000
         - JWT_SECRET=your_secret
         - DB_HOST=db
         - DB_PORT=5432
         - DB_NAME=task_management
         - DB_USER=postgres
         - DB_PASSWORD=your_password
       depends_on:
         - db
     
     frontend:
       build: ./frontend
       ports:
         - "80:80"
       depends_on:
         - backend
     
     db:
       image: postgres:12
       ports:
         - "5432:5432"
       environment:
         - POSTGRES_DB=task_management
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=your_password
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

4. Start the containers:
   ```bash
   docker-compose up -d
   ```

### Option 3: Cloud Platform Deployment

#### Heroku Deployment

1. Create a `Procfile` in the root directory:
   ```
   web: cd backend && npm start
   ```

2. Create a `package.json` in the root directory with Heroku build scripts:
   ```json
   {
     "name": "task-management-system",
     "version": "1.0.0",
     "engines": {
       "node": "14.x"
     },
     "scripts": {
       "start": "cd backend && npm start",
       "heroku-postbuild": "cd backend && npm install && cd ../frontend && npm install && npm run build"
     }
   }
   ```

3. Deploy to Heroku:
   ```bash
   heroku create
   heroku addons:create heroku-postgresql:hobby-dev
   git push heroku main
   ```

#### AWS Deployment

1. Backend: Deploy to AWS Elastic Beanstalk or EC2
2. Frontend: Deploy to S3 with CloudFront for CDN
3. Database: Use RDS for PostgreSQL

## Database Migrations in Production

When updating the database schema in production:

1. Create a new migration:
   ```bash
   npx sequelize-cli migration:generate --name migration-name
   ```

2. Edit the migration file with the required changes

3. Run the migration on the production database:
   ```bash
   NODE_ENV=production npx sequelize-cli db:migrate
   ```

## SSL Configuration

For production deployments, always configure SSL:

1. Obtain an SSL certificate (Let's Encrypt, commercial provider, etc.)
2. Configure your web server to use HTTPS
3. Update the frontend API URL to use https://

## Monitoring and Logging

1. Set up application monitoring using PM2, New Relic, or similar tools
2. Configure centralized logging with tools like ELK Stack or Papertrail
3. Set up database monitoring and regular backups 