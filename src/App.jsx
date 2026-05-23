import "./App.css";
import TodosPage from "./features/Todos/TodosPage.jsx";
import Header from "./shared/Header.jsx";

function App() {
  return (
    <div>
      <Header />
      <TodosPage />
    </div>
  );
}

export default App;
