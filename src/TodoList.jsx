import TodoListItem from "./TodoListItem.jsx";

function TodoList({ todoList }) {
  return (
    <ul>
      {todoList.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} />
      ))}

      {/* before destructuring 
          <ul>
      {todoList.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
        </ul>
        */}
    </ul>
  );
}

export default TodoList;
