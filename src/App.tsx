import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Onboarding from "@/Onboarding";
import MainScanPage from "@/MainScanPage";
import { UserProfileProvider } from "@/lib/UserProfileContext";
import NavBar from "@/lib/NavBar";
import HomePage from "@/HomePage";
import IngredientsPage from "@/IngredientsPage";
import AlternativesPage from "@/AlternativesPage";
import LearnPage from "@/LearnPage";
import SettingsPage from "@/SettingsPage";
import SignInSignUpPage from "@/SignInSignUpPage";
import { AuthProvider, useAuth } from '@/lib/AuthContext';

function PrivateRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center mt-32 text-xl">Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/auth" />;
}

function App() {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/auth" element={<SignInSignUpPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/scan" element={<MainScanPage />} />
              <Route path="/ingredients" element={<IngredientsPage />} />
              <Route path="/alternatives" element={<AlternativesPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
          <footer className="w-full mt-16 bg-gray-100 py-7 shadow-inner border-t">
            <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-gray-600">
              <div className="font-semibold text-lg text-green-700 mb-4 sm:mb-0">Smart Food Analysis</div>
              <div className="flex space-x-4 mb-3 sm:mb-0 text-gray-500 text-sm">
                <a href="/" className="hover:text-green-700 transition">Home</a>
                <a href="/scan" className="hover:text-green-700 transition">Scan</a>
                <a href="/ingredients" className="hover:text-green-700 transition">Ingredients</a>
                <a href="/alternatives" className="hover:text-green-700 transition">Alternatives</a>
                <a href="/onboarding" className="hover:text-green-700 transition">Profile</a>
                <a href="/settings" className="hover:text-green-700 transition">Settings</a>
              </div>
              <div className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Smart Food Analysis. All rights reserved.</div>
            </div>
          </footer>
        </Router>
      </UserProfileProvider>
    </AuthProvider>
  );
}

export default App;
