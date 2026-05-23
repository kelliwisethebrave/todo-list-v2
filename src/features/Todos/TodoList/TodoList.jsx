import TodoListItem from "./TodoListItem.jsx";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo }) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  return (
    <>
      {filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul>
          {filteredTodoList.map((todo) => (
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
