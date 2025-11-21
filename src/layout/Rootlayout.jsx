import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const RootLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto text-black dark:text-white dark:bg-black">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
