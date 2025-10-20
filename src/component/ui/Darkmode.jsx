import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const Darkmode = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add(dark);
    } else document.documentElement.remove(dark);
  }, [dark]);
  return (
    <div>
      <button className="flex items-center justify-center" onClick={() => setDark(!dark)}>
        {dark ? <Sun /> : <Moon />}
        {children}
      </button>
    </div>
  );
};

export default Darkmode;
