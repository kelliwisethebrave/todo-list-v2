import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

function Logoff() {
  const { logout } = useAuth();
  const [error, setError] = useState("");
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const navigate = useNavigate();

  async function handleLogoff() {
    setIsLoggingOff(true);
    setError("");

    const result = await logout();
    navigate("/login");
    if (result.success) {
      // Logout successful, context will update automatically
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  }
  return (
    <>
      <button onClick={handleLogoff} disabled={isLoggingOff}>
        {isLoggingOff ? <>Logging off...</> : <>Log Off</>}
      </button>
      {error && <p>{error}</p>}
    </>
  );
}

export default Logoff;
