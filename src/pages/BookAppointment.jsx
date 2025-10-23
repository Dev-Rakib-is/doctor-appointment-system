import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { motion } from "framer-motion";
import { useAuth } from "../contex/AuthContex";

const BookAppointment = () => {
  const { doctorId } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token") || "";

  const [doctor, setDoctor] = useState(null);
  const [allDoctors, setAllDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorId || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors?page=1&limit=50", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setAllDoctors(res.data?.data || []);

        if (doctorId) {
          const found = res.data?.data.find((d) => d._id === doctorId);
          setDoctor(found || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [doctorId, token]);

  // Submit appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("You must be logged in to book an appointment.");
      return;
    }

    const finalDoctorId = selectedDoctorId;
    if (!finalDoctorId) return setError("Please select a doctor");
    if (!date || !time) return setError("Please select date and time");

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      //  date + time
      const dateTimeISO = new Date(`${date}T${time}:00`).toISOString();

      console.log("Booking payload:", { doctorId: finalDoctorId, date: dateTimeISO });

      await api.post(
        "/appointments",
        {
          doctorId: finalDoctorId,
          date: dateTimeISO,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Appointment booked successfully!");
      setTimeout(() => navigate("/patient/appointments"), 1500);
    } catch (err) {
      console.error("Booking error:", err);
      setError("Failed to book appointment. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Book Appointment</h1>

        {!doctorId && (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Select Doctor</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="">-- Choose a doctor --</option>
              {allDoctors.map((d, index) => (
                <option key={d._id || index} value={d._id}>
                  {d.name} - {d.specialization}
                </option>
              ))}
            </select>
          </div>
        )}

        {doctor && doctorId && (
          <div className="mb-6 text-center">
            <img
              src={doctor.photo_url || "https://i.ibb.co/0j90S3YT/7474061.png"}
              alt={doctor.name}
              className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
            />
            <h2 className="text-lg font-semibold">{doctor.name}</h2>
            <p className="text-gray-600">{doctor.specialization}</p>
          </div>
        )}

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Date */}
          <div>
            <label className="block font-medium mb-1">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toLocaleDateString("en-CA")}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block font-medium mb-1">Select Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
            </select>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Booking..." : "Book Appointment"}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
