// Home.jsx
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

const Home = () => {
  const navigate = useNavigate();
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specRes, docRes] = await Promise.all([
          api.get("/specializations"),
          api.get("/doctors?page=1&limit=8"),
        ]);
        setSpecializations(specRes.data?.data || []);
        setDoctors(docRes.data?.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Search doctors
  const fetchDoctors = async (query) => {
    setLoading(true);
    try {
      const res = await api.get(`/doctors?page=1&limit=8&search=${query}`);
      setDoctors(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchDoctors = useCallback(
    debounce((value) => fetchDoctors(value), 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedFetchDoctors(e.target.value);
  };

  // Book appointment button
  const handleBookClick = (doctorId) => {
    if (!token) {
      navigate("/login");
    } else {
      navigate(
        doctorId ? `/book-appointment/${doctorId}` : "/book-appointment"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-pink-300 to-violet-400 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Your Health, Our Priority
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-6">
          Book appointments with the best doctors — anytime, anywhere.
        </p>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer outline-0"
          onClick={() => handleBookClick(null)}
        >
          Book Appointment
        </motion.button>
      </section>

      {/* Search Section */}
      <section className="flex justify-center mt-10 px-4">
        <div className="flex w-full max-w-lg">
          <input
            type="text"
            placeholder="Search doctor or specialization..."
            value={search}
            onChange={handleSearchChange}
            className="w-full border border-gray-300 p-3 rounded-l-lg outline-0"
          />
        </div>
      </section>

      {/* Popular Specializations */}
      <section className="my-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Popular Specializations
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {specializations.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 shadow-md p-6 rounded-xl text-center hover:shadow-lg transition"
              >
                <p className="font-semibold text-black text-lg">{item}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Doctors */}
      <section className="my-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Featured Doctors
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading doctors...</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white shadow-md p-6 rounded-2xl text-center hover:shadow-xl transition"
              >
                <img
                  src={doctor.photo_url || "https://i.ibb.co/0j90S3YT/7474061.png"}
                  alt={doctor.name}
                  className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                />
                <h3 className="font-semibold text-lg text-gray-800">{doctor.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{doctor.specialization}</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm cursor-pointer hover:bg-blue-700 transition"
                  onClick={() => handleBookClick(doctor._id)}
                >
                  Book Now
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
