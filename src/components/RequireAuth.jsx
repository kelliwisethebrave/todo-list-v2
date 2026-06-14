import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth(); //capture current auth status
  const location = useLocation(); //capture current page location
  const navigate = useNavigate(); //navigate to login page

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location }, //pass current location so you can return to it after login
        replace: false,
      });
    }
  }, [isAuthenticated, location, navigate]);

  if (!isAuthenticated) {
    return <div>Going to login...</div>;
  }
  return children;
}

export default RequireAuth;
