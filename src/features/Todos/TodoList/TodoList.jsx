import TodoListItem from "./TodoListItem.jsx";
import { useMemo } from "react";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, dataVersion }) {
  //const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  const filteredTodoList = useMemo(() => {
    console.log(`Recalculating filtered todos (v${dataVersion})`);
    return {
      version: dataVersion,
      todos: todoList.filter((todo) => !todo.isCompleted),
    };
  }, [todoList, dataVersion]);

  return (
    <>
      {filteredTodoList.todos.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul>
          {filteredTodoList.todos.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}

          {/* before destructuring 
          <ul>
      {todoList.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
        </ul>
        */}
        </ul>
      )}
    </>
  );
}

export default TodoList;
