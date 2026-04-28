function TodoListItem({ todo, onCompleteTodo }) {
  return (
    <li>
      <form>
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onCompleteTodo(todo.id)}
        />
        {/* set the `type` prop to "checkbox" */}
        {/* add the `checked` props */}
        {/* add `onChange` event listener that uses the `onCompleteTodo` helper` */}
        {todo.title}
      </form>
    </li>
  );
}
export default TodoListItem;
