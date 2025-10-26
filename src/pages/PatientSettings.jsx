import { useEffect, useState } from "react";
import { useAuth } from "../contex/AuthContex";
import api from "../api/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function PatientSettings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  //   fetch API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/");
        setProfile(res.data?.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();

    setProfile({
      name: user?.name || "puff corn",
      email: user?.email || "puffcorn@example.com",
      phone: "01700000000",
    });
  }, [user]);

  // 🔹 Update profile
  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      console.log("Profile updated:", profile);
      Swal.fire({
        title: "Success!",
        text: "Your profile has been updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        title: "Failed",
        text: "could not update your profile. please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update password
  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      Swal.fire({
        title: "Faild!",
        text: "Password dose not match",
        icon: "error",
        confirmButtonText: "ok",
      });
      return;
    }
    try {
      await api.put("/patient/password", {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      console.log("Password change:", passwords);
      Swal.fire({
        title: "Success!",
        text: " Password update Successfully ",
        icon: "success",
        confirmButtonText: "OK",
      });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      Swal.fire({
        title: "Faild",
        text: "Could not update password. Please check your current password or try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // 🔹 Delete account
  const handleDeleteAccount = async () => {
    if (
      Swal.fire({
        title: "Are you sure you want to delete your account?",
      })
    ) {
      try {
        // await api.delete("/patient/delete");
        Swal.fire({
          title: "Account deleted successfully!",
          confirmButtonText: "OK",
        });
        logout();
        navigate("/");
      } catch (err) {
        Swal.fire({
          title: "Fail",
          text: "Failed to delete account!",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Patient Settings</h1>

      {/* Personal Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleProfileUpdate}
            disabled={loading}
            className="px-4 py-2 bg-blue-400 text-white rounded cursor-pointer"
          >
            {loading ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.current}
            onChange={(e) =>
              setPasswords({ ...passwords, current: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.new}
            onChange={(e) =>
              setPasswords({ ...passwords, new: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwords.confirm}
            onChange={(e) =>
              setPasswords({ ...passwords, confirm: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <motion.button
          whileTap={""}
            onClick={handlePasswordChange}
            className="px-4 py-2 bg-blue-400 text-white rounded"
          >
            Update Password
          </motion.button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-lg shadow-md">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer"
        >
          Delete Account
        </motion.button>
      </div>
    </div>
  );
}
