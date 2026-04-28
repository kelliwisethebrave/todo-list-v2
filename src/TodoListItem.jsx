function TodoListItem({ todo, onCompleteTodo }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => onCompleteTodo(todo.id)}
      />
      {/* set the `type` prop to "checkbox" */}
      {/* add the `checked` props */}
      {/* add `onChange` event listener that uses the `onCompleteTodo` helper` */}
      {todo.title}
    </li>
  );
}
export default TodoListItem;
