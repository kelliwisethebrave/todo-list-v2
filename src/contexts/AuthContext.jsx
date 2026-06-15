import { createContext, useContext, useState } from "react";

// create the context

const AuthContext = createContext();

// custom hook with error checking

export function useAuth() {
  const context = useContext(AuthContext);
  //console.log("Auth context:", context); // Remove this later
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  //state for authentication

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  // functions will go here

  const login = async (userEmail, password) => {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password }),
        credentials: "include",
      };

      const res = await fetch("/api/users/logon", options);
      const data = await res.json();

      if (res.status === 200 && data.name && data.csrfToken) {
        //Success: update state
        setEmail(data.name);
        setToken(data.csrfToken);
        return { success: true };
      } else {
        //failure: return error
        return {
          success: false,
          error: data?.message || "Authentication failed.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Networking error during login",
      };
    }
  };

  // log off function
  const logout = async () => {
    if (!token) {
      // if not token just clear local state
      setEmail("");
      setToken("");
      return { success: true };
    }
    try {
      const options = {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      };

      const res = await fetch("/api/users/logoff", options);

      if (res.ok) {
        //Success: update state
        setEmail("");
        setToken("");
        return { success: true };
      } else {
        const data = await res.json();

        return {
          success: false,
          error: data?.message || "Error logging off",
        };
      }
    } catch {
      return {
        success: false,
        error: "Error logging off",
      };
    }
  };

  // context value object
  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
