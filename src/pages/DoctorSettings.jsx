export default function DoctorSettings() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Doctor Settings</h1>
      <div className="space-y-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Edit Profile</button>
        <button className="px-4 py-2 bg-green-600 text-white rounded">Set Availability</button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded">Update Password</button>
      </div>
    </div>
  );
}
