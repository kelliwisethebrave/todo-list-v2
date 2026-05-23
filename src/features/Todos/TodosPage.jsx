import { useState } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList.jsx";
import TodoListItem from "./TodoList/TodoListItem.jsx";

function TodosPage() {
  const [todoList, setTodoList] = useState([]);
  function addTodo(todoTitle) {
    const newTodo = {
      //can be just title since they have the same name
      title: todoTitle,
      id: Date.now(),
      isCompleted: false,
    };

    setTodoList((previous) => [newTodo, ...previous]);
  }

  function completeTodo(id) {
    //takes id
    //maps through todoList
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      } else {
        return todo;
      }
    });

    //if the current todo.id matches the id, return a new object that
    //destructures the current todo and isCompleted is set to true
    //otherwise (if todo.id does not match the id) return the todo
    //saves the resulting array to a const updatedTodos
    //update the todoList with updatedTodos
    setTodoList(updatedTodos);
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
      } else {
        return todo;
      }
    });
    setTodoList(updatedTodos);
  }

  return (
    <>
      {" "}
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </>
  );
}

export default TodosPage;
