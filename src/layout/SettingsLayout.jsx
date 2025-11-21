import { Outlet, NavLink } from "react-router";

const SettingsLayout = () => {
  const menu = [
    { label: "Profile", to: "/settings/profile" },
    { label: "Account", to: "/settings/account" },
    { label: "Preferences", to: "/settings/preferences" },
    { label: "Security", to: "/settings/security" },
  ];

  return (
    <div className="flex w-full h-full">

      {/* LEFT SETTINGS SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r p-4">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Settings</h2>

        <nav className="space-y-3">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "block bg-green-600 text-white rounded px-4 py-2"
                  : "block px-4 py-2 dark:text-white hover:bg-gray-200"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SettingsLayout;
