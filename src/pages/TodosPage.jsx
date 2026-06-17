import { useEffect, useCallback, useReducer } from "react";
import TodoForm from "../features/Todos/TodoForm.jsx";
import TodoList from "../features/Todos/TodoList/TodoList.jsx";
import SortBy from "../shared/SortBy.jsx";
import useDebounce from "../utils/useDebounce.js";
import FilterInput from "../shared/FilterInput.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from "../reducers/todoReducer.js";
import { useSearchParams } from "react-router";
import StatusFilter from "../shared/StatusFilter.jsx";
import styles from "./TodosPage.module.css";

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const statusFilter = searchParams.get("status") || "all";

  useEffect(() => {
    async function fetchTodos() {
      dispatch({ type: TODO_ACTIONS.FETCH_START });

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

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { todos: data.tasks },
        });
      } catch (error) {
        if (
          debouncedFilterTerm ||
          sortBy !== "creationDate" ||
          sortDirection != "desc"
        ) {
          dispatch({
            type: TODO_ACTIONS.FETCH_FILTER_ERROR,
            payload: {
              message: `Error filtering/sorting todos: ${error.message}`,
            },
          });
        } else {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              message: `Error fetching todos: ${error.message}`,
            },
          });
        }
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

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: { tempTodo: newTodo },
    });
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

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: { tempId, dataNewTodo },
      });

      invalidateCache();
    } catch (error) {
      //remove todo that didn't save to the server

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: { message: `Error: ${error.name} | ${error.message}`, tempId },
      });
    }
  }

  async function completeTodo(id) {
    //save for rollback
    const origTodo = todoList.find((todo) => todo.id === id);
    //takes id
    //maps through todoList

    //if the current todo.id matches the id, return a new object that
    //destructures the current todo and isCompleted is set to true
    //otherwise (if todo.id does not match the id) return the todo
    //saves the resulting array to a const updatedTodos
    //update the todoList with updatedTodos

    //setTodoList(updatedTodos);
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { id },
    });

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
          createdAt: origTodo.createdTime,
        }),
        credentials: "include",
      };
      const response = await fetch(`/api/tasks/${id}`, options);

      if (!response.ok) {
        throw new Error("Failed to complete todo");
      }
      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });

      invalidateCache();
      //const dataCompletedTodo = await response.json(); not needed, logged to visualize
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          message: `Error: ${error.name} | ${error.message}`,
          id,
          origTodo,
        },
      });
    }
  }

  async function updateTodo(editedTodo) {
    //save for rollback
    const origTodo = todoList.find((todo) => todo.id === editedTodo.id);

    dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: { editedTodo } });

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
          createdAt: editedTodo.createdTime,
        }),
        credentials: "include",
      };
      const response = await fetch(`/api/tasks/${editedTodo.id}`, options);

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
      invalidateCache();
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          message: `Error: ${error.name} | ${error.message}`,
          id: editedTodo.id,
          origTodo,
        },
      });
    }
  }

  const handleFilterChange = (newFilterTerm) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: newFilterTerm });
  };

  const invalidateCache = useCallback(() => {
    dispatch({ type: TODO_ACTIONS.INVALIDATE_CACHE });
  }, []);

  return (
    <div className={styles.page}>
      {" "}
      {error && (
        <div>
          <p className="error">{error}</p>
          <button
            className={styles.clearErrorButton}
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
          >
            Clear Error
          </button>
        </div>
      )}
      {filterError && (
        <div>
          <p className="error">{filterError}</p>
          <button
            className={styles.clearFilterErrorButton}
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
          >
            Clear Filter Error
          </button>
          <button
            className={styles.resetFiltersButton}
            onClick={() => {
              dispatch({ type: TODO_ACTIONS.RESET_FILTERS });
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
      {isTodoListLoading && (
        <div className="loadingContainer">
          <div className="spinner"></div>
          <p className="loading">Loading...</p>
        </div>
      )}
      <div className={styles.controlsPanel}>
        <SortBy
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortByChange={(newSortBy) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: { sortBy: newSortBy, sortDirection },
            })
          }
          onSortDirectionChange={(newSortDirection) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: { sortBy, sortDirection: newSortDirection },
            })
          }
        />
        <StatusFilter />
        <FilterInput
          filterTerm={filterTerm}
          onFilterChange={handleFilterChange}
        />
      </div>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;
