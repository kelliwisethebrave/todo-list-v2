import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

function Logon() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoggingOn(true);

    try {
      const response = await login(email, password);

      if (response.success) {
        //login successful
      } else {
        setAuthError(response.error);
      }
    } catch (error) {
      setAuthError(`Error: ${error.name} | ${error.message}`);
    } finally {
      setIsLoggingOn(false);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={isLoggingOn}>
          {isLoggingOn ? <>Logging in...</> : <>Log on</>}
        </button>
      </form>
      {authError && <p>{authError}</p>}
    </>
  );
}

export default Logon;
