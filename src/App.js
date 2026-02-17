import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost/api/";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const loadTodos = async () => {
    try {
      const res = await fetch(`${API}/todos`);
      if (res.ok) {
        setTodos(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;
    
    try {
      await fetch(`${API}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() })
      });
      setTitle("");
      loadTodos();
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      await fetch(`${API}/todos/${id}`, { method: "PUT" });
      loadTodos();
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API}/todos/${id}`, { method: "DELETE" });
      loadTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <div className="container">
      <h2>✨ Tasks</h2>

      <form className="input-group" onSubmit={addTodo}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />
        <button type="submit" className="add-btn">Add</button>
      </form>

      <ul>
        {todos.length === 0 ? (
          <li style={{ justifyContent: 'center', color: 'var(--text-muted)' }}>No tasks yet!</li>
        ) : (
          todos.map(todo => (
            <li key={todo.id}>
              <div 
                className={`checkbox ${todo.completed ? 'checked' : ''}`}
                onClick={() => toggleTodo(todo.id)}
              />
              <span
                className={`todo-text ${todo.completed ? 'completed' : ''}`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.title}
              </span>
              <button 
                className="delete-btn" 
                onClick={() => deleteTodo(todo.id)}
                title="Delete task"
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
