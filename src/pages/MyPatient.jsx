import { useEffect, useMemo, useState } from "react";
import { User, Mail, Calendar } from "lucide-react";

const dummyPatients = Array.from({ length: 20 }).map((_, i) => ({
  _id: `p-${i + 1}`,
  name: `Patient ${i + 1}`,
  email: `patient${i + 1}@example.com`,
  phone: `01720${1000 + i}`,
  age: 22 + (i % 20),
  status: i % 5 === 0 ? "inactive" : "active",
  lastVisit: new Date(Date.now() - 86400000 * i).toISOString(),
}));

export default function MyPatient() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("cards");
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setPatients(dummyPatients);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q)
      );
    });
  }, [patients, query, filter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const handleView = (id) => alert(`Viewing ${id}`);
  const handleMessage = (id) => alert(`Messaging ${id}`);
  const handleBook = (id) => alert(`Booking appointment for ${id}`);

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Patients</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your patients and appointments
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search patients..."
            className="px-3 py-1 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none"
          />
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex border rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setView("cards")}
              className={`px-3 py-1 text-sm rounded-l-md ${
                view === "cards"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1 text-sm rounded-r-md ${
                view === "table"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-36 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 text-center p-10 rounded-lg">
          <User size={36} className="mx-auto text-gray-400" />
          <p className="mt-4 font-semibold text-gray-600 dark:text-gray-300">
            No patients found
          </p>
        </div>
      ) : view === "cards" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {paged.map((p) => (
              <div
                key={p._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                    <User />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.email}</p>
                    <p className="text-xs text-gray-400">
                      Last visit: {new Date(p.lastVisit).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      p.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="flex justify-between mt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(p._id)}
                      className="px-3 py-1 text-sm rounded bg-gray-100 dark:bg-gray-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleMessage(p._id)}
                      className="px-3 py-1 text-sm rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center gap-1"
                    >
                      <Mail size={14} /> Msg
                    </button>
                  </div>
                  <button
                    onClick={() => handleBook(p._id)}
                    className="px-3 py-1 text-sm rounded bg-green-500 text-white flex items-center gap-1"
                  >
                    <Calendar size={14} /> Book
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing {(page - 1) * perPage + 1}–
              {Math.min(page * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded bg-white dark:bg-gray-800"
              >
                Prev
              </button>
              <span className="px-3 py-1 border rounded bg-white dark:bg-gray-800">
                Page {page}/{totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded bg-white dark:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <table className="min-w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="p-4 text-sm">Name</th>
                <th className="p-4 text-sm">Email</th>
                <th className="p-4 text-sm">Phone</th>
                <th className="p-4 text-sm">Age</th>
                <th className="p-4 text-sm">Last Visit</th>
                <th className="p-4 text-sm">Status</th>
                <th className="p-4 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p._id} className="border-b last:border-none">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.email}</td>
                  <td className="p-4">{p.phone}</td>
                  <td className="p-4">{p.age}</td>
                  <td className="p-4">
                    {new Date(p.lastVisit).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        p.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleView(p._id)}
                      className="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-gray-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleMessage(p._id)}
                      className="px-2 py-1 text-sm rounded bg-blue-100 dark:bg-blue-900 text-blue-600"
                    >
                      Msg
                    </button>
                    <button
                      onClick={() => handleBook(p._id)}
                      className="px-2 py-1 text-sm rounded bg-green-500 text-white"
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing {(page - 1) * perPage + 1}–
              {Math.min(page * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded bg-white dark:bg-gray-800"
              >
                Prev
              </button>
              <span className="px-3 py-1 border rounded bg-white dark:bg-gray-800">
                Page {page}/{totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded bg-white dark:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
