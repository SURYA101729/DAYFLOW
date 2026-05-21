# DayFlow - Smart Day Scheduler

DayFlow is a premium full-stack productivity web application designed to help users structure their daily routines, track completion rate stats, request tailored AI coaching, and contact support.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Recharts, Axios, React Router, Canvas-Confetti, Html2pdf
- **Backend**: Java, Spring Boot, Spring Security (JWT), Hibernate JPA, Validation
- **Database**: MySQL
- **AI**: Claude Messages API (`claude-sonnet-4-20250514`)

---

## 🛠️ Installation & Setup

### 1. Database Setup
Create a new MySQL database named `dayflow_db`:
```sql
CREATE DATABASE dayflow_db;
```

### 2. Backend Configurations
1. Navigate to `/dayflow/backend`
2. Create or configure environment variables (or update `/src/main/resources/application.properties`):
   - `DB_USERNAME`: Database username (default: `root`)
   - `DB_PASSWORD`: Database password (default: `yourpassword`)
   - `JWT_SECRET`: A secure key at least 256-bits long
   - `CLAUDE_API_KEY`: Anthropic Claude API Key

3. Run the Spring Boot application (using Maven):
```bash
mvn clean spring-boot:run
```

### 3. Frontend Configurations
1. Navigate to `/dayflow/frontend`
2. Install npm dependencies:
```bash
npm install
```
3. Run the frontend development server:
```bash
npm run dev
```

The React dashboard will run locally at `http://localhost:5173`. In development mode, all `/api/*` request endpoints automatically proxy to `http://localhost:8080`.

---

## 🔒 Authentication & Role Security
- User registration and login return a secure JWT token stored in browser `localStorage`.
- Authorization headers are automatically appended via Axios request interceptors.
- Endpoints under `/api/support/admin` are restricted to the `ADMIN` role only.

---

## 💡 AI Advice Coaching
- Provide Strengths and Weaknesses input fields (min 10 characters).
- Responses are processed and formatted through Claude API, addressing stress management, кризис resolution, and strengths amplification.
- Daily usage is automatically capped at 10 AI queries per user.
