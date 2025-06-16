import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FcGoogle } from "react-icons/fc"; // Google icon

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      let result = await signInWithPopup(auth, provider);

      // Save user info in cookies
      Cookies.set(
        "user",
        JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        }),
        { expires: 1 }
      );


      navigate("/map");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-[90%] max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back 👋</h1>
        <p className="text-gray-500 mb-6">Sign in with your Google account to continue</p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-3 px-5 bg-white border border-gray-300 rounded-lg shadow hover:shadow-md hover:border-gray-400 transition-all"
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          ) : (
            <>
              <FcGoogle size={22} />
              <span className="text-sm font-semibold text-gray-700">
                Sign in with Google
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
