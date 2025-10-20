"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contex/AuthContex";
import api from "../api/api";

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today"); // today/upcoming/all

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/doctor/appointments?filter=${filter}`);
        setAppointments(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [filter]);

  // Handle appointment actions
  const handleAction = async (id, action) => {
    try {
      await api.patch(`/appointments/${id}`, { status: action });
      // Update UI locally
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status: action } : appt
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (!user)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">Loading...</p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100"
    >
      {/* Header */}
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">Doctor Dashboard</h1>
      </header>

      <main className="max-w-6xl mx-auto p-10">
        {/* Doctor Profile */}
        <div className="bg-white shadow-lg rounded-xl p-8 text-center mb-10">
          <img
            src={user?.profile?.photo_url || "/default-doctor.png"}
            alt="Doctor"
            className="w-28 h-28 mx-auto rounded-full mb-4 object-cover"
          />
          <h2 className="text-xl font-semibold">{user?.profile?.name}</h2>
          <p className="text-gray-600">{user?.profile?.specialization}</p>
          <p className="text-gray-500 mt-2">{user?.email}</p>
          <button
            onClick={logout}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-xl p-6 text-center transition"
          >
            <h3 className="text-gray-500 font-medium">Appointments Today</h3>
            <p className="text-2xl font-bold mt-2">
              {appointments.filter((a) => a.status === "scheduled").length}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-xl p-6 text-center transition"
          >
            <h3 className="text-gray-500 font-medium">Total Patients</h3>
            <p className="text-2xl font-bold mt-2">{appointments.length}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-xl p-6 text-center transition"
          >
            <h3 className="text-gray-500 font-medium">Pending Tasks</h3>
            <p className="text-2xl font-bold mt-2">
              {appointments.filter((a) => a.status === "pending").length}
            </p>
          </motion.div>
        </section>

        {/* Filter Appointments */}
        <section className="mb-6 flex gap-4 justify-center">
          {["today", "upcoming", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </section>

        {/* Appointments Table */}
        {loading ? (
          <p className="text-center text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-xl">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4 font-medium">Patient</th>
                  <th className="text-left p-4 font-medium">Date & Time</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id} className="border-b last:border-b-0">
                    <td className="p-4">{appt.patient.name}</td>
                    <td className="p-4">{new Date(appt.date).toLocaleString()}</td>
                    <td className="p-4 capitalize">{appt.status}</td>
                    <td className="p-4 flex gap-2">
                      {appt.status !== "completed" && (
                        <button
                          onClick={() => handleAction(appt._id, "completed")}
                          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        >
                          Complete
                        </button>
                      )}
                      {appt.status !== "cancelled" && (
                        <button
                          onClick={() => handleAction(appt._id, "cancelled")}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </motion.div>
  );
}
