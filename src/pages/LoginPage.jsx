import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { sanitizeInput } from "../utils/sanitizeInput";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  //Get inded destination from location state, default to /todos
  const from = location.state?.from?.pathname || "/todos";

  //redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  //handle login form submission
  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoggingOn(true);

    if (!email.trim() || !password.trim()) {
      setAuthError("Please enter both your email and password.");
      return;
    }

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    try {
      const response = await login(sanitizedEmail, sanitizedPassword);

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
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Log in</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">Email&nbsp;</label>
            <input
              type="text"
              className={styles.input}
              id="email"
              name="email"
              maxLength={300}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />{" "}
            <label htmlFor="password">Password&nbsp;</label>
            <input
              type="password"
              className={styles.input}
              maxLength={300}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button disabled={isLoggingOn} className={styles.loginButton}>
            {isLoggingOn ? <>Logging in...</> : <>Log on</>}
          </button>
        </form>
        {authError && <p className="error">{authError}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
