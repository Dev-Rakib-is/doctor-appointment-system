import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contex/AuthContex";

const Sidebar = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <aside className="w-64 bg-white dark:bg-black/80 dark:text-white h-screen shadow-md flex flex-col">
        <Link to="/" className="border-b border-black/40 dark:border-white/60 flex justify-center flex-col p-4">
          <h2 className="text-2xl font-bold text-pink-950 dark:text-pink-600">Doctor</h2>
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
        <div className="text-center mb-2 font-light">
          <p>Emergency Contact:</p>
          <a href="tel:+8801796478185">+8801796478185</a>
        </div>
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
    <aside className="w-64 bg-white dark:bg-black/90 text-black dark:text-white h-screen shadow-md flex flex-col">
      <Link to="/" className="border-b border-gray-300 p-4 text-center">
        <h2 className="text-2xl font-bold text-pink-950 dark:text-pink-600">Doctor</h2>
        <span className="text-gray-600 dark:text-white/80">Appointment</span>
      </Link>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/"
          className={({isActive})=>isActive?"bg-green-600 text-white block rounded px-4 py-2":"block px-4 py-2 rounded hover:bg-gray-200 transition"}
        >
          Home
        </NavLink>

        <NavLink
          to={dashboardRoute}
          className={({isActive})=>isActive?"bg-green-600 text-white block rounded px-4 py-2":"block px-4 py-2 rounded hover:bg-gray-200 transition"}
        >
          Dashboard
        </NavLink>

        {user.role === "DOCTOR" && (
          <NavLink
            to="/mypatient"
            className={({isActive})=>isActive?"bg-green-600 text-white block rounded px-4 py-2":"block px-4 py-2 rounded hover:bg-gray-200 transition"}
          >
            My Patients
          </NavLink>
        )}

        {user.role === "PATIENT" && (
          <NavLink
            to="/patient/appointments"
            className={({isActive})=>isActive?"bg-green-600 text-white px-4 py-2 block rounded":"block px-4 py-2 rounded hover:bg-gray-200 transition"}
          >
            My Appointments
          </NavLink>
        )}

        {user.role === "ADMIN" && (
          <NavLink
            to="/admin/manage-users"
            className={({isActive})=>isActive?"bg-green-600 text-white rounded px-4 py-2":"block px-4 py-2 rounded hover:bg-gray-200 transition"}
          >
            Manage Users
          </NavLink>
        )}

        <NavLink
          to="/settings"
          className={({isActive})=>isActive?"bg-green-600 text-white block rounded px-4 py-2":"block px-4 py-2 rounded hover:bg-gray-200 transition"}
        >
          Settings
        </NavLink>
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
