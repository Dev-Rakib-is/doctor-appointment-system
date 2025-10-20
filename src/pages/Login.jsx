import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../contex/AuthContex";
import { motion } from "motion/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PATIENT");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password, role });
      const { token, user } = res.data;

      login(
  {
    name: user.name,       
    email: user.email,    
    role: user.role || role,
  },
  token
);

      if (role === "PATIENT") navigate("/patient/dashboard");
      else if (role === "DOCTOR") navigate("/doctor/dashboard");
      else if (role === "ADMIN") navigate("/admin/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="flex flex-col bg-white shadow-lg p-6 rounded-xl w-80 mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-2 rounded-md"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-2 rounded-md"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="border p-2 mb-3 rounded-md"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="PATIENT">Patient</option>
        <option value="DOCTOR">Doctor</option>
        <option value="ADMIN">Admin</option>
      </select>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleLogin}
        className="bg-blue-600 text-white py-2 rounded-md cursor-pointer">
        Login
      </motion.button>
    </div>
  );
}
