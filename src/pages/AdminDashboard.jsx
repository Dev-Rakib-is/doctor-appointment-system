import { useAuth } from "../contex/AuthContex";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  if (!user) return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
      </header>

      <main className="max-w-6xl mx-auto p-10">
        {/* Admin Info Card */}
        <div className="bg-white shadow-lg rounded-xl p-8 mb-10 text-center">
          <img
            src={user?.profile?.photo_url || "https://i.ibb.co/0j90S3YT/7474061.png"}
            alt="Admin"
            className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
          />
          <h2 className="text-xl font-semibold">{user?.profile?.name || "Admin"}</h2>
          <p className="text-gray-600">{user?.email}</p>
          <button
            onClick={logout}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>

        {/* Example Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <h3 className="text-gray-500 font-medium">Total Doctors</h3>
            <p className="text-2xl font-bold mt-2">42</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <h3 className="text-gray-500 font-medium">Total Patients</h3>
            <p className="text-2xl font-bold mt-2">128</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <h3 className="text-gray-500 font-medium">Appointments Today</h3>
            <p className="text-2xl font-bold mt-2">19</p>
          </div>
        </section>
      </main>
    </div>
  );
}
