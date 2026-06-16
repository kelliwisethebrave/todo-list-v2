import { useAuth } from "../contexts/AuthContext.jsx";
import Logoff from "../features/Logoff.jsx";
import Navigation from "./Navigation.jsx";
import styles from "./Header.module.css";

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.header}>
      <header className={styles.headerContent}>
        <h1 className="h1-large">Todo List</h1>
        <Navigation />
        {isAuthenticated && <Logoff />}
      </header>
    </div>
  );
}

export default Header;
