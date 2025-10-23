import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Swal from "sweetalert2";

export default function Register() {
  const [tab, setTab] = useState("PATIENT");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //  name
    if (!name) {
      Swal.fire({
        icon: "warning",
        title: "Missing Name!",
        text: "Please enter your full name.",
      });
      return;
    }
    // Email
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Missing Email!",
        text: "Please enter your email address.",
      });
      return;
    }

    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email!",
        text: "Please enter a valid email format.",
      });
      return;
    }
    // Password
    if (!password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Password!",
        text: "Please enter your password.",
      });
      return;
    }
    // specialization
    if (tab === "DOCTOR" && !specialization) {
      Swal.fire({
        icon: "warning",
        title: "Missing Specialization!",
        text: "Please enter your medical specialization.",
      });
      return;
    }

    //  Registration 
    setLoading(true);
    try {
      const endpoint =
        tab === "PATIENT" ? "/auth/register/patient" : "/auth/register/doctor";

      await api.post(endpoint, {
        name,
        email,
        password,
        ...(tab === "DOCTOR" ? { specialization } : {}),
        photo_url: photoUrl || undefined,
      });

      //  Success notification
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your account has been created. Please login now.",
        confirmButtonText: "Go to Login",
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "Registration Failed!",
        text: err.response?.data?.message || "Something went wrong. Try again!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              tab === "PATIENT" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTab("PATIENT")}
          >
            Patient
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              tab === "DOCTOR" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTab("DOCTOR")}
          >
            Doctor
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {tab === "DOCTOR" && (
            <select
              className="w-full border p-2 rounded-md"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}>
              <option value="">Select Specialization</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dentist">Dentist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Psychiatrist">Psychiatrist</option>
              <option value="Radiologist">Radiologist</option>
              <option value="Surgeon">Surgeon</option>
              <option value="General Physician">General Physician</option>
            </select>
          )}

          <input
            type="text"
            placeholder="Photo URL (optional)"
            className="w-full border p-2 rounded-md"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
        </div>

        <button
          onClick={handleRegister}
          className="mt-6 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
