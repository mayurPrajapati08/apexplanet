const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-todo");
const listEl = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".todo-filters button");

let todos = [];

// Load from localStorage
function loadTodos() {
  const saved = localStorage.getItem("portfolio_todos");
  todos = saved ? JSON.parse(saved) : [];
}

// Save to localStorage
function saveTodos() {
  localStorage.setItem("portfolio_todos", JSON.stringify(todos));
}

// Render list
function renderTodos(filter = "all") {
  listEl.innerHTML = "";

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  filtered.forEach((todo) => {
    const item = document.createElement("div");
    item.className = "todo-item" + (todo.completed ? " completed" : "");
    item.dataset.id = todo.id;

    const span = document.createElement("span");
    span.textContent = todo.text;

    const actions = document.createElement("div");

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = todo.completed ? "Undo" : "Done";
    toggleBtn.className = "btn btn-outline";
    toggleBtn.style.fontSize = "0.75rem";

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "btn btn-outline";
    delBtn.style.fontSize = "0.75rem";

    actions.appendChild(toggleBtn);
    actions.appendChild(delBtn);

    item.appendChild(span);
    item.appendChild(actions);
    listEl.appendChild(item);

    toggleBtn.addEventListener("click", () => toggleTodo(todo.id));
    delBtn.addEventListener("click", () => deleteTodo(todo.id));
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  todos.push({
    id: Date.now(),
    text,
    completed: false
  });

  todoInput.value = "";
  saveTodos();
  renderTodos(currentFilter);
}

function toggleTodo(id) {
  todos = todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos();
  renderTodos(currentFilter);
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos(currentFilter);
}

let currentFilter = "all";

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTodos(currentFilter);
  });
});

addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

loadTodos();
renderTodos();
