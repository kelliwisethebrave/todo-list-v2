import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Navigation.module.css";

function Navigation() {
  const { isAuthenticated } = useAuth();

  //const navLinkStyles = ({ isActive }) => ({
  //  fontWeight: isActive ? "bold" : "normal",
  //  textDecoration: isActive ? "underline" : "none",
  //});

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            About
          </NavLink>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <NavLink
                to="/todos"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.link
                }
              >
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.link
                }
              >
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.link
              }
            >
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
