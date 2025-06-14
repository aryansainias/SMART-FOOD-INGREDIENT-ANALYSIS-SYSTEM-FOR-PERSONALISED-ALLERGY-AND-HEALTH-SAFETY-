import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const SignInSignUpPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/onboarding");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/onboarding");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="bg-white rounded shadow p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? "Create Your Account" : "Sign In"}
        </h2>
        <button
          onClick={handleGoogleLogin}
          className="w-full mb-5 bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-medium text-lg flex items-center justify-center gap-2"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <g>
              <path
                fill="#fff"
                d="M24 12.273c0-.818-.074-1.597-.21-2.364H12.24v4.485h6.525a5.593 5.593 0 0 1-2.42 3.669v3.038h3.907C22.753 19.053 24 15.941 24 12.273z"
              />
              <path
                fill="#fff"
                d="M12.24 24c3.24 0 5.97-1.07 7.96-2.904l-3.908-3.038c-1.087.727-2.504 1.152-4.052 1.152-3.12 0-5.765-2.104-6.715-4.946H1.499v3.108A12 12 0 0 0 12.24 24z"
              />
              <path
                fill="#fff"
                d="M5.525 14.264a7.24 7.24 0 0 1 0-4.528V6.627H1.499a11.936 11.936 0 0 0 0 10.745l4.026-3.108z"
              />
              <path
                fill="#fff"
                d="M12.24 4.772c1.772 0 3.36.61 4.616 1.807l3.444-3.444C18.207 1.07 15.477 0 12.24 0A12 12 0 0 0 1.499 6.627l4.026 3.109c.95-2.842 3.595-4.964 6.715-4.964z"
              />
            </g>
          </svg>
          Continue with Google
        </button>
        <div className="flex items-center mb-5">
          <div className="border-b w-full" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <div className="border-b w-full" />
        </div>
        <form onSubmit={handleEmailAuth}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full mb-3 px-3 py-2 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full mb-4 px-3 py-2 border rounded"
          />
          {error && (
            <div className="text-red-600 font-medium mb-3 text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 font-semibold text-lg"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <div className="mt-5 text-sm text-center">
          {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{" "}
          <button
            onClick={() => setIsSignUp((s) => !s)}
            className="text-green-700 font-semibold hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUpPage;
