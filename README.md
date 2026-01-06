# Job Scheduler System

A full-stack Job Scheduler application built as part of the **Dotix Full Stack Developer Assignment**.  
The system allows users to create background jobs, execute them asynchronously, track their status, and trigger a webhook upon completion.

---

## 🚀 Features

### ✅ Job Management
- Create jobs with:
  - Task Name
  - Priority (Low / Medium / High)
  - Payload (JSON or plain text like email)
- Jobs are initially created with **pending** status

### ✅ Job Execution
- Run a job manually from the dashboard
- Job lifecycle:
  1. `pending`
  2. `running` (for 3 seconds)
  3. `completed`
- Status updates automatically on the UI

### ✅ Webhook Trigger
- On job completion, a webhook is triggered with the following payload:
```json
{
  "jobId": 1,
  "taskName": "Example Job",
  "priority": "High",
  "payload": { "email": "test@example.com" },
  "completedAt": "2026-01-06T20:40:00.000Z"
}
✅ Dashboard UI

View all jobs in a table

See job status with visual badges

Run pending jobs

Clean and professional UI

🛠️ Tech Stack
Frontend

React (Vite)

Tailwind CSS (CDN based styling)

Fetch API

Backend

Node.js

Express.js

SQLite (for persistence)

Axios (for webhook calls)

📁 Project Structure
job-scheduler-system/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── jobs.controller.js
│   │   ├── routes/
│   │   │   └── jobs.routes.js
│   │   ├── db/
│   │   │   ├── db.js
│   │   │   └── schema.sql
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone <repository-url>
cd job-scheduler-system

2️⃣ Backend Setup
cd backend
npm install


Create a .env file:

WEBHOOK_URL=https://example.com/webhook


Start the backend:

npm start


Expected output:

SQLite connected
Database schema ready
Backend running on port 5000

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Open in browser:

http://localhost:5173

🔌 API Endpoints
Create Job
POST /api/jobs

Get All Jobs
GET /api/jobs

Get Job by ID
GET /api/jobs/:id

Run Job
POST /api/run-job/:id