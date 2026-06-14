import "./App.css";
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import TodosPage from "./pages/TodosPage.jsx";
import Header from "./shared/Header.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
//import { useState } from "react";
//import { useAuth } from "./contexts/AuthContext.jsx";

function App() {
  //const [email, setEmail] = useState("");
  //const [token, setToken] = useState("");
  //const { isAuthenticated } = useAuth();

  return (
    <div>
      <Header />
      {/*{isAuthenticated ? <TodosPage /> : <Logon />}*/}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/todos"
          element={
            <RequireAuth>
              <TodosPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
