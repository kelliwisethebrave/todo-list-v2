import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";

function TodoListItem({ todo, onCompleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <li>
      {isEditing ? (
        <TextInputWithLabel value={todo.title} />
      ) : (
        <>
          <input
            type="checkbox"
            id={`checkbox${todo.id}`}
            checked={todo.isCompleted}
            onChange={() => onCompleteTodo(todo.id)}
          />
          {/* set the `type` prop to "checkbox" */}
          {/* add the `checked` props */}
          {/* add `onChange` event listener that uses the `onCompleteTodo` helper` */}
          <span onClick={() => setIsEditing(true)}>{todo.title}</span>
        </>
      )}
    </li>
  );
}
export default TodoListItem;
