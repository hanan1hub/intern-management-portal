# Intern Management Portal

A full-stack web application for managing interns, tasks, and attendance — with separate portals for **Admins** and **Interns**.

---

## Features

### Admin Portal
- **Dashboard** — Live stats (total interns, tasks, completion rate, today's attendance), animated number counters, department breakdown chart
- **Intern Management** — Add, edit, delete interns with search and department filters; auto-generates login credentials and emails them via Resend
- **Task Management** — Assign tasks with optional deadline; mark complete; view intern submission notes
- **Attendance** — Mark Present / Absent / Late with optional notes per intern per day; date-filtered history
- **Profile** — Change username and password; new JWT issued on change

### Intern Portal
- **Dashboard** — Personalised welcome banner, task stats with animated counters, recent task list
- **My Tasks** — View assigned tasks; submit with an optional note; deadline colour coding (overdue / due today / future)
- **My Attendance** — Full history with Present / Absent / Late summary cards and attendance rate bar
- **My Profile** — Read-only account details

### Cross-cutting
- JWT authentication with role-based access (`admin` | `intern`), 8h token lifetime
- Credential email sent on intern creation (Resend API) + one-time on-screen backup modal with copy buttons
- Animated UI — page entrance slide-up, spring-pop stat cards, staggered table rows, modal slide-up, animated number counters
- Quick-action side panel (peek-and-expand on hover) for Add Intern / Assign Task / Attendance
- Fully responsive — Bootstrap 5 mobile navbar collapse handled in React (no Bootstrap JS bundle required)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 · Vite · React Router v6 · Bootstrap 5 (CSS only) |
| Backend | Node.js · Express.js |
| Database | PostgreSQL (Neon cloud, `@neondatabase/serverless` driver) |
| Auth | JSON Web Tokens (JWT) · bcryptjs |
| Email | Resend API |

---

## Project Structure

```
intern-management-portal/
│
├── backend/
│   ├── .env                             # Environment variables (not committed)
│   ├── .env.example                     # Template — copy to .env and fill in values
│   ├── server.js                        # Express app entry point, route registration
│   ├── package.json
│   │
│   ├── database/
│   │   ├── schema.sql                   # CREATE TABLE statements — run once in Neon SQL editor
│   │   ├── seed.js                      # Creates default admin account (admin / admin123)
│   │   ├── migrate.js                   # Migration 1: adds deadline column to tasks
│   │   └── migrate2.js                  # Migration 2: intern password_hash, task submission columns
│   │
│   └── src/
│       ├── config/
│       │   └── db.js                    # Neon serverless Pool + DATE OID type parser (fixes timezone bug)
│       │
│       ├── controllers/
│       │   ├── authController.js        # Admin login, intern login, get/update profile
│       │   ├── internController.js      # Admin CRUD for interns + auto-password generation + email trigger
│       │   ├── taskController.js        # Admin task CRUD (create with deadline, toggle status)
│       │   ├── attendanceController.js  # Mark attendance (upsert), list with filters
│       │   ├── dashboardController.js   # Aggregated stats query
│       │   └── internPortalController.js  # Intern-facing: my profile, my tasks, submit task, my attendance
│       │
│       ├── middleware/
│       │   ├── auth.js                  # Verifies JWT → populates req.user (and req.admin for compat)
│       │   ├── adminOnly.js             # Guards routes to role === 'admin'
│       │   ├── internOnly.js            # Guards routes to role === 'intern'
│       │   ├── validate.js              # express-validator result formatter
│       │   └── errorHandler.js          # Global Express error handler
│       │
│       ├── routes/
│       │   ├── authRoutes.js            # POST /login · POST /intern-login · GET /me · PUT /profile
│       │   ├── internRoutes.js          # Admin CRUD → /api/interns
│       │   ├── taskRoutes.js            # Admin CRUD → /api/tasks
│       │   ├── attendanceRoutes.js      # Admin → /api/attendance
│       │   ├── dashboardRoutes.js       # Admin → /api/dashboard/stats
│       │   └── internPortalRoutes.js    # Intern-only → /api/intern/*
│       │
│       ├── services/
│       │   └── emailService.js          # Resend API — sends branded HTML credential email to new intern
│       │
│       └── validators/
│           ├── internValidator.js       # express-validator rules for intern routes
│           ├── taskValidator.js         # Rules for task create/update (incl. optional deadline & submission_note)
│           └── attendanceValidator.js   # Rules for attendance marking
│
└── frontend/
    ├── index.html
    ├── vite.config.js                   # Dev proxy: /api → http://localhost:5000
    ├── package.json
    │
    └── src/
        ├── App.jsx                      # Route tree: AdminLayout / InternLayout / RootRedirect
        ├── main.jsx                     # React root, imports Bootstrap CSS + custom CSS
        │
        ├── context/
        │   └── AuthContext.jsx          # Stores token, username, role in localStorage; login/logout helpers
        │
        ├── api/
        │   ├── axiosInstance.js         # Axios instance — auto-attaches Bearer token, redirects on 401
        │   ├── authApi.js               # login(), internLogin(), getProfile(), updateProfile()
        │   ├── internsApi.js            # Admin: getAll, getOne, create, update, remove
        │   ├── tasksApi.js              # Admin: getAll, create, updateStatus
        │   ├── attendanceApi.js         # Admin: getAll, mark
        │   ├── dashboardApi.js          # Admin: getStats
        │   └── internPortalApi.js       # Intern: getMe, getMyTasks, submitTask, getMyAttendance
        │
        ├── hooks/
        │   ├── useInterns.js            # Fetches interns list; exposes addIntern, editIntern, deleteIntern
        │   ├── useTasks.js              # Fetches tasks; exposes addTask, toggleStatus
        │   ├── useAttendance.js         # Fetches attendance; exposes markAttendance
        │   └── useCountUp.js            # rAF-based animated number counter with ease-out cubic
        │
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx           # Admin navbar with React-controlled hamburger + profile dropdown
        │   │   ├── QuickActions.jsx     # Fixed left-side panel — peek 14px, expand to 182px on hover
        │   │   ├── CredentialsModal.jsx # One-time credentials display after intern creation (with copy buttons)
        │   │   ├── ConfirmModal.jsx     # Generic confirmation dialog (used for delete)
        │   │   ├── Loader.jsx           # Spinner with optional text
        │   │   └── ErrorAlert.jsx       # Error alert banner
        │   ├── intern/
        │   │   └── InternNavbar.jsx     # Intern portal navbar with Intern role badge + logout button
        │   ├── dashboard/
        │   │   └── StatsCard.jsx        # Animated stat card — uses useCountUp, accepts stagger delay prop
        │   ├── interns/
        │   │   ├── InternForm.jsx       # Add / edit intern modal (with timezone-safe date parsing)
        │   │   └── InternFilters.jsx    # Search input + department dropdown
        │   ├── tasks/
        │   │   ├── TaskForm.jsx         # Assign task modal (intern select, title, description, deadline)
        │   │   ├── TaskItem.jsx         # Task card — deadline badge, submission note display
        │   │   └── TaskList.jsx         # Maps tasks to TaskItem, handles loading/empty states
        │   └── attendance/
        │       ├── AttendanceForm.jsx   # Mark attendance form (intern, date, status, notes)
        │       └── AttendanceTable.jsx  # Attendance records table
        │
        ├── pages/
        │   ├── Login.jsx                # Dual-tab login: Admin (username) / Intern (email)
        │   │
        │   │   ── Admin pages ──
        │   ├── Dashboard.jsx            # Stats, dept chart, today's attendance, task completion rate
        │   ├── Interns.jsx              # Intern list with search/filter, edit/delete actions
        │   ├── InternDetail.jsx         # Single intern — tasks + attendance history
        │   ├── Tasks.jsx                # Task list with status/intern filters
        │   ├── Attendance.jsx           # Mark attendance + date-filtered table
        │   ├── Profile.jsx              # Update username and password
        │   │
        │   └── intern/                  ── Intern pages ──
        │       ├── InternDashboard.jsx  # Welcome banner, stat cards, recent tasks
        │       ├── InternTasks.jsx      # Task list + Submit button + submission note modal
        │       ├── InternAttendance.jsx # Summary cards, rate bar, full history table
        │       └── InternProfile.jsx    # Read-only profile info
        │
        ├── utils/
        │   ├── helpers.js               # formatDate, extractError, statusBadgeClass, today()
        │   └── validators.js            # Client-side form validators
        │
        └── styles/
            └── custom.css               # Design system (CSS variables), all keyframe animations
```

---

## Database Schema

```sql
admins (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
)

interns (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  department    VARCHAR(100) NOT NULL,
  joining_date  DATE NOT NULL,
  password_hash VARCHAR(255),          -- set on creation, used for intern login
  created_at    TIMESTAMPTZ DEFAULT NOW()
)

tasks (
  id              SERIAL PRIMARY KEY,
  intern_id       INTEGER REFERENCES interns(id) ON DELETE CASCADE,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','completed')),
  deadline        TIMESTAMPTZ,
  submission_note TEXT,                -- written by intern on submission
  submitted_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
)

attendance (
  id         SERIAL PRIMARY KEY,
  intern_id  INTEGER REFERENCES interns(id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  status     VARCHAR(20) NOT NULL CHECK (status IN ('present','absent','late')),
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (intern_id, date)             -- one record per intern per day (upsert)
)
```

---

## API Reference

### Auth — `/api/auth`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | Admin login — `{ username, password }` → `{ token, username, role }` |
| POST | `/intern-login` | Public | Intern login — `{ email, password }` → `{ token, name, email, role }` |
| GET | `/me` | Admin JWT | Get admin profile |
| PUT | `/profile` | Admin JWT | Update username and/or password |

### Interns — `/api/interns` *(Admin JWT required)*
| Method | Path | Description |
|---|---|---|
| GET | `/` | List interns — query: `search`, `department` |
| GET | `/:id` | Get single intern |
| POST | `/` | Create intern → auto-password + email → returns `generatedPassword` once |
| PUT | `/:id` | Update intern details |
| DELETE | `/:id` | Delete intern (cascades tasks + attendance) |

### Tasks — `/api/tasks` *(Admin JWT required)*
| Method | Path | Description |
|---|---|---|
| GET | `/` | List tasks — query: `intern_id`, `status` |
| POST | `/` | Create task — body: `intern_id, title, description?, deadline?` |
| PUT | `/:id` | Update task status — body: `{ status }` |

### Attendance — `/api/attendance` *(Admin JWT required)*
| Method | Path | Description |
|---|---|---|
| GET | `/` | List records — query: `intern_id`, `date` |
| POST | `/` | Mark attendance — upserts on `(intern_id, date)` |

### Dashboard — `/api/dashboard` *(Admin JWT required)*
| Method | Path | Description |
|---|---|---|
| GET | `/stats` | Returns totalInterns, totalTasks, completedTasks, pendingTasks, internsByDepartment, todayAttendance |

### Intern Portal — `/api/intern` *(Intern JWT required)*
| Method | Path | Description |
|---|---|---|
| GET | `/me` | Own profile |
| GET | `/tasks` | Own tasks list |
| PUT | `/tasks/:id/submit` | Submit task — body: `{ submission_note? }` |
| GET | `/attendance` | Own attendance history |

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (free tier works)
- A [Resend](https://resend.com) account (free — 3000 emails/month)

### 1. Clone

```bash
git clone https://github.com/hanan1hub/intern-management-portal.git
cd intern-management-portal
```

### 2. Install dependencies

```bash
cd backend  && npm install
cd ../frontend && npm install
```

### 3. Configure environment

Create `backend/.env`:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
JWT_SECRET=replace_with_a_long_random_string
PORT=5000
CLIENT_URL=http://localhost:5173

# Resend — get key at resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM=Intern Portal <onboarding@resend.dev>
```

> For production email, verify your domain at resend.com/domains and change `RESEND_FROM` to `no-reply@yourdomain.com`.

### 4. Initialise the database

Run `backend/database/schema.sql` in your **Neon SQL Editor** (copy-paste the file contents).

Then from the terminal:

```bash
cd backend
npm run seed          # creates admin (username: admin, password: admin123)
npm run migrate       # adds deadline column to tasks
node database/migrate2.js  # adds intern password_hash + task submission columns
```

### 5. Run locally

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

## Default Login

| Role | Credential | Value |
|---|---|---|
| Admin | Username | `admin` |
| Admin | Password | `admin123` |
| Intern | Email | *(the email entered by admin when adding the intern)* |
| Intern | Password | *(auto-generated format: `FirstName@XXXX` — emailed on creation)* |

> **Change the admin password immediately** — Profile → Change Password.

---

## How Intern Login Works

1. Admin adds an intern (name, email, department, joining date)
2. System generates a password: `FirstName@XXXX` (e.g. `Sara@7312`)
3. Password is bcrypt-hashed and stored against the intern record
4. A **styled HTML email** is sent to the intern via Resend
5. A **Credentials Modal** pops up for the admin — shows email + password with copy buttons (one-time backup in case email is delayed)
6. Intern goes to `/login` → clicks **Intern** tab → signs in with email + password
7. They land on their own private portal (`/intern/*`) — completely separate from admin

---

## Deployment

### Backend (Render / Railway)
1. Connect your GitHub repo
2. Set all env vars from `backend/.env` in the dashboard
3. Build: `npm install` | Start: `node server.js`
4. Set `CLIENT_URL` to your live frontend URL

### Frontend (Vercel)
1. Import the repo, set root to `frontend/`
2. Add env var: `VITE_API_URL=https://your-backend.onrender.com/api`
3. Build: `npm run build` | Output: `dist`

---

## License

MIT
