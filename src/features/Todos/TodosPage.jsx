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
      const options = {
        method: "GET",
        headers: {
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      };
      try {
        const response = await fetch("api/tasks", options);
        if (response.status === 401) {
          throw new Error("Not authorized.");
        }
        if (!response.ok) {
          throw new Error(
            response.messge || "Failed to fetch todos from server",
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

  function addTodo(todoTitle) {
    const newTodo = {
      //can be just title since they have the same name
      title: todoTitle,
      id: Date.now(),
      isCompleted: false,
    };

    setTodoList((previous) => [newTodo, ...previous]);
  }

  function completeTodo(id) {
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
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      } else {
        return todo;
      }
    });
    setTodoList(updatedTodos);
  }

  return (
    <>
      {" "}
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
