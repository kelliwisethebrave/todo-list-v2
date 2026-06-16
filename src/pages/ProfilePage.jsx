import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

function ProfilePage() {
  const { email, token } = useAuth();
  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setIsLoading(true);
        setError("");

        const options = {
          method: "GET",
          headers: {
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
        };

        const response = await fetch("/api/tasks", options);

        if (response.status === 401) {
          throw new Error("Not authorized.");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch todos from server.");
        }

        const todos = await response.json();
        const total = todos.tasks.length;
        const completed = todos.tasks.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (error) {
        setError(`Error loading todo statistics: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  return (
    <>
      <h2>{email} - User Profile</h2>
      <p>
        <b>Status:</b> Active
      </p>
      <h3>Todo Statistics</h3>
      {isLoading ? (
        <div className="loadingContainer">
          <div className="spinner"></div>
          <p className="loading">Loading statistics...</p>
        </div>
      ) : (
        <div>
          <p>
            <b>Total todos:</b> {todoStats.total}
          </p>
          <p>
            <b>Completed todos:</b> {todoStats.completed}
          </p>
          <p>
            <b>Uncompleted/Active todos:</b> {todoStats.active}
          </p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </>
  );
}

export default ProfilePage;
