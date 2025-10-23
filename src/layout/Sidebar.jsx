import { Link } from "react-router-dom";
import { useAuth } from "../contex/AuthContex";

const Sidebar = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <aside className="w-64 bg-white h-screen shadow-md flex flex-col">
        <Link to="/" className="border-b border-black/40 flex justify-center flex-col p-4">
          <h2 className="text-2xl font-bold text-pink-950">Doctor</h2>
          <span className="font-light">Appointment</span>
        </Link>
        <nav className="flex-1 p-4 space-y-3">
          <Link to="/" className="block px-4 py-2 rounded hover:bg-gray-200">
            Home
          </Link>
          <Link
            to="/login"
            className="block px-4 py-2 rounded hover:bg-gray-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block px-4 py-2 rounded hover:bg-gray-200"
          >
            Registration
          </Link>
        </nav>
      </aside>
    );
  }

  const dashboardRoute =
    user?.role === "ADMIN"
      ? "/admin/dashboard"
      : user?.role === "DOCTOR"
      ? "/doctor/dashboard"
      : "/patient/dashboard";

  return (
    <aside className="w-64 bg-white h-screen shadow-md flex flex-col">
      <Link to="/" className="border-b border-gray-300 p-4 text-center">
        <h2 className="text-2xl font-bold text-pink-950">Doctor</h2>
        <span className="text-gray-600">Appointment</span>
      </Link>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/"
          className="block px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Home
        </Link>

        <Link
          to={dashboardRoute}
          className="block px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Dashboard
        </Link>

        {user.role === "DOCTOR" && (
          <Link
            to="/doctor/chat"
            className="block px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            My Patients
          </Link>
        )}

        {user.role === "PATIENT" && (
          <Link
            to="/patient/appointments"
            className="block px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            My Appointments
          </Link>
        )}

        {user.role === "ADMIN" && (
          <Link
            to="/admin/manage-users"
            className="block px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Manage Users
          </Link>
        )}

        <Link
          to="/settings"
          className="block px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
