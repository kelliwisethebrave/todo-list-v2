import { Link } from "react-router";

function NotFound() {
  return (
    <div>
      <h2>404: Not found</h2>
      <Link to="/">Go home</Link> - <Link to="/todos">Todos Page</Link> -&nbsp;
      <Link to="/profile">Profile</Link> - <Link to="/about">About</Link>
    </div>
  );
}

export default NotFound;
