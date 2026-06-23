import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar       from './components/common/Navbar';
import InternNavbar from './components/intern/InternNavbar';

import Login         from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard   from './pages/Dashboard';
import Interns     from './pages/Interns';
import InternDetail from './pages/InternDetail';
import Tasks       from './pages/Tasks';
import Attendance  from './pages/Attendance';
import Profile     from './pages/Profile';

import InternDashboard   from './pages/intern/InternDashboard';
import InternTasks       from './pages/intern/InternTasks';
import InternAttendance  from './pages/intern/InternAttendance';
import InternProfile     from './pages/intern/InternProfile';

/* ── Admin-only layout ── */
function AdminLayout() {
  const { token, role } = useAuth();
  if (!token)           return <Navigate to="/login" replace />;
  if (role === 'intern') return <Navigate to="/intern" replace />;
  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className="container-fluid py-4 px-4">
          <Outlet />
        </div>
      </main>
    </>
  );
}

/* ── Intern-only layout ── */
function InternLayout() {
  const { token, role } = useAuth();
  if (!token)           return <Navigate to="/login" replace />;
  if (role === 'admin') return <Navigate to="/" replace />;
  return (
    <>
      <InternNavbar />
      <main className="main-content">
        <div className="container-fluid py-4 px-4">
          <Outlet />
        </div>
      </main>
    </>
  );
}

/* ── Root redirect based on role ── */
function RootRedirect() {
  const { token, role } = useAuth();
  if (!token)            return <Navigate to="/login" replace />;
  if (role === 'intern') return <Navigate to="/intern" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"          element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin routes */}
          <Route element={<AdminLayout />}>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/interns"     element={<Interns />} />
            <Route path="/interns/:id" element={<InternDetail />} />
            <Route path="/tasks"       element={<Tasks />} />
            <Route path="/attendance"  element={<Attendance />} />
            <Route path="/profile"     element={<Profile />} />
          </Route>

          {/* Intern routes */}
          <Route path="/intern" element={<InternLayout />}>
            <Route index                  element={<InternDashboard />} />
            <Route path="tasks"           element={<InternTasks />} />
            <Route path="attendance"      element={<InternAttendance />} />
            <Route path="profile"         element={<InternProfile />} />
          </Route>

          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
