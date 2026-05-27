import { useState, useEffect, useCallback } from "react";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList/TodoList.jsx";
import SortBy from "../../shared/SortBy.jsx";
import useDebounce from "../../utils/useDebounce.js";
import FilterInput from "../../shared/FilterInput.jsx";

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("creationDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterTerm, setFilterTerm] = useState("");
  const [dataVersion, setDataVersion] = useState(0);
  const [filterError, setFilterError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  useEffect(() => {
    async function fetchTodos() {
      setIsTodoListLoading(true);

      const paramsObject = {
        sortBy,
        sortDirection,
      };

      if (debouncedFilterTerm) {
        paramsObject.find = debouncedFilterTerm;
      }

      const params = new URLSearchParams(paramsObject);

      try {
        const options = {
          method: "GET",
          headers: {
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
        };
        const response = await fetch(`/api/tasks?${params}`, options);
        if (response.status === 401) {
          throw new Error("Not authorized.");
        }
        if (!response.ok) {
          throw new Error(
            response.message || "Failed to fetch todos from server",
          );
        }
        const data = await response.json();
        setTodoList(data.tasks);
        setFilterError("");
      } catch (error) {
        console.error(error);
        if (
          debouncedFilterTerm ||
          sortBy !== "creationDate" ||
          sortDirection != "desc"
        ) {
          setFilterError(`Error filtering/sorting todos: ${error.message}`);
        } else {
          setError(`Error fetching todos: ${error.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    }
    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

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

      //setTodoList(data.tasks);
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === tempId ? dataNewTodo : todo)),
      );
      invalidateCache();
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
          //createdTime: origTodo.createdTime, //createdAt on server, but doesn't work
        }),
        credentials: "include",
      };
      const response = await fetch(`/api/tasks/${id}`, options);

      if (!response.ok) {
        throw new Error("Failed to complete todo");
      }
      invalidateCache();
      //const dataCompletedTodo = await response.json(); not needed, logged to visualize
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
          //createdTime: editedTodo.createdTime, //createdAt on server, but doesn't work
        }),
        credentials: "include",
      };
      const response = await fetch(`/api/tasks/${editedTodo.id}`, options);

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
      //const dataUpdatedTodo = await response.json(); not needed, logged to visualize
    } catch (error) {
      console.error(error);
      setError(`Error: ${error.name} | ${error.message}`);

      //rollback
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === editedTodo.id ? origTodo : todo)),
      );
    }
  }

  const handleFilterChange = (newFilterTerm) => {
    setFilterTerm(newFilterTerm);
  };

  const invalidateCache = useCallback(() => {
    setDataVersion((prev) => prev + 1);
    //console.log("Invalidating memo cache after todo mutation");
  }, []);

  return (
    <>
      {" "}
      {error && (
        <div>
          <p>{error}</p>
          <button onClick={() => setError("")}>Clear Error</button>
        </div>
      )}
      {filterError && (
        <div>
          <p>{filterError}</p>
          <button onClick={() => setFilterError("")}>Clear Filter Error</button>
          <button
            onClick={() => {
              setFilterTerm("");
              setSortBy("creationDate");
              setSortDirection("desc");
              setFilterError("");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
      {isTodoListLoading && (
        <div>
          <p>Loading...</p>
        </div>
      )}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </>
  );
}

export default TodosPage;
