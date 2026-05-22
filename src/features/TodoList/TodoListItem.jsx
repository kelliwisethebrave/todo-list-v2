import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle } from "../../utils/todoValidation.js";
import { useEditableTitle } from "../../hooks/useEditableTitle.js";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit,
  } = useEditableTitle(todo.title);

  {
    /*} BELOW ARE PRE-CUSTOM HOOK FUNCTIONS USED
  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }
  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }
  function handleUpdate(event) {
    if (!isEditing) {
      return;
    }

    event.preventDefault();
    onUpdateTodo({ ...todo, title: workingTitle });
    setIsEditing(false);
  }*/
  }

  return (
    <li>
      <form
        onSubmit={(event) => {
          if (!isEditing) return;
          event.preventDefault();
          const finalTitle = finishEdit();
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
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
            <button
              type="button"
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
          </>
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
            <span onClick={() => startEditing()}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}
export default TodoListItem;
