import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function Theme({ className = "" }) {
  const [isDark, setIsDark] = useState(false);

  // Runs only on mount, sets theme from localStorage or system preference
  useEffect(() => {
    const root = document.documentElement;
    let dark = false;
    if (localStorage.getItem("theme")) {
      dark = localStorage.getItem("theme") === "dark";
    } else {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    setIsDark(dark);
    root.classList.toggle("dark", dark);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = !isDark;
    setIsDark(next);
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`rounded-md border px-3 py-1 text-xl flex items-center justify-center
                  bg-white text-gray-900 border-gray-300
                  dark:bg-neutral-800 dark:text-gray-100 dark:border-neutral-700 ${className}`}
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <FiMoon /> : <FiSun />}
    </button>
  );
}
