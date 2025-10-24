export default function AdminSettings() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
      <div className="space-y-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Manage Users</button>
        <button className="px-4 py-2 bg-green-600 text-white rounded">Change Logo</button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded">Update Password</button>
      </div>
    </div>
  );
}
