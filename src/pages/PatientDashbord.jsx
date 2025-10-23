"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contex/AuthContex";
import api from "../api/api";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Fetch Appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/appointments?filter=${filter}`);
        setAppointments(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [filter]);

  // Cancel Appointment
  const handleCancel = async (id) => {
    try {
      await api.patch(`/appointments/${id}`, { status: "cancelled" });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Rating
  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    try {
      await api.post(`/doctors/${selectedDoctor}/review`, {
        rating,
        feedback,
      });
      alert("Thanks for your feedback!");
      setRating(0);
      setFeedback("");
      setSelectedDoctor(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Prepare chart data (appointments by month)
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (5 - i));
    const monthName = month.toLocaleString("default", { month: "short" });
    const count = appointments.filter(
      (a) =>
        new Date(a.date).getMonth() === month.getMonth() &&
        a.status !== "cancelled"
    ).length;
    return { month: monthName, count };
  });

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
      <header className="bg-gradient-to-r from-blue-500 to-violet-500 text-white py-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">Patient Dashboard</h1>
      </header>

      <main className="max-w-6xl mx-auto p-10">
        {/* Profile */}
        <div className="bg-white shadow-lg rounded-xl p-8 text-center mb-10">
          <img
            src={user?.profile?.photo_url || "/default-patient.png"}
            alt="Patient"
            className="w-28 h-28 mx-auto rounded-full mb-4 object-cover"
          />
          <h2 className="text-xl font-semibold">{user?.profile?.name}</h2>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-gray-500 mt-1">
            Age: {user?.profile?.age || "N/A"}
          </p>
          <button
            onClick={logout}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-xl p-6 text-center transition"
          >
            <h3 className="text-gray-500 font-medium">Upcoming</h3>
            <p className="text-2xl font-bold mt-2">
              {appointments.filter((a) => a.status === "scheduled").length}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-xl p-6 text-center transition"
          >
            <h3 className="text-gray-500 font-medium">Completed</h3>
            <p className="text-2xl font-bold mt-2">
              {appointments.filter((a) => a.status === "completed").length}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-xl p-6 text-center transition"
          >
            <h3 className="text-gray-500 font-medium">Cancelled</h3>
            <p className="text-2xl font-bold mt-2">
              {appointments.filter((a) => a.status === "cancelled").length}
            </p>
          </motion.div>
        </section>

        {/* Chart */}
        <div className="bg-white rounded-xl p-8 mb-10 shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Appointment History (Last 6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="count" stroke="#6366F1" />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {["upcoming", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Appointments */}
        {loading ? (
          <p className="text-center text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-xl">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4 font-medium">Doctor</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id} className="border-b last:border-b-0">
                    <td className="p-4 font-medium">
                      {appt.doctor?.name || "Unknown"}
                    </td>
                    <td className="p-4">
                      {new Date(appt.date).toLocaleString()}
                    </td>
                    <td
                      className={`p-4 capitalize font-semibold ${
                        appt.status === "completed"
                          ? "text-green-600"
                          : appt.status === "cancelled"
                          ? "text-red-500"
                          : "text-yellow-600"
                      }`}
                    >
                      {appt.status}
                    </td>
                    <td className="p-4 flex gap-2">
                      {appt.status === "scheduled" && (
                        <button
                          onClick={() => handleCancel(appt._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                          Cancel
                        </button>
                      )}
                      {appt.status === "completed" && (
                        <button
                          onClick={() => setSelectedDoctor(appt.doctor._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        >
                          Rate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rating Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h3 className="text-lg font-semibold mb-3 text-center">
                Rate Your Doctor
              </h3>
              <form onSubmit={handleSubmitRating}>
                <div className="flex justify-center mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      onClick={() => setRating(s)}
                      className={`cursor-pointer text-3xl ${
                        s <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  placeholder="Write your feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full border rounded-md p-2 mb-4"
                ></textarea>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(null)}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </motion.div>
  );
}
