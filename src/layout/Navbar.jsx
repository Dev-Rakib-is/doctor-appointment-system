import { Link } from "react-router-dom";
import { useAuth } from "../contex/AuthContex";

const Navbar = () => {
  const { user } = useAuth();
  const displayName =
    user?.profile?.name ||
    user?.name ||
    (user?.role === "ADMIN"
      ? "Admin"
      : user?.role === "DOCTOR"
      ? "Doctor"
      : user?.role === "PATIENT"
      ? "Patient"
      : "Guest");
  return (
    <div>
      <div className="flex justify-between py-3 bg-gray-200 px-8 border-b border-black/20">
        <div>
          <Link to="/settings" className="text-bold text-gray-900 text-lg">{displayName}</Link>
          <p className="text-black/60 text-sm font-light">{user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
