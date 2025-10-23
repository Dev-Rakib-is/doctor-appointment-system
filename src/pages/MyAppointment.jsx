"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../contex/AuthContex";
import api from "../api/api";

const statusMap = {
  upcoming: "PENDING",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
};

const MyAppointment = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  // Fetch Appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/appointments/patient?status=${statusMap[filter]}`
        );
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
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.patch(`/appointments/update-status`, {
        status: "CANCELLED",
        appointment_id: id,
      });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "CANCELLED" } : a))
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
      setSelectedDoctor(null);
      setRating(0);
      setFeedback("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
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

      {/* Appointments Table */}
      {loading ? (
        <p className="text-gray-500">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
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
                  <td className="p-4">{new Date(appt.date).toLocaleString()}</td>
                  <td
                    className={`p-4 capitalize font-semibold ${
                      appt.status === "COMPLETED"
                        ? "text-green-600"
                        : appt.status === "CANCELLED"
                        ? "text-red-500"
                        : "text-yellow-600"
                    }`}
                  >
                    {appt.status.toLowerCase()}
                  </td>
                  <td className="p-4 flex gap-2">
                    {appt.status === "PENDING" && (
                      <button
                        onClick={() => handleCancel(appt._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                    {appt.status === "COMPLETED" && (
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
              />
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
    </div>
  );
};

export default MyAppointment;
