# Intern Management Portal

A full-stack web application for managing interns, tasks, and attendance.

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite, Bootstrap 5, Axios      |
| Backend   | Node.js, Express.js                     |
| Database  | PostgreSQL (Neon cloud)                 |
| Auth      | JWT (jsonwebtoken) + bcryptjs           |

---

## Project Structure

```
intern-management-portal/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── routes/         # Express routers
│   │   └── validators/     # express-validator rules
│   ├── database/
│   │   ├── schema.sql      # DB schema
│   │   └── seed.js         # Admin account seeder
│   └── server.js
└── frontend/
    └── src/
        ├── api/            # Axios API calls
        ├── components/     # Reusable UI components
        ├── context/        # AuthContext (JWT)
        ├── hooks/          # Custom React hooks
        ├── pages/          # Page-level components
        ├── styles/         # Custom CSS
        └── utils/          # Validators & helpers
```

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/hanan1hub/intern-management-portal.git
cd intern-management-portal
```

### 2. Set up the Database
1. Create a free PostgreSQL database at [neon.tech](https://neon.tech)
2. Copy your connection string
3. Run the schema in Neon's SQL editor:
   ```
   Copy contents of backend/database/schema.sql and run it
   ```

### 3. Configure Backend
```bash
cd backend
cp .env.example .env
```
Edit `.env`:
```
DATABASE_URL=your_neon_connection_string
JWT_SECRET=any_random_secret_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 4. Install & seed Backend
```bash
npm install
npm run seed        # Creates admin account (admin / admin123)
npm run dev         # Starts on http://localhost:5000
```

### 5. Configure Frontend
```bash
cd ../frontend
cp .env.example .env
```
`.env` is already configured for local dev — no changes needed.

### 6. Install & run Frontend
```bash
npm install
npm run dev         # Starts on http://localhost:5173
```

### 7. Login
Open [http://localhost:5173/login](http://localhost:5173/login)  
Credentials: **admin / admin123**

---

## API Endpoints

All endpoints except `/api/auth/login` require `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint          | Description     |
|--------|-------------------|-----------------|
| POST   | /api/auth/login   | Admin login      |

### Interns
| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| GET    | /api/interns         | Get all (search, filter) |
| GET    | /api/interns/:id     | Get single intern        |
| POST   | /api/interns         | Create intern            |
| PUT    | /api/interns/:id     | Update intern            |
| DELETE | /api/interns/:id     | Delete intern            |

### Tasks
| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | /api/tasks       | Get all (filter by status/intern) |
| POST   | /api/tasks       | Create task              |
| PUT    | /api/tasks/:id   | Update task status       |

### Attendance
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | /api/attendance     | Get records (filter)     |
| POST   | /api/attendance     | Mark attendance (upsert) |

### Dashboard
| Method | Endpoint               | Description        |
|--------|------------------------|--------------------|
| GET    | /api/dashboard/stats   | Aggregated stats   |

---

## Features

- JWT Authentication (login/logout)
- View, Add, Edit, Delete interns
- Assign tasks to interns & mark complete
- Mark attendance (Present / Absent / Late)
- Search interns by name
- Filter interns by department
- Filter tasks by status and intern
- Dashboard with stats and department breakdown
- Fully responsive Bootstrap 5 UI
- Frontend + backend validation
- Duplicate email prevention
- Loading states and error handling

---

*Built for Internship Assessment — Web Development*
