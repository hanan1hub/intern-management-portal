import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Interns from './pages/Interns';
import InternDetail from './pages/InternDetail';
import Tasks from './pages/Tasks';
import Attendance from './pages/Attendance';

function ProtectedLayout() {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/interns"     element={<Interns />} />
            <Route path="/interns/:id" element={<InternDetail />} />
            <Route path="/tasks"       element={<Tasks />} />
            <Route path="/attendance"  element={<Attendance />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
