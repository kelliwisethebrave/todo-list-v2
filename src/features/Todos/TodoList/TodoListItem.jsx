import TextInputWithLabel from "../../../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle } from "../../../utils/todoValidation.js";
import { useEditableTitle } from "../../../hooks/useEditableTitle.js";
import { sanitizeInput } from "../../../utils/sanitizeInput.js";
import styles from "./TodoListItem.module.css";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
  const {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit,
  } = useEditableTitle(todo.title);

  return (
    <li
      className={
        todo.isCompleted
          ? `${styles.todoItem} ${styles.completed}`
          : styles.todoItem
      }
    >
      <form
        className={`${styles.form} ${isEditing ? styles.editForm : styles.viewForm}`}
        onSubmit={(event) => {
          event.preventDefault();

          if (!isEditing || !isValidTodoTitle(workingTitle)) {
            return;
          }

          const sanitizedTitle = sanitizeInput(workingTitle);

          // sanitizing could make title invalid
          if (!isValidTodoTitle(sanitizedTitle)) {
            return;
          }

          finishEdit();
          onUpdateTodo({
            ...todo,
            title: sanitizedTitle,
          });
        }}
      >
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`editTodo-${todo.id}`}
              labelText="Edit Todo"
              value={workingTitle}
              onChange={(event) => updateTitle(event.target.value)}
            />
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={cancelEdit}
              >
                Cancel
              </button>
              <button type="submit" className={styles.updateButton}>
                Update
              </button>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => onDeleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="checkbox"
              id={`checkbox${todo.id}`}
              className={styles.checkbox}
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />

            <span
              onClick={() => startEditing()}
              className={
                todo.isCompleted
                  ? `${styles.todoTitle} ${styles.completedText}`
                  : styles.todoTitle
              }
            >
              {todo.title}
            </span>
          </>
        )}
      </form>
    </li>
  );
}
export default TodoListItem;
