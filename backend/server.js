require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes         = require('./src/routes/authRoutes');
const internRoutes       = require('./src/routes/internRoutes');
const taskRoutes         = require('./src/routes/taskRoutes');
const attendanceRoutes   = require('./src/routes/attendanceRoutes');
const dashboardRoutes    = require('./src/routes/dashboardRoutes');
const internPortalRoutes = require('./src/routes/internPortalRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth',         authRoutes);
app.use('/api/interns',      internRoutes);
app.use('/api/tasks',        taskRoutes);
app.use('/api/attendance',   attendanceRoutes);
app.use('/api/dashboard',    dashboardRoutes);
app.use('/api/intern',       internPortalRoutes);  // intern-facing portal

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
