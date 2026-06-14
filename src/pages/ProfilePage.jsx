import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

function ProfilePage() {
  const { name, token } = useAuth();
  const [todoStats, setTodoStats] = useState({
    totalTodos: 0,
    completedTodos: 0,
    activeTodos: 0,
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
            "X-CRSF-TOKEN": token,
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
        console.log(todos);
        const todosTotal = todos.tasks.length;
        const completedTodos = todos.tasks.filter(
          (todo) => todo.isCompleted,
        ).length;
        const activeTodos = todosTotal - completedTodos;

        setTodoStats({ todosTotal, completedTodos, activeTodos });
      } catch (error) {
        setError(`Error loading todo statistics: ${error.message}`);
      } finally {
        setIsLoading(false);
        console.log(todoStats);
      }
    }

    fetchTodoStats();
  }, [token]);

  return (
    <>
      <h2>{name} - user profile</h2>
      <h3>Todo Statistics</h3>
      {isLoading ? (
        <p>Loading statistics...</p>
      ) : (
        <div>
          <p>
            <b>Total todos:</b> {todoStats.todosTotal}
          </p>
          <p>
            <b>Completed todos:</b> {todoStats.completedTodos}
          </p>
          <p>
            <b>Uncompleted/Active todos:</b> {todoStats.activeTodos}
          </p>
        </div>
      )}
      {error && <p>Error: {error.message}</p>}
    </>
  );
}

export default ProfilePage;
