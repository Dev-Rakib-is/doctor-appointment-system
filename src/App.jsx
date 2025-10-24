import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contex/AuthContex";
import ProtectedRoute from "./component/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashbord";
import AdminDashboard from "./pages/AdminDashboard";
import RootLayout from "./layout/Rootlayout";
import MyAppointment from "./pages/MyAppointment";
import BookAppointment from "./pages/BookAppointment";
import AdminSettings from "./pages/AdminSettings";
import DoctorSettings from "./pages/DoctorSettings";
import PatientSettings from "./pages/PatientSettings";

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public Routes */}
      {/* ---------------------------------- */}
      {/* Patient setting  */}
      <Route
        path="/settings"
        element={
          <RootLayout>
            <PatientSettings />
          </RootLayout>
        }
      />
      <Route
        path="/"
        element={
          <RootLayout showSidebar={false}>
            <Home />
          </RootLayout>
        }
      />
      <Route
        path="/login"
        element={
          <RootLayout showSidebar={false}>
            <Login />
          </RootLayout>
        }
      />
      <Route
        path="/register"
        element={
          <RootLayout showSidebar={false}>
            <Register />
          </RootLayout>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute role="DOCTOR">
            <RootLayout showSidebar={true}>
              <DoctorDashboard />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute role="PATIENT">
            <RootLayout showSidebar={true}>
              <PatientDashboard />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <RootLayout showSidebar={true}>
              <AdminDashboard />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute role="PATIENT">
            <RootLayout showSidebar={true}>
              <MyAppointment />
            </RootLayout>
          </ProtectedRoute>
        }
      />

      {/* Book Appointment */}
      <Route
        path="/book-appointment"
        element={
          <ProtectedRoute role="PATIENT">
            <RootLayout showSidebar={true}>
              <BookAppointment />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-appointment/:doctorId"
        element={
          <ProtectedRoute role="PATIENT">
            <RootLayout showSidebar={true}>
              <BookAppointment />
            </RootLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
