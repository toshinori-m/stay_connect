import { useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 dark:text-white">
      <button
        onClick={toggleDarkMode}
        className="px-4 py-2 bg-blue-500 dark:bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-blue-600 dark:hover:bg-yellow-600"
      >
        {darkMode ? "ライトモード" : "ダークモード"}
      </button>
      <h1 className="text-3xl font-bold mt-4">Tailwind Dark Mode</h1>
    </div>
  );
}

export default App;
