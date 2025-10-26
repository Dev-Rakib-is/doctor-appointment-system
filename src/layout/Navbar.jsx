import { Link } from "react-router-dom";
import { useAuth } from "../contex/AuthContex";
import Darkmode from "../component/ui/Darkmode";

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
    <div className="flex justify-between items-center py-3 bg-gray-200 dark:bg-black text-black dark:text-white px-8 border-b border-black/20 dark:border-white/40">
      <div>
        <Link to="/" className="text-bold text-black dark:text-white text-lg ">
          {displayName}
        </Link>
        <p className="text-black/60 dark:text-white/80 text-sm font-light">
          {user?.role}
        </p>
      </div>
      <div className="flex items-center gap-8">
        {user && (
          <div className="text-center dark:te">
            <p>Emergency Contact :</p>
            <p>+8801796478185</p>
          </div>
        )}
        <Darkmode />
      </div>
    </div>
  );
};

export default Navbar;
