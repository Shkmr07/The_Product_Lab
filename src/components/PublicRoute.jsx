// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function PublicRoute({ children }) {
  const user = Cookies.get("user");

  if (user) {
    return <Navigate to="/map" />;
  }

  return children;
}
