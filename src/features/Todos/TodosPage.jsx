import { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList.jsx";
import TodoListItem from "./TodoList/TodoListItem.jsx";

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
      setIsTodoListLoading(true);

      try {
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
          throw new Error(
            response.message || "Failed to fetch todos from server",
          );
        }
        const data = await response.json();
        console.log(data);
        setTodoList(data.tasks);
      } catch (error) {
        console.error(error);
        setError(`Error: ${error.name} | ${error.message}`);
      } finally {
        setIsTodoListLoading(false);
      }
    }
    if (token) {
      fetchTodos();
    }
  }, [token]);

  async function addTodo(todoTitle) {
    const tempId = Date.now();
    const newTodo = {
      //can be just title since they have the same name
      title: todoTitle,
      id: tempId,
      isCompleted: false,
    };

    setTodoList((previous) => [newTodo, ...previous]);
    //add to server
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        body: JSON.stringify({
          title: newTodo.title,
          isCompleted: newTodo.isCompleted,
        }),
        credentials: "include",
      };
      const response = await fetch("/api/tasks", options);

      if (!response.ok) {
        throw new Error(response.message || "Failed to add todo");
      }
      const dataNewTodo = await response.json();
      console.log(dataNewTodo);

      //setTodoList(data.tasks);
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === tempId ? dataNewTodo : todo)),
      );
    } catch (error) {
      console.error(error);
      setError(`Error: ${error.name} | ${error.message}`);

      //remove todo that didn't save to the server
      setTodoList((previous) => previous.filter((todo) => todo.id !== tempId));
    }
  }

  async function completeTodo(id) {
    //save for rollback
    const origTodo = todoList.find((todo) => todo.id === id);
    console.log(origTodo);
    //takes id
    //maps through todoList
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      } else {
        return todo;
      }
    });

    //if the current todo.id matches the id, return a new object that
    //destructures the current todo and isCompleted is set to true
    //otherwise (if todo.id does not match the id) return the todo
    //saves the resulting array to a const updatedTodos
    //update the todoList with updatedTodos
    setTodoList(updatedTodos);

    //the two previous steps can be combined:
    //setTodoList((previous) =>
    //previous.map((todo) => {
    //if (todo.id === id) {
    //return { ...todo, isCompleted: true };
    //} else {
    // return todo;

    //sending to the server
    try {
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        body: JSON.stringify({
          isCompleted: true,
          createdTime: origTodo.createdTime, //createdAt on server, but doesn't work
        }),
        credentials: "include",
      };
      const response = await fetch(`/api/tasks/${id}`, options);

      if (!response.ok) {
        throw new Error("Failed to complete todo");
      }
      const dataCompletedTodo = await response.json();
      console.log(dataCompletedTodo);
    } catch (error) {
      console.error(error);
      setError(`Error: ${error.name} | ${error.message}`);

      //rollback
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === id ? origTodo : todo)),
      );
    }
  }

  async function updateTodo(editedTodo) {
    //save for rollback
    const origTodo = todoList.find((todo) => todo.id === editedTodo.id);

    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      } else {
        return todo;
      }
    });
    setTodoList(updatedTodos);

    //sending to the server
    try {
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
          createdTime: editedTodo.createdTime, //createdAt on server, but doesn't work
        }),
        credentials: "include",
      };
      const response = await fetch(`/api/tasks/${editedTodo.id}`, options);

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
      const dataUpdatedTodo = await response.json();
      console.log(dataUpdatedTodo);
    } catch (error) {
      console.error(error);
      setError(`Error: ${error.name} | ${error.message}`);

      //rollback
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === editedTodo ? origTodo : todo)),
      );
    }
  }

  return (
    <>
      {" "}
      {error && (
        <div>
          <p>{error}</p>
          <button onClick={() => setError("")}>Clear Error</button>
        </div>
      )}
      {isTodoListLoading && (
        <div>
          <p>Loading...</p>
        </div>
      )}
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </>
  );
}

export default TodosPage;
