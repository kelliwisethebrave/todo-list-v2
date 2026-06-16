import TextInputWithLabel from "../../../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle } from "../../../utils/todoValidation.js";
import { useEditableTitle } from "../../../hooks/useEditableTitle.js";
import { sanitizeInput } from "../../../utils/sanitizeInput.js";
import styles from "./TodoListItem.module.css";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
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
          if (!isEditing) return;
          event.preventDefault();
          const finalTitle = sanitizeInput(finishEdit());
          onUpdateTodo({ ...todo, title: finalTitle });
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
              <button
                type="button"
                className={styles.updateButton}
                onClick={(event) => {
                  if (!isEditing) return;
                  event.preventDefault();
                  const finalTitle = finishEdit();
                  onUpdateTodo({ ...todo, title: finalTitle });
                }}
                disabled={!isValidTodoTitle(workingTitle)}
              >
                Update
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
