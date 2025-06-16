// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // npm install js-cookie

export default function ProtectedRoute({ children }) {
  const user = Cookies.get("user"); // use your token or session key

  if (!user) {
    return <Navigate to="/" />; // redirect to login
  }



  return children;
}

