# 🚀 DayFlow Deployment Guide

This guide details two options for deploying the DayFlow Smart Scheduler application.

---

## 📦 Option A: Single-JAR Monolithic Deployment (Recommended & Easiest)
In this approach, we bundle the built React frontend directly into the Spring Boot backend. Spring Boot will serve the static frontend assets, resulting in a single executable `.jar` file that runs both services.

### Step 1: Copy Frontend Assets to Backend
Build your React frontend and copy the output contents of `/dayflow/frontend/dist` to the Spring Boot resources static folder `/dayflow/backend/src/main/resources/static`:

1. Build the frontend:
   ```bash
   cd dayflow/frontend
   npm run build
   ```
2. Create the target folder in the backend if it doesn't exist:
   ```bash
   mkdir ../backend/src/main/resources/static
   ```
3. Copy all files from `frontend/dist/*` to `backend/src/main/resources/static/`.

### Step 2: Build the Backend Fat-JAR
Navigate to your backend directory and package the Spring Boot application using Maven:
```bash
cd ../backend
mvn clean package -DskipTests
```
*This generates a file named `dayflow-0.0.1-SNAPSHOT.jar` inside the `target/` directory.*

### Step 3: Run Anywhere
You can run this single JAR file on any server with Java 17+ installed (e.g., VPS, AWS EC2, Heroku, Render):
```bash
java -jar target/dayflow-0.0.1-SNAPSHOT.jar
```
*Note: Make sure to set the environment variables (`DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `CLAUDE_API_KEY`) on the hosting server.*

---

## 🌐 Option B: Decoupled Deployment (Scalable)
In this approach, the React frontend and Spring Boot backend are hosted on separate servers, and communicate via REST APIs.

### 1. Database Hosting
Deploy a MySQL database on one of the following managed services:
- **Railway** (Has built-in MySQL provisioner)
- **Aiven** / **Tidb Cloud**
- **AWS RDS** (Relational Database Service)
- **Render MySQL**

*Keep the database connection URL (e.g., `jdbc:mysql://<host>:<port>/dayflow_db`) handy.*

### 2. Backend Hosting (API)
Deploy the Spring Boot app on services like **Render**, **Railway**, or **AWS App Runner**:
- Set the deployment start command to: `java -jar target/dayflow-0.0.1-SNAPSHOT.jar` (or configure a Dockerfile if needed).
- Define the following Environment Variables in the hosting dashboard:
  - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<your_database_host>:<port>/dayflow_db`
  - `DB_USERNAME`: Your production DB user
  - `DB_PASSWORD`: Your production DB password
  - `JWT_SECRET`: A secure random secret key (minimum 256 bits)
  - `CLAUDE_API_KEY`: Your Anthropic API Key
  - `CORS_ORIGINS`: The domain name where your frontend is hosted (e.g., `https://yourdayflow.vercel.app`)

### 3. Frontend Hosting
Deploy the React folder `/dayflow/frontend` to **Vercel**, **Netlify**, or **GitHub Pages**:
- First, modify `dayflow/frontend/src/services/api.js` to point Axios `baseURL` to your deployed backend API URL (e.g., `https://dayflow-backend-api.onrender.com`).
- Build command: `npm run build`
- Output directory: `dist`
