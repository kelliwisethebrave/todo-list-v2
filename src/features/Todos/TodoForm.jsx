import { useRef, useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle } from "../../utils/todoValidation.js";
import styles from "./TodoForm.module.css";

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const inputRef = useRef();

  const handleAddTodo = (event) => {
    event.preventDefault();

    // .trim prevents whitespace only todos
    //const todoTitle = event.target.todoTitle.value.trim();
    //if (todoTitle && todoTitle !== "") {
    onAddTodo(workingTodoTitle.trim());
    //event.target.reset();
    setWorkingTodoTitle("");
    inputRef.current.focus();
  };

  return (
    <form onSubmit={handleAddTodo} className={styles.form}>
      <TextInputWithLabel
        ref={inputRef}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        elementId="todoTitle"
        labelText="Todo"
      />

      <button
        className={styles.primaryButton}
        type="submit"
        disabled={!isValidTodoTitle(workingTodoTitle)}
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
