import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <h2>404: Not found</h2>
      <Link to="/">Go home</Link>
      <Link to="/todos">Todos Page</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/about">About</Link>
    </div>
  );
}

export default NotFound;
