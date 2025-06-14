// Note: This component assumes Tailwind CSS is configured in the project.
// Ensure framer-motion is installed for the homepage (not used here, but for project consistency):
// npm install framer-motion
// or
// yarn add framer-motion

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import { useUserProfile } from './UserProfileContext';
import { useState } from 'react';

const navItems = [
  { to: "/", label: "Home" },
  { to: "/scan", label: "Scan" },
  { to: "/ingredients", label: "Ingredients" },
  { to: "/alternatives", label: "Alternatives" },
  { to: "/learn", label: "Learn" },
  { to: "/onboarding", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

const NavBar = () => {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const { profile, setProfile } = useUserProfile();
  const navigate = useNavigate();

  const [profileDropdown, setProfileDropdown] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [theme, setTheme] = useState(() => window.localStorage.getItem('theme') || 'light');

  const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || "User";

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleNameChange = () => {
    if (tempName.trim() !== "") {
      setProfile({
        ...profile,
        displayName: tempName.trim(),
        allergies: profile?.allergies || [],
        avoidIngredients: profile?.avoidIngredients || [],
        preferredIngredients: profile?.preferredIngredients || [],
      });
    }
    setNameModalOpen(false);
    setSettingsOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    window.localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <nav className="w-full bg-white dark:bg-zinc-900 border-b shadow-sm mb-2 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <span className="font-extrabold text-xl text-green-700 dark:text-green-300 tracking-tight">Smart Food Analysis</span>
        <div className="hidden md:flex space-x-2 lg:space-x-6 items-center">
          {navItems.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`font-medium px-3 py-1 rounded transition-colors duration-200 ${
                pathname === to
                  ? "text-green-700 bg-green-100 dark:bg-green-800 dark:text-green-200"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
              }`}
            >
              {label}
            </Link>
          ))}

          {user && (
            <div className="relative ml-4">
              <button
                onClick={() => setProfileDropdown((prev) => !prev)}
                className="flex items-center px-2 py-1 hover:bg-green-100 dark:hover:bg-green-800 rounded focus:outline-none"
                aria-haspopup="true"
                aria-expanded={profileDropdown}
                aria-label="User profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-2">
                  <span className="text-lg text-green-700" aria-hidden="true">👤</span>
                </div>
                <span className="font-semibold mr-2 text-green-700 dark:text-green-200">{displayName}</span>
                <svg width="18" height="18" aria-hidden="true" className="ml-1 text-green-700 dark:text-green-200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8l3 3 3-3" />
                </svg>
              </button>
              {/* Dropdown */}
              {profileDropdown && (
                <div
                  className="absolute top-12 right-0 bg-white dark:bg-zinc-900 border border-green-200 rounded-xl shadow-lg w-64 z-40 p-4"
                  role="menu"
                  aria-label="User profile options"
                >
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center text-3xl mb-2" aria-hidden="true">
                      <span role="img" aria-label="Profile icon">👤</span>
                    </div>
                    <span className="text-lg font-bold text-green-700 dark:text-green-200">{displayName}</span>
                  </div>
                  <button
                    className="w-full py-2 my-1 bg-white text-green-600 font-semibold border border-green-300 rounded-lg hover:bg-green-50 dark:bg-zinc-800 dark:text-green-200 dark:border-green-600 dark:hover:bg-green-900"
                    onClick={() => {
                      setNameModalOpen(true);
                      setProfileDropdown(false);
                      setTempName(displayName);
                    }}
                    role="menuitem"
                  >
                    Set/Change Name
                  </button>
                  <button
                    className="w-full py-2 my-1 bg-white text-green-600 font-semibold border border-green-300 rounded-lg opacity-70 cursor-not-allowed dark:bg-zinc-800 dark:text-green-200 dark:border-green-600"
                    disabled
                    role="menuitem"
                    aria-disabled="true"
                  >
                    Upload Profile Pic <span className="ml-1 text-xs">(Coming soon)</span>
                  </button>
                  <button
                    className="w-full py-2 my-1 bg-white text-red-600 font-semibold border border-red-300 rounded-lg hover:bg-red-50 dark:bg-zinc-800 dark:text-red-300 dark:border-red-600 dark:hover:bg-red-900"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Logout
                  </button>
                  <button
                    className="w-full py-2 my-1 bg-white text-green-600 font-semibold border border-green-300 rounded-lg hover:bg-green-50 dark:bg-zinc-800 dark:text-green-200 dark:border-green-600 dark:hover:bg-green-900"
                    onClick={() => {
                      setSettingsOpen(true);
                      setProfileDropdown(false);
                      setTempName(displayName);
                    }}
                    role="menuitem"
                  >
                    ⚙️ Settings
                  </button>
                </div>
              )}
              {/* Name change modal */}
              {nameModalOpen && (
                <div
                  className="fixed inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center z-50"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="name-modal-title"
                >
                  <div className="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow-lg min-w-[300px] flex flex-col">
                    <h2 id="name-modal-title" className="text-lg font-bold text-green-700 dark:text-green-200 mb-2">Update Display Name</h2>
                    <input
                      className="p-2 mb-2 border border-green-300 rounded dark:bg-zinc-900 dark:text-white dark:border-green-600"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      autoFocus
                      aria-label="Display name input"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                        onClick={() => setNameModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={handleNameChange}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Settings modal */}
              {settingsOpen && (
                <div
                  className="fixed inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center z-50"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="settings-modal-title"
                >
                  <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg min-w-[320px]">
                    <h2 id="settings-modal-title" className="text-xl font-bold text-green-700 dark:text-green-200 mb-3">Settings</h2>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-green-700 dark:text-green-200">Theme:</span>
                      <button
                        className="px-3 py-1 rounded border bg-white text-green-600 border-green-300 dark:bg-zinc-800 dark:text-green-200 dark:border-green-600"
                        onClick={toggleTheme}
                        aria-pressed={theme === 'dark'}
                        aria-label="Toggle theme"
                      >
                        {theme === 'light' ? '🌞 Light' : '🌜 Dark'}
                      </button>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="settings-name-input" className="block mb-1 text-green-700 dark:text-green-200">Change Name:</label>
                      <input
                        id="settings-name-input"
                        className="p-2 mb-2 border border-green-300 rounded w-full dark:bg-zinc-900 dark:text-white dark:border-green-600"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        aria-label="Change display name input"
                      />
                      <button
                        className="w-full px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={handleNameChange}
                      >
                        Save Name
                      </button>
                    </div>
                    <button
                      className="w-full px-3 py-1 mt-3 bg-gray-200 rounded hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="md:hidden">
          {/* Future: Add mobile menu button/dropdown here */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;