export default function PatientSettings() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Patient Settings</h1>

      {/* Personal Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="space-y-3">
          <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" />
          <input type="email" placeholder="Email Address" className="w-full p-2 border rounded" />
          <input type="text" placeholder="Phone Number" className="w-full p-2 border rounded" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="flex items-center justify-between mb-2">
          <span>Email Notifications</span>
          <input type="checkbox" className="toggle" />
        </div>
        <div className="flex items-center justify-between">
          <span>Appointment Reminders</span>
          <input type="checkbox" className="toggle" />
        </div>
      </div>

      {/* Security */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <div className="space-y-3">
          <input type="password" placeholder="Current Password" className="w-full p-2 border rounded" />
          <input type="password" placeholder="New Password" className="w-full p-2 border rounded" />
          <input type="password" placeholder="Confirm New Password" className="w-full p-2 border rounded" />
          <button className="px-4 py-2 bg-gray-700 text-white rounded">Update Password</button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
        <button className="px-4 py-2 bg-red-600 text-white rounded">Delete Account</button>
      </div>
    </div>
  );
}
