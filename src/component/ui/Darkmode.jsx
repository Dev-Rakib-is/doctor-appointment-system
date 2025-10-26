import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const Darkmode = ({ children }) => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="dark:text-white">
      <button
        className="flex items-center justify-center cursor-pointer"
        onClick={() => setDark(!dark)}
      >
        {dark ? <Sun /> : <Moon />}
        {children}
      </button>
    </div>
  );
};

export default Darkmode;
