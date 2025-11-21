"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contex/AuthContex";
import api from "../api/api";

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today");

  // ✅ fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        // 🔹 format today as yyyy-mm-dd
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];

        let url = `/appointments/doctor?page=1`;

        if (filter === "today") {
          url += `&date=${formattedDate}`;
        } else if (filter === "upcoming") {
          url += `&status=SCHEDULED`;
        }

        const res = await api.get(url);
        const data = res.data?.data || [];
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [filter]);

  // ✅ update appointment status
  const handleAction = async (appointment_id, status) => {
    try {
      await api.patch(`/appointments/update-status`, {
        appointment_id,
        status,
      });
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointment_id ? { ...appt, status } : appt
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
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
      <header className="bg-blue-600 dark:bg-gray-800 text-white py-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">Doctor Dashboard</h1>
      </header>

      <main className="max-w-6xl mx-auto p-10 bg-white dark:bg-black">
        {/* Doctor Info */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 text-center mb-10">
          <div className="flex items-center justify-center border w-28 h-28 mx-auto rounded-full overflow-hidden bg-gray-100">
            {user?.profile?.photo_url ? (
              <img
                src={user.profile.photo_url}
                alt="Doctor"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm">Doctor</span>
            )}
          </div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-600">{user?.profile?.specialization}</p>
          <p className="text-gray-500 mt-2">{user?.email}</p>
          <button
            onClick={logout}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-xl p-6 text-center transition dark:bg-gray-800"
          >
            <h3 className="text-gray-500 font-medium dark:text-white">
              Appointments Today
            </h3>
            <p className="text-2xl font-bold mt-2">
              {appointments.filter((a) => a.status === "SCHEDULED").length}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-xl p-6 text-center transition dark:bg-gray-800"
          >
            <h3 className="text-gray-500 font-medium dark:text-white">
              Total Patients
            </h3>
            <p className="text-2xl font-bold mt-2">{appointments.length}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-xl p-6 text-center transition dark:bg-gray-800"
          >
            <h3 className="text-gray-500 font-medium dark:text-white">
              Pending Tasks
            </h3>
            <p className="text-2xl font-bold mt-2">
              {appointments.filter((a) => a.status === "PENDING").length}
            </p>
          </motion.div>
        </section>

        {/* Filter Buttons */}
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

        {/* Table */}
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
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id} className="border-b last:border-b-0">
                    <td className="p-4">{appt?.patient?.name}</td>
                    <td className="p-4">
                      {new Date(appt.date).toLocaleString()}
                    </td>
                    <td className="p-4 capitalize">{appt.status}</td>
                    <td className="p-4 flex gap-2">
                      {appt.status !== "COMPLETE" && (
                        <button
                          onClick={() => handleAction(appt._id, "COMPLETE")}
                          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        >
                          Complete
                        </button>
                      )}
                      {appt.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleAction(appt._id, "CANCELLED")}
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
