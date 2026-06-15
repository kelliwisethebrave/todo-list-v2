import { useAuth } from "../contexts/AuthContext.jsx";
import Logoff from "../features/Logoff.jsx";
import Navigation from "./Navigation.jsx";

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <h1>Todo List</h1>
      <Navigation />
      {isAuthenticated && <Logoff />}
    </>
  );
}

export default Header;
