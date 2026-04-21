import "./App.css";
import { useState } from "react";
import TodoList from "./TodoList.jsx";
import TodoForm from "./TodoForm.jsx";

function App() {
  const [todoList, setTodoList] = useState([]);

  function addTodo(todoTitle) {
    const newTodo = {
      //can be just title since they have the same name
      title: todoTitle,
      id: Date.now(),
    };

    setTodoList((previous) => [newTodo, ...previous]);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;
